import React from 'react';

interface ServiceIconProps {
  category: string;
  className?: string;
}

export function ServiceIcon({ category, className = 'w-6 h-6' }: ServiceIconProps) {
  const icons: Record<string, React.ReactNode> = {
    plumbing: (
      <svg className={className} viewBox="0 0 64 64" fill="none">
        <defs>
          <linearGradient id="plumb1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA"/>
            <stop offset="100%" stopColor="#2563EB"/>
          </linearGradient>
          <linearGradient id="plumb2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#93C5FD"/>
            <stop offset="100%" stopColor="#3B82F6"/>
          </linearGradient>
        </defs>
        <rect x="8" y="12" width="16" height="20" rx="2" fill="url(#plumb1)"/>
        <rect x="10" y="14" width="12" height="4" rx="1" fill="#BFDBFE"/>
        <rect x="20" y="18" width="24" height="8" rx="2" fill="url(#plumb2)"/>
        <rect x="40" y="14" width="8" height="36" rx="2" fill="url(#plumb1)"/>
        <circle cx="44" cy="42" r="6" fill="url(#plumb2)"/>
        <circle cx="44" cy="42" r="3" fill="#1E40AF"/>
        <rect x="14" y="32" width="4" height="20" rx="1" fill="url(#plumb1)"/>
        <ellipse cx="16" cy="52" rx="6" ry="3" fill="#1E40AF" opacity="0.3"/>
      </svg>
    ),
    electrical: (
      <svg className={className} viewBox="0 0 64 64" fill="none">
        <defs>
          <linearGradient id="elec1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCD34D"/>
            <stop offset="100%" stopColor="#F59E0B"/>
          </linearGradient>
          <linearGradient id="elec2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A"/>
            <stop offset="100%" stopColor="#FBBF24"/>
          </linearGradient>
          <filter id="elecShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="#92400E" floodOpacity="0.3"/>
          </filter>
        </defs>
        <path d="M36 4L12 36H28L24 60L52 24H34L36 4Z" fill="url(#elec1)" filter="url(#elecShadow)"/>
        <path d="M34 8L16 32H28L25 52L46 28H36L34 8Z" fill="url(#elec2)"/>
        <path d="M32 14L22 30H30L28 44L42 30H34L32 14Z" fill="#FEF3C7"/>
      </svg>
    ),
    carpentry: (
      <svg className={className} viewBox="0 0 64 64" fill="none">
        <defs>
          <linearGradient id="carp1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FB923C"/>
            <stop offset="100%" stopColor="#EA580C"/>
          </linearGradient>
          <linearGradient id="carp2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4D4D8"/>
            <stop offset="100%" stopColor="#71717A"/>
          </linearGradient>
          <linearGradient id="wood" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D97706"/>
            <stop offset="100%" stopColor="#92400E"/>
          </linearGradient>
        </defs>
        <rect x="4" y="44" width="56" height="12" rx="2" fill="url(#wood)"/>
        <rect x="6" y="46" width="52" height="3" fill="#FCD34D" opacity="0.3"/>
        <path d="M12 44L32 8L52 44" fill="url(#carp2)"/>
        <path d="M16 44L32 14L48 44" fill="#A1A1AA"/>
        <rect x="30" y="8" width="4" height="10" rx="1" fill="url(#carp1)"/>
        <path d="M28 12L32 4L36 12" fill="url(#carp1)"/>
        <rect x="8" y="56" width="8" height="4" rx="1" fill="#78350F"/>
        <rect x="48" y="56" width="8" height="4" rx="1" fill="#78350F"/>
      </svg>
    ),
    painting: (
      <svg className={className} viewBox="0 0 64 64" fill="none">
        <defs>
          <linearGradient id="paint1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F472B6"/>
            <stop offset="100%" stopColor="#DB2777"/>
          </linearGradient>
          <linearGradient id="paint2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A78BFA"/>
            <stop offset="100%" stopColor="#7C3AED"/>
          </linearGradient>
          <linearGradient id="brush" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A"/>
            <stop offset="100%" stopColor="#D97706"/>
          </linearGradient>
        </defs>
        <rect x="8" y="8" width="28" height="20" rx="3" fill="url(#paint1)"/>
        <rect x="10" y="10" width="24" height="6" rx="2" fill="#FBCFE8"/>
        <rect x="18" y="28" width="12" height="28" rx="2" fill="url(#brush)"/>
        <rect x="20" y="30" width="8" height="8" fill="#92400E"/>
        <rect x="16" y="38" width="16" height="4" rx="1" fill="#78350F"/>
        <ellipse cx="24" cy="58" rx="8" ry="2" fill="url(#paint2)" opacity="0.5"/>
        <circle cx="46" cy="20" r="12" fill="url(#paint2)"/>
        <circle cx="44" cy="18" r="6" fill="#C4B5FD"/>
        <circle cx="50" cy="36" r="8" fill="#34D399"/>
        <circle cx="48" cy="34" r="4" fill="#6EE7B7"/>
      </svg>
    ),
    hvac: (
      <svg className={className} viewBox="0 0 64 64" fill="none">
        <defs>
          <linearGradient id="hvac1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#67E8F9"/>
            <stop offset="100%" stopColor="#06B6D4"/>
          </linearGradient>
          <linearGradient id="hvac2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E0E7FF"/>
            <stop offset="100%" stopColor="#A5B4FC"/>
          </linearGradient>
        </defs>
        <rect x="4" y="12" width="56" height="32" rx="4" fill="url(#hvac2)"/>
        <rect x="6" y="14" width="52" height="28" rx="3" fill="url(#hvac1)"/>
        <rect x="10" y="18" width="44" height="4" rx="1" fill="#0E7490"/>
        <rect x="10" y="24" width="44" height="4" rx="1" fill="#0E7490"/>
        <rect x="10" y="30" width="44" height="4" rx="1" fill="#0E7490"/>
        <rect x="10" y="36" width="44" height="4" rx="1" fill="#0E7490"/>
        <rect x="24" y="44" width="16" height="4" rx="1" fill="#6366F1"/>
        <rect x="28" y="48" width="8" height="8" rx="1" fill="#6366F1"/>
        <ellipse cx="32" cy="58" rx="12" ry="2" fill="#0E7490" opacity="0.3"/>
        <circle cx="12" cy="8" r="3" fill="#67E8F9"/>
        <circle cx="20" cy="6" r="2" fill="#67E8F9" opacity="0.7"/>
        <circle cx="16" cy="3" r="2" fill="#67E8F9" opacity="0.5"/>
      </svg>
    ),
    cleaning: (
      <svg className={className} viewBox="0 0 64 64" fill="none">
        <defs>
          <linearGradient id="clean1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5EEAD4"/>
            <stop offset="100%" stopColor="#14B8A6"/>
          </linearGradient>
          <linearGradient id="clean2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A5F3FC"/>
            <stop offset="100%" stopColor="#22D3EE"/>
          </linearGradient>
          <linearGradient id="bubble" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF"/>
            <stop offset="100%" stopColor="#A5F3FC"/>
          </linearGradient>
        </defs>
        <path d="M20 8C20 8 16 12 16 20V52C16 54 18 56 20 56H36C38 56 40 54 40 52V20C40 12 36 8 36 8H20Z" fill="url(#clean1)"/>
        <path d="M22 12C22 12 20 15 20 20V48C20 49 21 50 22 50H34C35 50 36 49 36 48V20C36 15 34 12 34 12H22Z" fill="url(#clean2)"/>
        <rect x="24" y="4" width="8" height="8" rx="2" fill="#0D9488"/>
        <ellipse cx="28" cy="30" rx="6" ry="10" fill="#FFFFFF" opacity="0.4"/>
        <circle cx="48" cy="16" r="6" fill="url(#bubble)"/>
        <circle cx="50" cy="14" r="2" fill="#FFFFFF"/>
        <circle cx="52" cy="28" r="4" fill="url(#bubble)"/>
        <circle cx="54" cy="26" r="1.5" fill="#FFFFFF"/>
        <circle cx="46" cy="36" r="3" fill="url(#bubble)"/>
        <circle cx="10" cy="24" r="4" fill="url(#bubble)"/>
        <circle cx="8" cy="22" r="1.5" fill="#FFFFFF"/>
        <ellipse cx="28" cy="58" rx="10" ry="2" fill="#0D9488" opacity="0.3"/>
      </svg>
    ),
    gardening: (
      <svg className={className} viewBox="0 0 64 64" fill="none">
        <defs>
          <linearGradient id="leaf1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ADE80"/>
            <stop offset="100%" stopColor="#16A34A"/>
          </linearGradient>
          <linearGradient id="leaf2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#86EFAC"/>
            <stop offset="100%" stopColor="#22C55E"/>
          </linearGradient>
          <linearGradient id="pot" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FB923C"/>
            <stop offset="100%" stopColor="#C2410C"/>
          </linearGradient>
        </defs>
        <path d="M20 40H44L40 58H24L20 40Z" fill="url(#pot)"/>
        <rect x="18" y="36" width="28" height="6" rx="2" fill="#EA580C"/>
        <ellipse cx="32" cy="58" rx="10" ry="2" fill="#7C2D12" opacity="0.3"/>
        <path d="M32 36V20" stroke="#166534" strokeWidth="4" strokeLinecap="round"/>
        <ellipse cx="32" cy="14" rx="14" ry="12" fill="url(#leaf1)"/>
        <ellipse cx="32" cy="12" rx="10" ry="8" fill="url(#leaf2)"/>
        <path d="M32 4V14M26 8L32 14L38 8" stroke="#166534" strokeWidth="2" strokeLinecap="round"/>
        <ellipse cx="18" cy="22" rx="8" ry="10" fill="url(#leaf1)" transform="rotate(-30 18 22)"/>
        <ellipse cx="46" cy="22" rx="8" ry="10" fill="url(#leaf1)" transform="rotate(30 46 22)"/>
        <circle cx="48" cy="44" r="3" fill="#FCD34D"/>
        <circle cx="52" cy="38" r="2" fill="#FCD34D" opacity="0.7"/>
      </svg>
    ),
    masonry: (
      <svg className={className} viewBox="0 0 64 64" fill="none">
        <defs>
          <linearGradient id="brick1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCA5A5"/>
            <stop offset="100%" stopColor="#DC2626"/>
          </linearGradient>
          <linearGradient id="brick2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F87171"/>
            <stop offset="100%" stopColor="#B91C1C"/>
          </linearGradient>
          <linearGradient id="cement" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4D4D8"/>
            <stop offset="100%" stopColor="#71717A"/>
          </linearGradient>
        </defs>
        <rect x="4" y="8" width="26" height="12" rx="1" fill="url(#brick1)"/>
        <rect x="34" y="8" width="26" height="12" rx="1" fill="url(#brick2)"/>
        <rect x="4" y="22" width="17" height="12" rx="1" fill="url(#brick2)"/>
        <rect x="25" y="22" width="17" height="12" rx="1" fill="url(#brick1)"/>
        <rect x="46" y="22" width="14" height="12" rx="1" fill="url(#brick2)"/>
        <rect x="4" y="36" width="26" height="12" rx="1" fill="url(#brick1)"/>
        <rect x="34" y="36" width="26" height="12" rx="1" fill="url(#brick2)"/>
        <rect x="4" y="50" width="17" height="12" rx="1" fill="url(#brick2)"/>
        <rect x="25" y="50" width="17" height="12" rx="1" fill="url(#brick1)"/>
        <rect x="46" y="50" width="14" height="12" rx="1" fill="url(#brick2)"/>
        <rect x="4" y="18" width="56" height="4" fill="url(#cement)"/>
        <rect x="4" y="32" width="56" height="4" fill="url(#cement)"/>
        <rect x="4" y="46" width="56" height="4" fill="url(#cement)"/>
        <rect x="28" y="8" width="4" height="12" fill="url(#cement)"/>
        <rect x="19" y="22" width="4" height="12" fill="url(#cement)"/>
        <rect x="40" y="22" width="4" height="12" fill="url(#cement)"/>
        <rect x="28" y="36" width="4" height="12" fill="url(#cement)"/>
      </svg>
    ),
    locksmith: (
      <svg className={className} viewBox="0 0 64 64" fill="none">
        <defs>
          <linearGradient id="lock1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A1A1AA"/>
            <stop offset="100%" stopColor="#52525B"/>
          </linearGradient>
          <linearGradient id="lock2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCD34D"/>
            <stop offset="100%" stopColor="#D97706"/>
          </linearGradient>
          <linearGradient id="lock3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E4E4E7"/>
            <stop offset="100%" stopColor="#71717A"/>
          </linearGradient>
        </defs>
        <path d="M16 28V20C16 11.16 23.16 4 32 4C40.84 4 48 11.16 48 20V28" stroke="url(#lock1)" strokeWidth="6" strokeLinecap="round"/>
        <rect x="10" y="28" width="44" height="32" rx="4" fill="url(#lock2)"/>
        <rect x="12" y="30" width="40" height="28" rx="3" fill="#FBBF24"/>
        <circle cx="32" cy="44" r="8" fill="#92400E"/>
        <circle cx="32" cy="44" r="5" fill="url(#lock3)"/>
        <rect x="30" y="44" width="4" height="10" rx="1" fill="#92400E"/>
        <ellipse cx="32" cy="62" rx="16" ry="2" fill="#78350F" opacity="0.3"/>
        <rect x="18" y="22" width="8" height="8" rx="2" fill="url(#lock1)"/>
        <rect x="38" y="22" width="8" height="8" rx="2" fill="url(#lock1)"/>
      </svg>
    ),
    appliance: (
      <svg className={className} viewBox="0 0 64 64" fill="none">
        <defs>
          <linearGradient id="app1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C4B5FD"/>
            <stop offset="100%" stopColor="#7C3AED"/>
          </linearGradient>
          <linearGradient id="app2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E0E7FF"/>
            <stop offset="100%" stopColor="#A5B4FC"/>
          </linearGradient>
        </defs>
        <rect x="12" y="4" width="40" height="56" rx="4" fill="url(#app1)"/>
        <rect x="14" y="6" width="36" height="52" rx="3" fill="url(#app2)"/>
        <rect x="18" y="10" width="28" height="24" rx="2" fill="#6366F1"/>
        <rect x="20" y="12" width="24" height="20" rx="1" fill="#818CF8"/>
        <line x1="20" y1="22" x2="44" y2="22" stroke="#6366F1" strokeWidth="2"/>
        <line x1="20" y1="26" x2="44" y2="26" stroke="#6366F1" strokeWidth="2"/>
        <circle cx="24" cy="44" r="4" fill="#6366F1"/>
        <circle cx="24" cy="44" r="2" fill="#A5B4FC"/>
        <circle cx="40" cy="44" r="4" fill="#6366F1"/>
        <circle cx="40" cy="44" r="2" fill="#A5B4FC"/>
        <rect x="30" y="42" width="4" height="4" rx="1" fill="#4F46E5"/>
        <ellipse cx="32" cy="62" rx="14" ry="2" fill="#5B21B6" opacity="0.3"/>
      </svg>
    ),
    moving: (
      <svg className={className} viewBox="0 0 64 64" fill="none">
        <defs>
          <linearGradient id="move1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A5B4FC"/>
            <stop offset="100%" stopColor="#4F46E5"/>
          </linearGradient>
          <linearGradient id="move2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCD34D"/>
            <stop offset="100%" stopColor="#D97706"/>
          </linearGradient>
          <linearGradient id="box" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A"/>
            <stop offset="100%" stopColor="#F59E0B"/>
          </linearGradient>
        </defs>
        <rect x="4" y="24" width="48" height="24" rx="2" fill="url(#move1)"/>
        <rect x="6" y="26" width="44" height="20" rx="1" fill="#6366F1"/>
        <rect x="48" y="20" width="12" height="28" rx="2" fill="url(#move1)"/>
        <rect x="50" y="26" width="8" height="8" rx="1" fill="#A5B4FC"/>
        <circle cx="16" cy="52" r="6" fill="#1F2937"/>
        <circle cx="16" cy="52" r="3" fill="#6B7280"/>
        <circle cx="40" cy="52" r="6" fill="#1F2937"/>
        <circle cx="40" cy="52" r="3" fill="#6B7280"/>
        <rect x="10" y="30" width="14" height="12" rx="1" fill="url(#box)"/>
        <line x1="17" y1="30" x2="17" y2="42" stroke="#D97706" strokeWidth="2"/>
        <line x1="10" y1="36" x2="24" y2="36" stroke="#D97706" strokeWidth="2"/>
        <rect x="28" y="32" width="10" height="10" rx="1" fill="url(#move2)"/>
        <rect x="8" y="4" width="20" height="16" rx="2" fill="url(#box)"/>
        <line x1="18" y1="4" x2="18" y2="20" stroke="#D97706" strokeWidth="2"/>
        <line x1="8" y1="12" x2="28" y2="12" stroke="#D97706" strokeWidth="2"/>
      </svg>
    ),
    other: (
      <svg className={className} viewBox="0 0 64 64" fill="none">
        <defs>
          <linearGradient id="tool1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#94A3B8"/>
            <stop offset="100%" stopColor="#475569"/>
          </linearGradient>
          <linearGradient id="tool2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F87171"/>
            <stop offset="100%" stopColor="#DC2626"/>
          </linearGradient>
        </defs>
        <path d="M44 8C44 8 56 16 56 28C56 34 52 40 46 42L38 50L28 40L36 32C32 28 32 20 36 14C40 8 44 8 44 8Z" fill="url(#tool1)"/>
        <path d="M42 12C42 12 50 18 50 26C50 30 48 34 44 36L38 42L32 36L38 30C36 28 36 22 38 18C40 14 42 12 42 12Z" fill="#CBD5E1"/>
        <rect x="8" y="40" width="24" height="8" rx="2" fill="url(#tool2)" transform="rotate(-45 8 40)"/>
        <rect x="4" y="52" width="12" height="8" rx="2" fill="#991B1B" transform="rotate(-45 4 52)"/>
        <ellipse cx="32" cy="58" rx="12" ry="2" fill="#334155" opacity="0.3"/>
        <circle cx="48" cy="20" r="4" fill="#E2E8F0"/>
        <circle cx="48" cy="20" r="2" fill="#64748B"/>
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
    iconBg: 'bg-gradient-to-br from-blue-100 to-blue-200',
    description: 'Installation, réparation de fuites, débouchage, chauffe-eau, robinetterie',
  },
  {
    id: 'electrical',
    color: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-50',
    iconBg: 'bg-gradient-to-br from-amber-100 to-amber-200',
    description: 'Installation électrique, dépannage, mise aux normes, éclairage',
  },
  {
    id: 'carpentry',
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
    iconBg: 'bg-gradient-to-br from-orange-100 to-orange-200',
    description: 'Meubles sur mesure, portes, fenêtres, parquet, escaliers',
  },
  {
    id: 'painting',
    color: 'from-pink-500 to-pink-600',
    bgColor: 'bg-pink-50',
    iconBg: 'bg-gradient-to-br from-pink-100 to-pink-200',
    description: 'Peinture intérieure et extérieure, décoration, revêtements muraux',
  },
  {
    id: 'hvac',
    color: 'from-cyan-500 to-cyan-600',
    bgColor: 'bg-cyan-50',
    iconBg: 'bg-gradient-to-br from-cyan-100 to-cyan-200',
    description: 'Installation et entretien climatisation, chauffage, ventilation',
  },
  {
    id: 'cleaning',
    color: 'from-teal-500 to-teal-600',
    bgColor: 'bg-teal-50',
    iconBg: 'bg-gradient-to-br from-teal-100 to-teal-200',
    description: 'Nettoyage maison, bureaux, après travaux, vitres, tapis',
  },
  {
    id: 'gardening',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    iconBg: 'bg-gradient-to-br from-green-100 to-green-200',
    description: 'Entretien jardin, taille, plantation, arrosage automatique',
  },
  {
    id: 'masonry',
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-50',
    iconBg: 'bg-gradient-to-br from-red-100 to-red-200',
    description: 'Construction, rénovation, carrelage, façade, gros œuvre',
  },
  {
    id: 'locksmith',
    color: 'from-gray-500 to-gray-600',
    bgColor: 'bg-gray-100',
    iconBg: 'bg-gradient-to-br from-gray-100 to-gray-200',
    description: 'Ouverture de porte, changement de serrure, blindage, coffres-forts',
  },
  {
    id: 'appliance',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    iconBg: 'bg-gradient-to-br from-purple-100 to-purple-200',
    description: 'Réparation électroménager, machine à laver, frigo, four',
  },
  {
    id: 'moving',
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-50',
    iconBg: 'bg-gradient-to-br from-indigo-100 to-indigo-200',
    description: 'Déménagement, transport de meubles, montage et démontage',
  },
  {
    id: 'other',
    color: 'from-slate-500 to-slate-600',
    bgColor: 'bg-slate-50',
    iconBg: 'bg-gradient-to-br from-slate-100 to-slate-200',
    description: 'Autres services de bricolage et réparation à domicile',
  },
];
