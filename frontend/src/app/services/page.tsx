'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { ServiceIcon, serviceCategories } from '@/components/ServiceIcon';

export default function ServicesPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">{t('services')}</h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            Découvrez tous les services proposés par nos artisans qualifiés
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceCategories.map((service) => (
            <Link
              key={service.id}
              href={`/artisans?category=${service.id}`}
              className="group"
            >
              <div className={`${service.bgColor} rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-transparent hover:border-emerald-200`}>
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-lg`}>
                    <ServiceIcon category={service.id} className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                      {t(service.id as any)}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {service.description}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-emerald-600 text-sm font-medium">
                  <span>Voir les artisans</span>
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Vous ne trouvez pas ce que vous cherchez ?
          </h2>
          <p className="text-gray-600 mb-8">
            Contactez-nous et nous vous aiderons à trouver l'artisan qu'il vous faut
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/artisans"
              className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors"
            >
              Voir tous les artisans
            </Link>
            <Link
              href="/register?role=artisan"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-emerald-600 text-emerald-600 font-medium rounded-xl hover:bg-emerald-50 transition-colors"
            >
              Devenir artisan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
