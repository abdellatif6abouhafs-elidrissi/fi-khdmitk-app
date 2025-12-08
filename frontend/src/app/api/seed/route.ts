import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Artisan from '@/models/Artisan';

const sampleArtisans = [
  {
    user: {
      fullName: 'Ahmed Ben Ali',
      email: 'ahmed@example.com',
      phone: '+212 6XX XXX XXX',
      password: 'password123',
      city: 'Casablanca',
      role: 'artisan',
      isVerified: true,
    },
    artisan: {
      bio: 'Plombier professionnel avec plus de 15 ans d\'expérience. Spécialisé dans les réparations d\'urgence et les installations sanitaires.',
      experience: 15,
      services: [
        { category: 'plumbing', name: 'Plomberie', price: '150-300 MAD/h' },
        { category: 'hvac', name: 'Climatisation', price: '200-400 MAD/h' },
      ],
      rating: 4.9,
      totalReviews: 127,
      completedJobs: 245,
      isAvailable: true,
    },
  },
  {
    user: {
      fullName: 'Fatima Zahra',
      email: 'fatima@example.com',
      phone: '+212 6XX XXX XXX',
      password: 'password123',
      city: 'Rabat',
      role: 'artisan',
      isVerified: true,
    },
    artisan: {
      bio: 'Électricienne certifiée. Travaux électriques résidentiels et commerciaux. Disponible 7j/7.',
      experience: 8,
      services: [
        { category: 'electrical', name: 'Électricité', price: '200-350 MAD/h' },
      ],
      rating: 4.8,
      totalReviews: 98,
      completedJobs: 180,
      isAvailable: true,
    },
  },
  {
    user: {
      fullName: 'Youssef El Amrani',
      email: 'youssef@example.com',
      phone: '+212 6XX XXX XXX',
      password: 'password123',
      city: 'Marrakech',
      role: 'artisan',
      isVerified: false,
    },
    artisan: {
      bio: 'Menuisier artisan. Fabrication de meubles sur mesure et restauration de pièces anciennes.',
      experience: 12,
      services: [
        { category: 'carpentry', name: 'Menuiserie', price: '250-500 MAD/h' },
      ],
      rating: 4.7,
      totalReviews: 85,
      completedJobs: 150,
      isAvailable: false,
    },
  },
  {
    user: {
      fullName: 'Khadija Bennani',
      email: 'khadija@example.com',
      phone: '+212 6XX XXX XXX',
      password: 'password123',
      city: 'Fès',
      role: 'artisan',
      isVerified: true,
    },
    artisan: {
      bio: 'Service de nettoyage professionnel pour particuliers et entreprises. Produits écologiques.',
      experience: 5,
      services: [
        { category: 'cleaning', name: 'Nettoyage', price: '100-200 MAD/h' },
      ],
      rating: 4.9,
      totalReviews: 156,
      completedJobs: 320,
      isAvailable: true,
    },
  },
  {
    user: {
      fullName: 'Mohamed Alaoui',
      email: 'mohamed@example.com',
      phone: '+212 6XX XXX XXX',
      password: 'password123',
      city: 'Casablanca',
      role: 'artisan',
      isVerified: true,
    },
    artisan: {
      bio: 'Peintre décorateur. Peinture intérieure, extérieure et décoration murale personnalisée.',
      experience: 10,
      services: [
        { category: 'painting', name: 'Peinture', price: '150-300 MAD/h' },
      ],
      rating: 4.6,
      totalReviews: 72,
      completedJobs: 120,
      isAvailable: true,
    },
  },
  {
    user: {
      fullName: 'Rachid Tahiri',
      email: 'rachid@example.com',
      phone: '+212 6XX XXX XXX',
      password: 'password123',
      city: 'Tanger',
      role: 'artisan',
      isVerified: true,
    },
    artisan: {
      bio: 'Maçon qualifié. Construction, rénovation et travaux de gros œuvre.',
      experience: 20,
      services: [
        { category: 'masonry', name: 'Maçonnerie', price: '200-400 MAD/h' },
      ],
      rating: 4.8,
      totalReviews: 94,
      completedJobs: 200,
      isAvailable: true,
    },
  },
];

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({ role: 'artisan' });
    await Artisan.deleteMany({});

    // Create sample artisans
    for (const data of sampleArtisans) {
      const user = await User.create(data.user);
      await Artisan.create({
        ...data.artisan,
        user: user._id,
      });
    }

    // Create a sample customer
    const existingCustomer = await User.findOne({ email: 'client@example.com' });
    if (!existingCustomer) {
      await User.create({
        fullName: 'Client Test',
        email: 'client@example.com',
        phone: '+212 6XX XXX XXX',
        password: 'password123',
        city: 'Casablanca',
        role: 'customer',
      });
    }

    return NextResponse.json({
      message: 'Base de données initialisée avec succès',
      artisansCreated: sampleArtisans.length,
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de l\'initialisation' },
      { status: 500 }
    );
  }
}
