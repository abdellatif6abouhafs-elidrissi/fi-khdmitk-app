import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Artisan from '@/models/Artisan';
import Booking from '@/models/Booking';
import Review from '@/models/Review';

const sampleArtisans = [
  {
    user: {
      fullName: 'Ahmed Ben Ali',
      email: 'ahmed@demo.com',
      phone: '+212 661 234 567',
      password: 'artisan123',
      city: 'casablanca',
      role: 'artisan' as const,
      isVerified: true,
    },
    artisan: {
      bio: 'Plombier professionnel avec plus de 15 ans d\'expérience. Spécialisé dans les réparations d\'urgence et les installations sanitaires.',
      experience: 15,
      services: [
        { category: 'plumbing', name: 'Plomberie', price: '150-300 MAD/h' },
      ],
      rating: 4.9,
      totalReviews: 0,
      completedJobs: 245,
      isAvailable: true,
    },
  },
  {
    user: {
      fullName: 'Fatima Zahra Bennani',
      email: 'fatima@demo.com',
      phone: '+212 662 345 678',
      password: 'artisan123',
      city: 'rabat',
      role: 'artisan' as const,
      isVerified: true,
    },
    artisan: {
      bio: 'Électricienne certifiée. Travaux électriques résidentiels et commerciaux. Disponible 7j/7.',
      experience: 8,
      services: [
        { category: 'electrical', name: 'Électricité', price: '200-350 MAD/h' },
      ],
      rating: 4.8,
      totalReviews: 0,
      completedJobs: 180,
      isAvailable: true,
    },
  },
  {
    user: {
      fullName: 'Youssef El Amrani',
      email: 'youssef@demo.com',
      phone: '+212 663 456 789',
      password: 'artisan123',
      city: 'marrakech',
      role: 'artisan' as const,
      isVerified: true,
    },
    artisan: {
      bio: 'Menuisier artisan. Fabrication de meubles sur mesure et restauration de pièces anciennes.',
      experience: 12,
      services: [
        { category: 'carpentry', name: 'Menuiserie', price: '250-500 MAD/h' },
      ],
      rating: 4.7,
      totalReviews: 0,
      completedJobs: 150,
      isAvailable: true,
    },
  },
  {
    user: {
      fullName: 'Khadija Alaoui',
      email: 'khadija@demo.com',
      phone: '+212 664 567 890',
      password: 'artisan123',
      city: 'fes',
      role: 'artisan' as const,
      isVerified: true,
    },
    artisan: {
      bio: 'Service de nettoyage professionnel pour particuliers et entreprises. Produits écologiques.',
      experience: 5,
      services: [
        { category: 'cleaning', name: 'Nettoyage', price: '100-200 MAD/h' },
      ],
      rating: 4.9,
      totalReviews: 0,
      completedJobs: 320,
      isAvailable: true,
    },
  },
  {
    user: {
      fullName: 'Mohamed Tazi',
      email: 'mohamed@demo.com',
      phone: '+212 665 678 901',
      password: 'artisan123',
      city: 'casablanca',
      role: 'artisan' as const,
      isVerified: true,
    },
    artisan: {
      bio: 'Peintre décorateur. Peinture intérieure, extérieure et décoration murale personnalisée.',
      experience: 10,
      services: [
        { category: 'painting', name: 'Peinture', price: '150-300 MAD/h' },
      ],
      rating: 4.6,
      totalReviews: 0,
      completedJobs: 120,
      isAvailable: true,
    },
  },
  {
    user: {
      fullName: 'Rachid Tahiri',
      email: 'rachid@demo.com',
      phone: '+212 666 789 012',
      password: 'artisan123',
      city: 'tangier',
      role: 'artisan' as const,
      isVerified: true,
    },
    artisan: {
      bio: 'Maçon qualifié. Construction, rénovation et travaux de gros œuvre.',
      experience: 20,
      services: [
        { category: 'masonry', name: 'Maçonnerie', price: '200-400 MAD/h' },
      ],
      rating: 4.8,
      totalReviews: 0,
      completedJobs: 200,
      isAvailable: true,
    },
  },
  {
    user: {
      fullName: 'Hassan Berrada',
      email: 'hassan@demo.com',
      phone: '+212 667 890 123',
      password: 'artisan123',
      city: 'casablanca',
      role: 'artisan' as const,
      isVerified: true,
    },
    artisan: {
      bio: 'Technicien climatisation et chauffage. Installation, entretien et réparation de systèmes HVAC.',
      experience: 12,
      services: [
        { category: 'hvac', name: 'Climatisation', price: '250-450 MAD/h' },
      ],
      rating: 4.7,
      totalReviews: 0,
      completedJobs: 175,
      isAvailable: true,
    },
  },
  {
    user: {
      fullName: 'Omar Benjelloun',
      email: 'omar@demo.com',
      phone: '+212 668 901 234',
      password: 'artisan123',
      city: 'agadir',
      role: 'artisan' as const,
      isVerified: true,
    },
    artisan: {
      bio: 'Jardinier paysagiste. Création et entretien de jardins, installation d\'arrosage automatique.',
      experience: 7,
      services: [
        { category: 'gardening', name: 'Jardinage', price: '120-200 MAD/h' },
      ],
      rating: 4.5,
      totalReviews: 0,
      completedJobs: 95,
      isAvailable: true,
    },
  },
];

