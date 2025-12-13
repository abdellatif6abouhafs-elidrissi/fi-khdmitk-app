import webpush from 'web-push';
import connectDB from './mongodb';
import PushSubscription from '@/models/PushSubscription';

// Configure web-push with VAPID keys
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || '';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '';
const VAPID_EMAIL = process.env.VAPID_EMAIL || 'mailto:contact@fi-khidmatik.com';

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, any>;
}

// Send push notification to a specific user
export async function sendPushNotification(
  userId: string,
  payload: PushPayload
): Promise<{ success: boolean; sent: number; failed: number }> {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    console.log('VAPID keys not configured, skipping push notification');
    return { success: true, sent: 0, failed: 0 };
  }

  try {
    await connectDB();

    const subscriptions = await PushSubscription.find({ userId });

    if (subscriptions.length === 0) {
      return { success: true, sent: 0, failed: 0 };
    }

    const notificationPayload = JSON.stringify({
      title: payload.title,
      body: payload.body,
      icon: payload.icon || '/icon-192x192.png',
      badge: payload.badge || '/icon-72x72.png',
      tag: payload.tag || 'fi-khidmatik-' + Date.now(),
      data: payload.data || {},
    });

    let sent = 0;
    let failed = 0;

    await Promise.all(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.keys.p256dh,
                auth: sub.keys.auth,
              },
            },
            notificationPayload
          );
          sent++;
        } catch (error: any) {
          console.error('Push send error:', error.message);
          failed++;
          
          // Remove invalid subscriptions
          if (error.statusCode === 404 || error.statusCode === 410) {
            await PushSubscription.deleteOne({ _id: sub._id });
          }
        }
      })
    );

    return { success: true, sent, failed };
  } catch (error: any) {
    console.error('Push notification error:', error);
    return { success: false, sent: 0, failed: 0 };
  }
}

// Send push notification to multiple users
export async function sendPushToUsers(
  userIds: string[],
  payload: PushPayload
): Promise<void> {
  await Promise.all(userIds.map((userId) => sendPushNotification(userId, payload)));
}
