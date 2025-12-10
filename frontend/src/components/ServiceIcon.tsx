import React from 'react';

interface ServiceIconProps {
  category: string;
  className?: string;
}

export function ServiceIcon({ category, className = 'w-6 h-6' }: ServiceIconProps) {
  const icons: Record<string, React.ReactNode> = {
    plumbing: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h4v4H4z" />
        <path d="M8 6h3a2 2 0 012 2v2" />
        <path d="M13 10v8a2 2 0 002 2h2a2 2 0 002-2v-3" />
        <path d="M19 12h-6" />
        <circle cx="19" cy="15" r="2" />
        <path d="M6 8v12" />
        <path d="M4 20h4" />
      </svg>
    ),
    electrical: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    carpentry: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2L19 6.5 6.5 19l-4-4L14.5 2z" />
        <path d="M5 16l3 3" />
        <path d="M2 22l4-4" />
        <path d="M18 2l4 4" />
        <path d="M15 5l4 4" />
      </svg>
    ),
    painting: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 3H5a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z" />
        <path d="M12 11v8" />
        <path d="M8 22h8" />
        <path d="M7 11l2 11" />
        <path d="M17 11l-2 11" />
      </svg>
    ),
    hvac: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
        <path d="M6 8h.01" />
        <path d="M10 8h8" />
        <path d="M6 12h.01" />
        <path d="M10 12h8" />
      </svg>
    ),
    cleaning: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4" />
        <path d="M12 6c-4 0-6 2-6 6v9h12v-9c0-4-2-6-6-6z" />
        <path d="M6 21h12" />
        <path d="M9 10v2" />
        <path d="M12 10v2" />
        <path d="M15 10v2" />
      </svg>
    ),
    gardening: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22V10" />
        <path d="M12 10c0-4 4-6 7-6-1 4-3 6-7 6z" />
        <path d="M12 10c0-4-4-6-7-6 1 4 3 6 7 6z" />
        <path d="M12 14c-2 0-4 1-5 3" />
        <path d="M12 14c2 0 4 1 5 3" />
        <circle cx="12" cy="22" r="1" />
      </svg>
    ),
    masonry: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="4" rx="1" />
        <rect x="2" y="8" width="9" height="4" rx="1" />
        <rect x="11" y="8" width="11" height="4" rx="1" />
        <rect x="2" y="12" width="11" height="4" rx="1" />
        <rect x="13" y="12" width="9" height="4" rx="1" />
        <rect x="2" y="16" width="9" height="4" rx="1" />
        <rect x="11" y="16" width="11" height="4" rx="1" />
      </svg>
    ),
    locksmith: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <circle cx="12" cy="16" r="1" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    ),
    appliance: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <rect x="7" y="5" width="10" height="8" rx="1" />
        <circle cx="9" cy="17" r="1" />
        <circle cx="15" cy="17" r="1" />
        <path d="M10 8h4" />
      </svg>
    ),
    moving: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12h22" />
        <path d="M4 12V5a2 2 0 012-2h12a2 2 0 012 2v7" />
        <path d="M4 12l-2 7h20l-2-7" />
        <circle cx="8" cy="19" r="2" />
        <circle cx="16" cy="19" r="2" />
        <path d="M7 7h10" />
      </svg>
    ),
    other: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  };

  return <>{icons[category] || icons.other}</>;
}

// Service data with colors
export const serviceCategories = [
  {
    id: 'plumbing',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    iconBg: 'bg-blue-500',
    description: 'Installation, réparation de fuites, débouchage, chauffe-eau, robinetterie',
  },
  {
    id: 'electrical',
    color: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-50',
    iconBg: 'bg-amber-500',
    description: 'Installation électrique, dépannage, mise aux normes, éclairage',
  },
  {
    id: 'carpentry',
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
    iconBg: 'bg-orange-500',
    description: 'Meubles sur mesure, portes, fenêtres, parquet, escaliers',
  },
  {
    id: 'painting',
    color: 'from-pink-500 to-pink-600',
    bgColor: 'bg-pink-50',
    iconBg: 'bg-pink-500',
    description: 'Peinture intérieure et extérieure, décoration, revêtements muraux',
  },
  {
    id: 'hvac',
    color: 'from-cyan-500 to-cyan-600',
    bgColor: 'bg-cyan-50',
    iconBg: 'bg-cyan-500',
    description: 'Installation et entretien climatisation, chauffage, ventilation',
  },
  {
    id: 'cleaning',
    color: 'from-teal-500 to-teal-600',
    bgColor: 'bg-teal-50',
    iconBg: 'bg-teal-500',
    description: 'Nettoyage maison, bureaux, après travaux, vitres, tapis',
  },
  {
    id: 'gardening',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    iconBg: 'bg-green-500',
    description: 'Entretien jardin, taille, plantation, arrosage automatique',
  },
  {
    id: 'masonry',
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-50',
    iconBg: 'bg-red-500',
    description: 'Construction, rénovation, carrelage, façade, gros œuvre',
  },
  {
    id: 'locksmith',
    color: 'from-gray-500 to-gray-600',
    bgColor: 'bg-gray-100',
    iconBg: 'bg-gray-500',
    description: 'Ouverture de porte, changement de serrure, blindage, coffres-forts',
  },
  {
    id: 'appliance',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    iconBg: 'bg-purple-500',
    description: 'Réparation électroménager, machine à laver, frigo, four',
  },
  {
    id: 'moving',
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-50',
    iconBg: 'bg-indigo-500',
    description: 'Déménagement, transport de meubles, montage et démontage',
  },
  {
    id: 'other',
    color: 'from-slate-500 to-slate-600',
    bgColor: 'bg-slate-50',
    iconBg: 'bg-slate-500',
    description: 'Autres services de bricolage et réparation à domicile',
  },
];
