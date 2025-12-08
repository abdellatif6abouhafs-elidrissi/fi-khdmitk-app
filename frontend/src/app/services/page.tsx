'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

const services = [
  {
    id: 'plumbing',
    icon: '🔧',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    description: 'Installation, réparation de fuites, débouchage, chauffe-eau, robinetterie',
  },
  {
    id: 'electrical',
    icon: '⚡',
    color: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-50',
    description: 'Installation électrique, dépannage, mise aux normes, éclairage',
  },
  {
    id: 'carpentry',
    icon: '🪚',
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
    description: 'Meubles sur mesure, portes, fenêtres, parquet, escaliers',
  },
  {
    id: 'painting',
    icon: '🎨',
    color: 'from-pink-500 to-pink-600',
    bgColor: 'bg-pink-50',
    description: 'Peinture intérieure et extérieure, décoration, revêtements muraux',
  },
  {
    id: 'hvac',
    icon: '❄️',
    color: 'from-cyan-500 to-cyan-600',
    bgColor: 'bg-cyan-50',
    description: 'Installation et entretien climatisation, chauffage, ventilation',
  },
  {
    id: 'cleaning',
    icon: '🧹',
    color: 'from-teal-500 to-teal-600',
    bgColor: 'bg-teal-50',
    description: 'Nettoyage maison, bureaux, après travaux, vitres, tapis',
  },
  {
    id: 'gardening',
    icon: '🌱',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    description: 'Entretien jardin, taille, plantation, arrosage automatique',
  },
  {
    id: 'masonry',
    icon: '🧱',
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-50',
    description: 'Construction, rénovation, carrelage, façade, gros œuvre',
  },
  {
    id: 'locksmith',
    icon: '🔐',
    color: 'from-gray-500 to-gray-600',
    bgColor: 'bg-gray-100',
    description: 'Ouverture de porte, changement de serrure, blindage, coffres-forts',
  },
  {
    id: 'appliance',
    icon: '🔌',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    description: 'Réparation électroménager, machine à laver, frigo, four',
  },
  {
    id: 'moving',
    icon: '📦',
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-50',
    description: 'Déménagement, transport de meubles, montage et démontage',
  },
  {
    id: 'other',
    icon: '🔨',
    color: 'from-slate-500 to-slate-600',
    bgColor: 'bg-slate-50',
    description: 'Autres services de bricolage et réparation à domicile',
  },
];

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
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/artisans?category=${service.id}`}
              className="group"
            >
              <div className={`${service.bgColor} rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-transparent hover:border-emerald-200`}>
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center text-2xl shadow-lg`}>
                    {service.icon}
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
