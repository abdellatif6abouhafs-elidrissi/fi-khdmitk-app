'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/Button';

interface Service {
  id: number;
  category: string;
  name: string;
}

interface ArtisanCardProps {
  id: number;
  fullName: string;
  avatar?: string;
  bio?: string;
  city: string;
  rating: number;
  totalReviews: number;
  isAvailable: boolean;
  isVerified: boolean;
  services: Service[];
}

export function ArtisanCard({
  id,
  fullName,
  avatar,
  bio,
  city,
  rating,
  totalReviews,
  isAvailable,
  isVerified,
  services,
}: ArtisanCardProps) {
  const { t } = useLanguage();

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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-emerald-100 transition-all duration-300 group">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
              {avatar ? (
                <img src={avatar} alt={fullName} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                fullName.charAt(0)
              )}
            </div>
            {isAvailable && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 truncate">{fullName}</h3>
              {isVerified && (
                <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {city}
            </p>
          </div>

          {/* Rating */}
          <div className="text-right">
            <div className="flex items-center gap-1">
              <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-semibold text-gray-900">{rating.toFixed(1)}</span>
            </div>
            <p className="text-xs text-gray-500">{totalReviews} {t('reviews')}</p>
          </div>
        </div>

        {/* Bio */}
        {bio && (
          <p className="mt-4 text-sm text-gray-600 line-clamp-2">{bio}</p>
        )}

        {/* Services */}
        <div className="mt-4 flex flex-wrap gap-2">
          {services.slice(0, 3).map((service) => (
            <span
              key={service.id}
              className="inline-flex items-center gap-1 px-3 py-1 bg-gray-50 text-gray-600 text-sm rounded-full"
            >
              <span>{categoryIcons[service.category] || '🔨'}</span>
              {t(service.category as any)}
            </span>
          ))}
          {services.length > 3 && (
            <span className="px-3 py-1 bg-gray-50 text-gray-500 text-sm rounded-full">
              +{services.length - 3}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <Link href={`/artisans/${id}`} className="flex-1">
            <Button variant="outline" className="w-full">{t('viewProfile')}</Button>
          </Link>
          <Link href={`/book/${id}`} className="flex-1">
            <Button variant="primary" className="w-full">{t('bookNow')}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
