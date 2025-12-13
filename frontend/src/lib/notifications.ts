import Notification from '@/models/Notification';

interface CreateNotificationParams {
  userId: string;
  type: 'booking_new' | 'booking_confirmed' | 'booking_cancelled' | 'booking_completed' | 'review_received' | 'system';
  title: string;
  message: string;
  data?: {
    bookingId?: string;
    artisanId?: string;
    customerId?: string;
  };
}

export async function createNotification(params: CreateNotificationParams) {
  try {
    const notification = await Notification.create({
      user: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      data: params.data,
    });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
}

export const notificationMessages = {
  booking_new: (customerName: string, serviceName: string) => ({
    title: 'Nouvelle réservation',
    message: `${customerName} a demandé un service de ${serviceName}`,
  }),
  booking_confirmed: (artisanName: string) => ({
    title: 'Réservation confirmée',
    message: `${artisanName} a confirmé votre réservation`,
  }),
  booking_cancelled: (name: string, isArtisan: boolean) => ({
    title: 'Réservation annulée',
    message: isArtisan
      ? `${name} a annulé la réservation`
      : `Votre réservation avec ${name} a été annulée`,
  }),
  booking_completed: (artisanName: string) => ({
    title: 'Travail terminé',
    message: `Le travail de ${artisanName} est terminé. N'oubliez pas de laisser un avis!`,
  }),
  review_received: (customerName: string, rating: number) => ({
    title: 'Nouvel avis reçu',
    message: `${customerName} vous a donné ${rating} étoiles`,
  }),
};
