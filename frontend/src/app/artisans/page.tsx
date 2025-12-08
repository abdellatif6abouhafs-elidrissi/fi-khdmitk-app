'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { ArtisanCard } from '@/components/ArtisanCard';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const categories = [
  { value: '', label: 'Toutes les catégories' },
  { value: 'plumbing', label: 'Plomberie', icon: '🔧' },
  { value: 'electrical', label: 'Électricité', icon: '⚡' },
  { value: 'carpentry', label: 'Menuiserie', icon: '🪚' },
  { value: 'painting', label: 'Peinture', icon: '🎨' },
  { value: 'hvac', label: 'Climatisation', icon: '❄️' },
  { value: 'cleaning', label: 'Nettoyage', icon: '🧹' },
  { value: 'gardening', label: 'Jardinage', icon: '🌱' },
  { value: 'masonry', label: 'Maçonnerie', icon: '🧱' },
  { value: 'locksmith', label: 'Serrurerie', icon: '🔐' },
  { value: 'appliance', label: 'Électroménager', icon: '🔌' },
  { value: 'moving', label: 'Déménagement', icon: '📦' },
  { value: 'other', label: 'Autre', icon: '🔨' },
];

const cities = [
  { value: '', label: 'Toutes les villes' },
  { value: 'Casablanca', label: 'Casablanca' },
  { value: 'Rabat', label: 'Rabat' },
  { value: 'Marrakech', label: 'Marrakech' },
  { value: 'Fès', label: 'Fès' },
  { value: 'Tanger', label: 'Tanger' },
  { value: 'Agadir', label: 'Agadir' },
  { value: 'Meknès', label: 'Meknès' },
  { value: 'Oujda', label: 'Oujda' },
  { value: 'Kénitra', label: 'Kénitra' },
  { value: 'Tétouan', label: 'Tétouan' },
];

interface Artisan {
  id: string;
  fullName: string;
  city: string;
  rating: number;
  totalReviews: number;
  isAvailable: boolean;
  isVerified: boolean;
  bio: string;
  services: { category: string; name: string; price: string; _id: string }[];
}

function ArtisansContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    search: searchParams?.get('search') || '',
    category: searchParams?.get('category') || '',
    city: '',
    minRating: '',
    availableOnly: false,
  });

  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch artisans from API
  const fetchArtisans = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.city) params.append('city', filters.city);
      if (filters.search) params.append('search', filters.search);
      if (filters.minRating) params.append('minRating', filters.minRating);
      if (filters.availableOnly) params.append('available', 'true');

      const response = await fetch(`/api/artisans?${params.toString()}`);
      const data = await response.json();
      setArtisans(data.artisans || []);
    } catch (error) {
      console.error('Error fetching artisans:', error);
      setArtisans([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchArtisans();
  }, [fetchArtisans]);

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      city: '',
      minRating: '',
      availableOnly: false,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-4">{t('artisans')}</h1>
          <p className="text-emerald-100 mb-8">
            Trouvez le professionnel idéal pour vos travaux
          </p>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="bg-white/90 border-0"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
            </div>
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filtres
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-72 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-gray-900">Filtres</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-emerald-600 hover:text-emerald-700"
                >
                  Réinitialiser
                </button>
              </div>

              <div className="space-y-6">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => setFilters({ ...filters, category: cat.value })}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          filters.category === cat.value
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'hover:bg-gray-100 text-gray-600'
                        }`}
                      >
                        {cat.icon && <span className="mr-2">{cat.icon}</span>}
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* City */}
                <Select
                  label="Ville"
                  options={cities}
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                />

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Note minimum
                  </label>
                  <div className="flex gap-2">
                    {[4, 4.5, 4.8].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setFilters({ ...filters, minRating: rating.toString() })}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          filters.minRating === rating.toString()
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {rating}+
                      </button>
                    ))}
                  </div>
                </div>

                {/* Available Only */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.availableOnly}
                    onChange={(e) => setFilters({ ...filters, availableOnly: e.target.checked })}
                    className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">Disponibles uniquement</span>
                </label>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">{artisans.length}</span> artisans trouvés
              </p>
              <select
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                defaultValue="rating"
              >
                <option value="rating">Mieux notés</option>
                <option value="reviews">Plus d'avis</option>
                <option value="newest">Plus récents</option>
              </select>
            </div>

            {/* Artisans Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <svg className="animate-spin h-8 w-8 text-emerald-600" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            ) : artisans.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun artisan trouvé</h3>
                <p className="text-gray-500">Essayez de modifier vos filtres</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {artisans.map((artisan) => (
                  <ArtisanCard key={artisan.id} {...artisan} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ArtisansPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-emerald-600" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    }>
      <ArtisansContent />
    </Suspense>
  );
}
