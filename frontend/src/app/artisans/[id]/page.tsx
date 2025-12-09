'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/Button';

interface Artisan {
  id: string;
  fullName: string;
  city: string;
  phone?: string;
  email?: string;
  rating: number;
  totalReviews: number;
  isAvailable: boolean;
  isVerified: boolean;
  bio?: string;
  experience: number;
  completedJobs: number;
  responseTime?: string;
  services: { category: string; name: string; price?: string }[];
  portfolio?: { image: string; title: string }[];
  availability?: Record<string, string>;
  reviews?: {
    id: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}

const categoryIcons: Record<string, string> = {
  plumbing: '🔧',
  electrical: '⚡',
  carpentry: '🪚',
  painting: '🎨',
  hvac: '❄️',
  cleaning: '🧹',
  gardening: '🌱',
  masonry: '🧱',
  locksmith: '🔐',
  appliance: '🔌',
  moving: '📦',
  other: '🔨',
};

const categoryLabels: Record<string, string> = {
  plumbing: 'Plomberie',
  electrical: 'Électricité',
  carpentry: 'Menuiserie',
  painting: 'Peinture',
  hvac: 'Climatisation',
  cleaning: 'Nettoyage',
  gardening: 'Jardinage',
  masonry: 'Maçonnerie',
  locksmith: 'Serrurerie',
  appliance: 'Électroménager',
  moving: 'Déménagement',
  other: 'Autre',
};

const defaultAvailability = {
  Lundi: '08:00 - 18:00',
  Mardi: '08:00 - 18:00',
  Mercredi: '08:00 - 18:00',
  Jeudi: '08:00 - 18:00',
  Vendredi: '08:00 - 18:00',
  Samedi: '09:00 - 14:00',
  Dimanche: 'Fermé',
};

export default function ArtisanProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { t } = useLanguage();
  const resolvedParams = use(params);
  const [activeTab, setActiveTab] = useState<'about' | 'portfolio' | 'reviews'>('about');
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArtisan = async () => {
      try {
        const response = await fetch(`/api/artisans/${resolvedParams.id}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Artisan non trouvé');
          return;
        }

        setArtisan(data.artisan);
      } catch (err) {
        setError('Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchArtisan();
  }, [resolvedParams.id]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-amber-400' : 'text-gray-200'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <svg className="animate-spin h-12 w-12 text-emerald-600" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  if (error || !artisan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{error || 'Artisan non trouvé'}</h2>
          <Link href="/artisans">
            <Button variant="primary">Retour à la liste</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 pt-8 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/artisans" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour aux artisans
          </Link>
        </div>
      </div>

      {/* Profile Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Top Section */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-4xl sm:text-5xl font-bold shadow-lg">
                  {artisan.fullName.charAt(0)}
                </div>
                {artisan.isAvailable && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white" title="Disponible" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{artisan.fullName}</h1>
                      {artisan.isVerified && (
                        <svg className="w-6 h-6 text-emerald-500" fill="currentColor" viewBox="0 0 20 20" title="Vérifié">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <p className="text-gray-500 flex items-center gap-1 mt-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {artisan.city}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex">{renderStars(artisan.rating)}</div>
                      <span className="font-semibold">{artisan.rating.toFixed(1)}</span>
                      <span className="text-gray-400">({artisan.totalReviews} avis)</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {artisan.phone && (
                      <a href={`tel:${artisan.phone}`}>
                        <Button variant="outline" className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          Appeler
                        </Button>
                      </a>
                    )}
                    <Link href={`/book/${artisan.id}`}>
                      <Button variant="primary">{t('bookNow')}</Button>
                    </Link>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{artisan.experience}</p>
                    <p className="text-sm text-gray-500">Années d'exp.</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{artisan.completedJobs}</p>
                    <p className="text-sm text-gray-500">Travaux réalisés</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{artisan.responseTime || '< 1h'}</p>
                    <p className="text-sm text-gray-500">Temps de réponse</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-gray-100">
            <div className="flex">
              {(['about', 'portfolio', 'reviews'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-4 text-center font-medium transition-colors ${
                    activeTab === tab
                      ? 'text-emerald-600 border-b-2 border-emerald-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab === 'about' && 'À propos'}
                  {tab === 'portfolio' && 'Portfolio'}
                  {tab === 'reviews' && `Avis (${artisan.totalReviews})`}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-8">
            {/* About Tab */}
            {activeTab === 'about' && (
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  {/* Bio */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
                    <p className="text-gray-600 leading-relaxed">
                      {artisan.bio || 'Artisan professionnel disponible pour tous vos travaux.'}
                    </p>
                  </div>

                  {/* Services */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Services proposés</h2>
                    <div className="space-y-3">
                      {artisan.services.map((service, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{categoryIcons[service.category] || '🔨'}</span>
                            <span className="font-medium text-gray-900">
                              {categoryLabels[service.category] || service.name}
                            </span>
                          </div>
                          <span className="text-emerald-600 font-medium">{service.price || 'Sur devis'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Availability */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Disponibilité</h3>
                    <div className="space-y-2 text-sm">
                      {Object.entries(defaultAvailability).map(([day, hours]) => (
                        <div key={day} className="flex justify-between">
                          <span className="text-gray-500">{day}</span>
                          <span className={hours === 'Fermé' ? 'text-red-500' : 'text-gray-900'}>
                            {hours}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="bg-emerald-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Contact</h3>
                    <div className="space-y-3">
                      {artisan.phone && (
                        <a
                          href={`tel:${artisan.phone}`}
                          className="flex items-center gap-3 text-gray-600 hover:text-emerald-600 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {artisan.phone}
                        </a>
                      )}
                      {artisan.email && (
                        <a
                          href={`mailto:${artisan.email}`}
                          className="flex items-center gap-3 text-gray-600 hover:text-emerald-600 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {artisan.email}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Portfolio Tab */}
            {activeTab === 'portfolio' && (
              <div>
                {artisan.portfolio && artisan.portfolio.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {artisan.portfolio.map((item, index) => (
                      <div
                        key={index}
                        className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-pointer"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                          <span className="text-6xl">{categoryIcons[artisan.services[0]?.category] || '🔧'}</span>
                        </div>
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                          <p className="text-white font-medium">{item.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500">Aucune photo dans le portfolio pour le moment</p>
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div>
                {artisan.reviews && artisan.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {artisan.reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-gray-600 font-medium">{review.userName.charAt(0)}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div>
                                <p className="font-medium text-gray-900">{review.userName}</p>
                                <div className="flex items-center gap-1 mt-0.5">
                                  {renderStars(review.rating)}
                                </div>
                              </div>
                              <span className="text-sm text-gray-400">{review.date}</span>
                            </div>
                            <p className="text-gray-600 mt-2">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <p className="text-gray-500">Aucun avis pour le moment</p>
                    <p className="text-sm text-gray-400 mt-1">Soyez le premier à laisser un avis!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
