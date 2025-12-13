// Generate 6-digit verification code
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send verification email using EmailJS REST API
export async function sendVerificationEmail(
  email: string,
  code: string,
  fullName: string
): Promise<{ success: boolean; error?: string }> {
  // Get environment variables at runtime (important for Vercel serverless)
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey || !privateKey) {
    return { success: false, error: 'Email configuration missing' };
  }

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        accessToken: privateKey,
        template_params: {
          to_email: email,
          to_name: fullName,
          verification_code: code,
        },
      }),
    });

    if (response.ok || response.status === 200) {
      return { success: true };
    } else {
      const responseText = await response.text();
      return { success: false, error: responseText || 'Failed to send email' };
    }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to send email' };
  }
}

// Send password reset email
export async function sendPasswordResetEmail(
  email: string,
  code: string,
  fullName: string
): Promise<{ success: boolean; error?: string }> {
  return sendVerificationEmail(email, code, fullName);
}

// Booking notification templates
interface BookingEmailParams {
  toEmail: string;
  toName: string;
  bookingDate: string;
  bookingTime: string;
  serviceName: string;
  artisanName?: string;
  customerName?: string;
  status: string;
  message?: string;
}

// Send booking notification email
export async function sendBookingNotificationEmail(
  params: BookingEmailParams
): Promise<{ success: boolean; error?: string }> {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_BOOKING_TEMPLATE_ID || process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey || !privateKey) {
    console.log('Email config missing, skipping notification');
    return { success: true };
  }

  const statusMessages: Record<string, string> = {
    pending: 'Une nouvelle réservation a été créée',
    confirmed: 'Votre réservation a été confirmée',
    in_progress: 'Votre réservation est en cours',
    completed: 'Votre réservation a été terminée',
    cancelled: 'Votre réservation a été annulée',
  };

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        accessToken: privateKey,
        template_params: {
          to_email: params.toEmail,
          to_name: params.toName,
          subject: statusMessages[params.status] || 'Mise à jour de votre réservation',
          booking_date: params.bookingDate,
          booking_time: params.bookingTime,
          service_name: params.serviceName,
          artisan_name: params.artisanName || '',
          customer_name: params.customerName || '',
          status: params.status,
          message: params.message || statusMessages[params.status],
        },
      }),
    });

    if (response.ok || response.status === 200) {
      return { success: true };
    }
    return { success: true };
  } catch (error: any) {
    console.error('Email error:', error.message);
    return { success: true };
  }
}