const reviewsTemplates = [
  { rating: 5, comment: 'Excellent travail, très professionnel et ponctuel. Je recommande vivement!' },
  { rating: 5, comment: 'Service impeccable! Artisan très réactif et travail de qualité.' },
  { rating: 4, comment: 'Bon service, travail de qualité. Petit retard mais rien de grave.' },
  { rating: 5, comment: 'Très satisfait du travail réalisé. Prix raisonnable et bon résultat.' },
  { rating: 5, comment: 'Artisan compétent et sympathique. Travail soigné.' },
  { rating: 4, comment: 'Bonne prestation dans l\'ensemble. À recommander.' },
  { rating: 4, comment: 'Satisfait du résultat. Communication claire et travail propre.' },
  { rating: 5, comment: 'Parfait! Exactement ce que j\'attendais. Merci!' },
];

export async function POST(request: NextRequest) {
  try {
    // Check for admin key (simple protection)
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (key !== 'fi-khidmatik-seed-2024') {
      return NextResponse.json(
        { error: 'Clé d\'autorisation requise. Utilisez ?key=fi-khidmatik-seed-2024' },
        { status: 401 }
      );
    }

    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Artisan.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});

    // Create a sample customer
    const customer = await User.create({
      fullName: 'Client Demo',
      email: 'client@demo.com',
      phone: '+212 600 000 000',
      password: 'demo123',
      city: 'casablanca',
      role: 'customer',
    });

    // Create sample artisans
    const createdArtisans = [];
    for (const data of sampleArtisans) {
      const user = await User.create(data.user);
      const artisan = await Artisan.create({
        ...data.artisan,
        user: user._id,
      });
      createdArtisans.push({ user, artisan });
    }

    // Create bookings and reviews for each artisan
    const statuses: ('pending' | 'confirmed' | 'completed' | 'cancelled')[] = ['pending', 'confirmed', 'completed', 'completed'];
    const times = ['09:00', '10:30', '14:00', '16:00'];
    const addresses = [
      '123 Avenue Hassan II, Casablanca',
      '45 Rue Mohamed V, Rabat',
      '78 Boulevard Zerktouni, Marrakech',
      '12 Rue Ibn Battouta, Fès',
    ];

    for (let i = 0; i < createdArtisans.length; i++) {
      const { artisan } = createdArtisans[i];

      // Create a booking for demo
      const bookingDate = new Date();
      bookingDate.setDate(bookingDate.getDate() + (i % 4) + 3);

      const booking = await Booking.create({
        customer: customer._id,
        artisan: artisan._id,
        service: artisan.services[0],
        status: statuses[i % 4],
        date: bookingDate,
        time: times[i % 4],
        address: addresses[i % 4],
        description: `Demande de service ${artisan.services[0].name}`,
        urgency: i === 0 ? 'urgent' : 'normal',
      });

      // Create completed bookings for reviews
      const numReviews = Math.floor(Math.random() * 4) + 2;
      let totalRating = 0;

      for (let j = 0; j < numReviews; j++) {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - Math.floor(Math.random() * 60) - 1);

        const completedBooking = await Booking.create({
          customer: customer._id,
          artisan: artisan._id,
          service: artisan.services[0],
          status: 'completed',
          date: pastDate,
          time: times[j % 4],
          address: addresses[j % 4],
          description: 'Service terminé',
          urgency: 'normal',
        });

        const reviewTemplate = reviewsTemplates[Math.floor(Math.random() * reviewsTemplates.length)];

        await Review.create({
          artisan: artisan._id,
          customer: customer._id,
          booking: completedBooking._id,
          rating: reviewTemplate.rating,
          comment: reviewTemplate.comment,
        });

        totalRating += reviewTemplate.rating;
      }

      // Update artisan rating
      artisan.rating = Math.round((totalRating / numReviews) * 10) / 10;
      artisan.totalReviews = numReviews;
      await artisan.save();
    }

    return NextResponse.json({
      message: 'Base de données initialisée avec succès!',
      data: {
        customers: 1,
        artisans: sampleArtisans.length,
        bookings: 'Multiple',
        reviews: 'Multiple',
      },
      credentials: {
        customer: { email: 'client@demo.com', password: 'demo123' },
        artisan: { email: 'ahmed@demo.com', password: 'artisan123' },
      },
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de l\'initialisation' },
      { status: 500 }
    );
  }
}
