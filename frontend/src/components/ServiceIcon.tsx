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
          <linearGradient id="plumbMetal" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E8E8E8"/>
            <stop offset="30%" stopColor="#B8B8B8"/>
            <stop offset="70%" stopColor="#888888"/>
            <stop offset="100%" stopColor="#666666"/>
          </linearGradient>
          <linearGradient id="plumbChrome" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5F5F5"/>
            <stop offset="50%" stopColor="#A0A0A0"/>
            <stop offset="100%" stopColor="#606060"/>
          </linearGradient>
          <linearGradient id="plumbWater" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA"/>
            <stop offset="100%" stopColor="#2563EB"/>
          </linearGradient>
          <filter id="plumbShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.2"/>
          </filter>
        </defs>
        {/* Wrench */}
        <g filter="url(#plumbShadow)">
          <path d="M12 8L8 16L12 18L20 10L18 6L12 8Z" fill="url(#plumbChrome)"/>
          <rect x="18" y="14" width="32" height="6" rx="1" fill="url(#plumbMetal)" transform="rotate(35 18 14)"/>
          <path d="M46 44L52 50L56 46L50 40L46 44Z" fill="url(#plumbChrome)"/>
          <ellipse cx="10" cy="12" rx="4" ry="4" fill="url(#plumbMetal)"/>
        </g>
        {/* Pipe */}
        <g filter="url(#plumbShadow)">
          <rect x="6" y="42" width="22" height="8" rx="1" fill="url(#plumbMetal)"/>
          <rect x="24" y="38" width="8" height="16" rx="1" fill="url(#plumbMetal)"/>
          <rect x="28" y="42" width="22" height="8" rx="1" fill="url(#plumbMetal)"/>
          <ellipse cx="50" cy="46" rx="4" ry="4" fill="url(#plumbChrome)"/>
          <ellipse cx="6" cy="46" rx="4" ry="4" fill="url(#plumbChrome)"/>
        </g>
        {/* Water drops */}
        <ellipse cx="36" cy="56" rx="3" ry="4" fill="url(#plumbWater)" opacity="0.8"/>
        <ellipse cx="44" cy="58" rx="2" ry="3" fill="url(#plumbWater)" opacity="0.6"/>
        <ellipse cx="28" cy="58" rx="2" ry="2.5" fill="url(#plumbWater)" opacity="0.5"/>
      </svg>
    ),
    electrical: (
      <svg className={className} viewBox="0 0 64 64" fill="none">
        <defs>
          <linearGradient id="elecBolt" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A"/>
            <stop offset="30%" stopColor="#FDE047"/>
            <stop offset="70%" stopColor="#FACC15"/>
            <stop offset="100%" stopColor="#EAB308"/>
          </linearGradient>
          <linearGradient id="elecGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FEF9C3"/>
            <stop offset="100%" stopColor="#FDE68A"/>
          </linearGradient>
          <linearGradient id="elecPlug" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F5F5F5"/>
            <stop offset="50%" stopColor="#D4D4D4"/>
            <stop offset="100%" stopColor="#A3A3A3"/>
          </linearGradient>
          <filter id="elecGlowFilter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="elecShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.15"/>
          </filter>
        </defs>
        {/* Lightning bolt */}
        <g filter="url(#elecGlowFilter)">
          <path d="M36 2L14 30H28L22 62L50 28H34L36 2Z" fill="url(#elecBolt)"/>
          <path d="M34 8L20 28H30L26 52L44 32H36L34 8Z" fill="url(#elecGlow)"/>
        </g>
        {/* Outlet/Plug */}
        <g filter="url(#elecShadow)">
          <rect x="46" y="40" width="14" height="20" rx="2" fill="url(#elecPlug)"/>
          <rect x="49" y="44" width="3" height="6" rx="1" fill="#525252"/>
          <rect x="54" y="44" width="3" height="6" rx="1" fill="#525252"/>
          <circle cx="53" cy="54" r="2" fill="#525252"/>
        </g>
      </svg>
    ),
    carpentry: (
      <svg className={className} viewBox="0 0 64 64" fill="none">
        <defs>
          <linearGradient id="carpWood1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D4A574"/>
            <stop offset="30%" stopColor="#B8956A"/>
            <stop offset="70%" stopColor="#9C7E5A"/>
            <stop offset="100%" stopColor="#7A6348"/>
          </linearGradient>
          <linearGradient id="carpWood2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C9956C"/>
            <stop offset="100%" stopColor="#8B6914"/>
          </linearGradient>
          <linearGradient id="carpMetal" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E8E8E8"/>
            <stop offset="50%" stopColor="#A0A0A0"/>
            <stop offset="100%" stopColor="#606060"/>
          </linearGradient>
          <linearGradient id="carpHandle" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B4513"/>
            <stop offset="50%" stopColor="#A0522D"/>
            <stop offset="100%" stopColor="#8B4513"/>
          </linearGradient>
          <filter id="carpShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.25"/>
          </filter>
        </defs>
        {/* Saw */}
        <g filter="url(#carpShadow)">
          <rect x="8" y="8" width="12" height="20" rx="2" fill="url(#carpHandle)"/>
          <rect x="18" y="10" width="40" height="14" fill="url(#carpMetal)"/>
          <path d="M18 24L22 28L26 24L30 28L34 24L38 28L42 24L46 28L50 24L54 28L58 24V24H18Z" fill="url(#carpMetal)"/>
          <line x1="18" y1="16" x2="58" y2="16" stroke="#B0B0B0" strokeWidth="1"/>
        </g>
        {/* Wood plank */}
        <g filter="url(#carpShadow)">
          <rect x="4" y="40" width="56" height="12" rx="1" fill="url(#carpWood1)"/>
          <line x1="10" y1="40" x2="10" y2="52" stroke="#9C7E5A" strokeWidth="0.5" opacity="0.5"/>
          <line x1="20" y1="40" x2="20" y2="52" stroke="#9C7E5A" strokeWidth="0.5" opacity="0.5"/>
          <line x1="35" y1="40" x2="35" y2="52" stroke="#9C7E5A" strokeWidth="0.5" opacity="0.5"/>
          <line x1="50" y1="40" x2="50" y2="52" stroke="#9C7E5A" strokeWidth="0.5" opacity="0.5"/>
          <ellipse cx="28" cy="46" rx="3" ry="2" fill="#B8956A" opacity="0.4"/>
          <ellipse cx="45" cy="45" rx="2" ry="1.5" fill="#B8956A" opacity="0.3"/>
        </g>
        {/* Wood shavings */}
        <path d="M12 56C12 56 16 54 20 56S28 54 32 56" stroke="url(#carpWood2)" strokeWidth="2" fill="none" opacity="0.6"/>
        <path d="M38 58C38 58 42 56 46 58S52 56 54 58" stroke="url(#carpWood2)" strokeWidth="1.5" fill="none" opacity="0.4"/>
      </svg>
    ),
    painting: (
      <svg className={className} viewBox="0 0 64 64" fill="none">
        <defs>
          <linearGradient id="paintBrush" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B4513"/>
            <stop offset="50%" stopColor="#A0522D"/>
            <stop offset="100%" stopColor="#8B4513"/>
          </linearGradient>
          <linearGradient id="paintMetal" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D4D4D4"/>
            <stop offset="50%" stopColor="#A3A3A3"/>
            <stop offset="100%" stopColor="#737373"/>
          </linearGradient>
          <linearGradient id="paintBristle" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F5DEB3"/>
            <stop offset="100%" stopColor="#DEB887"/>
          </linearGradient>
          <linearGradient id="paintBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA"/>
            <stop offset="100%" stopColor="#2563EB"/>
          </linearGradient>
          <linearGradient id="paintGreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ADE80"/>
            <stop offset="100%" stopColor="#16A34A"/>
          </linearGradient>
          <linearGradient id="paintOrange" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FB923C"/>
            <stop offset="100%" stopColor="#EA580C"/>
          </linearGradient>
          <linearGradient id="paintCan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E5E5E5"/>
            <stop offset="30%" stopColor="#D4D4D4"/>
            <stop offset="100%" stopColor="#A3A3A3"/>
          </linearGradient>
          <filter id="paintShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.2"/>
          </filter>
        </defs>
        {/* Paint brush */}
        <g filter="url(#paintShadow)">
          <rect x="4" y="4" width="8" height="32" rx="1" fill="url(#paintBrush)"/>
          <rect x="3" y="32" width="10" height="6" rx="1" fill="url(#paintMetal)"/>
          <rect x="2" y="38" width="12" height="14" rx="1" fill="url(#paintBristle)"/>
          <path d="M2 52L4 56L6 52L8 56L10 52L12 56L14 52" stroke="url(#paintBristle)" strokeWidth="2"/>
        </g>
        {/* Paint drips on brush */}
        <ellipse cx="8" cy="54" rx="4" ry="2" fill="url(#paintBlue)" opacity="0.8"/>
        <ellipse cx="6" cy="58" rx="2" ry="3" fill="url(#paintBlue)" opacity="0.6"/>
        {/* Paint can */}
        <g filter="url(#paintShadow)">
          <ellipse cx="42" cy="54" rx="16" ry="4" fill="#737373"/>
          <rect x="26" y="28" width="32" height="26" fill="url(#paintCan)"/>
          <ellipse cx="42" cy="28" rx="16" ry="4" fill="#E5E5E5"/>
          <ellipse cx="42" cy="30" rx="13" ry="3" fill="url(#paintBlue)"/>
        </g>
        {/* Color swatches */}
        <circle cx="52" cy="14" r="6" fill="url(#paintGreen)" filter="url(#paintShadow)"/>
        <circle cx="56" cy="6" r="4" fill="url(#paintOrange)" filter="url(#paintShadow)"/>
      </svg>
    ),
    hvac: (
      <svg className={className} viewBox="0 0 64 64" fill="none">
        <defs>
          <linearGradient id="hvacBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F5F5F5"/>
            <stop offset="30%" stopColor="#E5E5E5"/>
            <stop offset="100%" stopColor="#D4D4D4"/>
          </linearGradient>
          <linearGradient id="hvacVent" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#525252"/>
            <stop offset="100%" stopColor="#262626"/>
          </linearGradient>
          <linearGradient id="hvacCool" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#93C5FD"/>
            <stop offset="100%" stopColor="#3B82F6"/>
          </linearGradient>
          <filter id="hvacShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.2"/>
          </filter>
        </defs>
        {/* AC Unit body */}
        <g filter="url(#hvacShadow)">
          <rect x="4" y="16" width="56" height="36" rx="4" fill="url(#hvacBody)"/>
          <rect x="6" y="18" width="52" height="32" rx="3" fill="#FAFAFA"/>
          {/* Vents */}
          <rect x="10" y="22" width="44" height="3" rx="1" fill="url(#hvacVent)"/>
          <rect x="10" y="28" width="44" height="3" rx="1" fill="url(#hvacVent)"/>
          <rect x="10" y="34" width="44" height="3" rx="1" fill="url(#hvacVent)"/>
          <rect x="10" y="40" width="44" height="3" rx="1" fill="url(#hvacVent)"/>
          {/* Control panel */}
          <rect x="46" y="44" width="10" height="4" rx="1" fill="#404040"/>
          <circle cx="49" cy="46" r="1" fill="#22C55E"/>
          <circle cx="53" cy="46" r="1" fill="#EF4444"/>
        </g>
        {/* Cool air waves */}
        <path d="M16 8C18 6 22 6 24 8S28 10 30 8" stroke="url(#hvacCool)" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8"/>
        <path d="M32 6C34 4 38 4 40 6S44 8 46 6" stroke="url(#hvacCool)" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6"/>
        <path d="M24 4C26 2 28 2 30 4" stroke="url(#hvacCool)" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4"/>
        {/* Snowflake */}
        <g opacity="0.7">
          <line x1="54" y1="8" x2="54" y2="14" stroke="url(#hvacCool)" strokeWidth="2"/>
          <line x1="51" y1="11" x2="57" y2="11" stroke="url(#hvacCool)" strokeWidth="2"/>
          <line x1="52" y1="9" x2="56" y2="13" stroke="url(#hvacCool)" strokeWidth="1"/>
          <line x1="56" y1="9" x2="52" y2="13" stroke="url(#hvacCool)" strokeWidth="1"/>
        </g>
      </svg>
    ),
    cleaning: (
      <svg className={className} viewBox="0 0 64 64" fill="none">
        <defs>
          <linearGradient id="cleanBottle" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06B6D4"/>
            <stop offset="50%" stopColor="#22D3EE"/>
            <stop offset="100%" stopColor="#06B6D4"/>
          </linearGradient>
          <linearGradient id="cleanLiquid" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#67E8F9"/>
            <stop offset="100%" stopColor="#0891B2"/>
          </linearGradient>
          <linearGradient id="cleanSpray" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F5F5F5"/>
            <stop offset="100%" stopColor="#A3A3A3"/>
          </linearGradient>
          <linearGradient id="cleanBubble" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF"/>
            <stop offset="100%" stopColor="#E0F2FE"/>
          </linearGradient>
          <filter id="cleanShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.2"/>
          </filter>
        </defs>
        {/* Spray bottle */}
        <g filter="url(#cleanShadow)">
          <rect x="18" y="4" width="12" height="8" rx="2" fill="url(#cleanSpray)"/>
          <path d="M14 12L18 12V8L8 14V20L14 16V12Z" fill="url(#cleanSpray)"/>
          <path d="M16 16C16 14 18 12 20 12H28C30 12 32 14 32 16V54C32 56 30 58 28 58H20C18 58 16 56 16 54V16Z" fill="url(#cleanBottle)"/>
          <path d="M18 20C18 18 20 16 22 16H26C28 16 30 18 30 20V50C30 52 28 54 26 54H22C20 54 18 52 18 50V20Z" fill="url(#cleanLiquid)" opacity="0.6"/>
          <rect x="20" y="30" width="8" height="12" rx="1" fill="#FFFFFF" opacity="0.3"/>
        </g>
        {/* Spray mist */}
        <circle cx="4" cy="12" r="1.5" fill="url(#cleanBubble)" opacity="0.7"/>
        <circle cx="6" cy="16" r="1" fill="url(#cleanBubble)" opacity="0.5"/>
        <circle cx="2" cy="18" r="0.8" fill="url(#cleanBubble)" opacity="0.4"/>
        {/* Bubbles */}
        <g filter="url(#cleanShadow)">
          <circle cx="46" cy="20" r="8" fill="url(#cleanBubble)" opacity="0.9"/>
          <ellipse cx="43" cy="17" rx="2" ry="1.5" fill="#FFFFFF" opacity="0.8"/>
          <circle cx="52" cy="34" r="5" fill="url(#cleanBubble)" opacity="0.8"/>
          <ellipse cx="50" cy="32" rx="1.5" ry="1" fill="#FFFFFF" opacity="0.7"/>
          <circle cx="44" cy="42" r="4" fill="url(#cleanBubble)" opacity="0.7"/>
          <circle cx="54" cy="48" r="3" fill="url(#cleanBubble)" opacity="0.6"/>
          <circle cx="48" cy="54" r="2.5" fill="url(#cleanBubble)" opacity="0.5"/>
        </g>
        {/* Sparkles */}
        <path d="M56 14L58 16L60 14L58 12Z" fill="#FDE047" opacity="0.8"/>
        <path d="M40 8L41 10L42 8L41 6Z" fill="#FDE047" opacity="0.6"/>
      </svg>
    ),
    gardening: (
      <svg className={className} viewBox="0 0 64 64" fill="none">
        <defs>
          <linearGradient id="gardenPot" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C2410C"/>
            <stop offset="50%" stopColor="#9A3412"/>
            <stop offset="100%" stopColor="#7C2D12"/>
          </linearGradient>
          <linearGradient id="gardenSoil" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#78350F"/>
            <stop offset="100%" stopColor="#451A03"/>
          </linearGradient>
          <linearGradient id="gardenLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ADE80"/>
            <stop offset="50%" stopColor="#22C55E"/>
            <stop offset="100%" stopColor="#16A34A"/>
          </linearGradient>
          <linearGradient id="gardenStem" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#166534"/>
            <stop offset="50%" stopColor="#15803D"/>
            <stop offset="100%" stopColor="#166534"/>
          </linearGradient>
          <linearGradient id="gardenFlower" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FB7185"/>
            <stop offset="100%" stopColor="#E11D48"/>
          </linearGradient>
          <filter id="gardenShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.2"/>
          </filter>
        </defs>
        {/* Pot */}
        <g filter="url(#gardenShadow)">
          <path d="M14 42H50L46 60H18L14 42Z" fill="url(#gardenPot)"/>
          <rect x="12" y="38" width="40" height="6" rx="2" fill="#EA580C"/>
          <ellipse cx="32" cy="42" rx="16" ry="3" fill="url(#gardenSoil)"/>
        </g>
        {/* Plant stem */}
        <path d="M32 38V18" stroke="url(#gardenStem)" strokeWidth="4" strokeLinecap="round"/>
        <path d="M32 30V10" stroke="url(#gardenStem)" strokeWidth="3" strokeLinecap="round"/>
        {/* Leaves */}
        <g filter="url(#gardenShadow)">
          <ellipse cx="22" cy="24" rx="10" ry="6" fill="url(#gardenLeaf)" transform="rotate(-30 22 24)"/>
          <ellipse cx="42" cy="24" rx="10" ry="6" fill="url(#gardenLeaf)" transform="rotate(30 42 24)"/>
          <ellipse cx="26" cy="16" rx="8" ry="5" fill="url(#gardenLeaf)" transform="rotate(-15 26 16)"/>
          <ellipse cx="38" cy="16" rx="8" ry="5" fill="url(#gardenLeaf)" transform="rotate(15 38 16)"/>
          {/* Leaf veins */}
          <path d="M18 22L26 26" stroke="#166534" strokeWidth="0.5" opacity="0.5"/>
          <path d="M46 22L38 26" stroke="#166534" strokeWidth="0.5" opacity="0.5"/>
        </g>
        {/* Flower */}
        <g filter="url(#gardenShadow)">
          <circle cx="32" cy="8" r="5" fill="url(#gardenFlower)"/>
          <circle cx="28" cy="6" r="3" fill="url(#gardenFlower)"/>
          <circle cx="36" cy="6" r="3" fill="url(#gardenFlower)"/>
          <circle cx="30" cy="10" r="3" fill="url(#gardenFlower)"/>
          <circle cx="34" cy="10" r="3" fill="url(#gardenFlower)"/>
          <circle cx="32" cy="8" r="2" fill="#FDE047"/>
        </g>
        {/* Decorative elements */}
        <circle cx="52" cy="50" r="2" fill="#FDE047" opacity="0.6"/>
        <circle cx="56" cy="44" r="1.5" fill="#FDE047" opacity="0.4"/>
      </svg>
    ),
    masonry: (
      <svg className={className} viewBox="0 0 64 64" fill="none">
        <defs>
          <linearGradient id="masonBrick" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#DC2626"/>
            <stop offset="30%" stopColor="#B91C1C"/>
            <stop offset="100%" stopColor="#991B1B"/>
          </linearGradient>
          <linearGradient id="masonBrick2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#EF4444"/>
            <stop offset="30%" stopColor="#DC2626"/>
            <stop offset="100%" stopColor="#B91C1C"/>
          </linearGradient>
          <linearGradient id="masonMortar" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D4D4D4"/>
            <stop offset="100%" stopColor="#A3A3A3"/>
          </linearGradient>
          <linearGradient id="masonTrowel" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E5E5E5"/>
            <stop offset="50%" stopColor="#A3A3A3"/>
            <stop offset="100%" stopColor="#737373"/>
          </linearGradient>
          <filter id="masonShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.25"/>
          </filter>
        </defs>
        {/* Brick wall */}
        <g filter="url(#masonShadow)">
          {/* Row 1 */}
          <rect x="2" y="32" width="28" height="10" rx="1" fill="url(#masonBrick)"/>
          <rect x="32" y="32" width="28" height="10" rx="1" fill="url(#masonBrick2)"/>
          {/* Row 2 */}
          <rect x="2" y="44" width="18" height="10" rx="1" fill="url(#masonBrick2)"/>
          <rect x="22" y="44" width="20" height="10" rx="1" fill="url(#masonBrick)"/>
          <rect x="44" y="44" width="18" height="10" rx="1" fill="url(#masonBrick2)"/>
          {/* Row 3 */}
          <rect x="2" y="56" width="28" height="6" rx="1" fill="url(#masonBrick)"/>
          <rect x="32" y="56" width="28" height="6" rx="1" fill="url(#masonBrick2)"/>
          {/* Mortar lines */}
          <rect x="2" y="42" width="58" height="2" fill="url(#masonMortar)"/>
          <rect x="2" y="54" width="58" height="2" fill="url(#masonMortar)"/>
          <rect x="28" y="32" width="2" height="10" fill="url(#masonMortar)"/>
          <rect x="18" y="44" width="2" height="10" fill="url(#masonMortar)"/>
          <rect x="40" y="44" width="2" height="10" fill="url(#masonMortar)"/>
          <rect x="28" y="56" width="2" height="6" fill="url(#masonMortar)"/>
        </g>
        {/* Trowel */}
        <g filter="url(#masonShadow)">
          <path d="M20 4L48 24L44 28L16 8Z" fill="url(#masonTrowel)"/>
          <rect x="12" y="6" width="10" height="6" rx="1" fill="#8B4513" transform="rotate(-30 12 6)"/>
          <ellipse cx="46" cy="26" rx="3" ry="2" fill="url(#masonMortar)" transform="rotate(30 46 26)"/>
        </g>
        {/* Mortar pile */}
        <ellipse cx="52" cy="30" rx="8" ry="4" fill="url(#masonMortar)" filter="url(#masonShadow)"/>
      </svg>
    ),
    locksmith: (
      <svg className={className} viewBox="0 0 64 64" fill="none">
        <defs>
          <linearGradient id="lockGold" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FCD34D"/>
            <stop offset="30%" stopColor="#F59E0B"/>
            <stop offset="70%" stopColor="#D97706"/>
            <stop offset="100%" stopColor="#B45309"/>
          </linearGradient>
          <linearGradient id="lockShackle" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#A3A3A3"/>
            <stop offset="50%" stopColor="#E5E5E5"/>
            <stop offset="100%" stopColor="#A3A3A3"/>
          </linearGradient>
          <linearGradient id="lockKey" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A"/>
            <stop offset="50%" stopColor="#FBBF24"/>
            <stop offset="100%" stopColor="#D97706"/>
          </linearGradient>
          <filter id="lockShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.25"/>
          </filter>
        </defs>
        {/* Padlock */}
        <g filter="url(#lockShadow)">
          {/* Shackle */}
          <path d="M18 26V18C18 10.27 24.27 4 32 4C39.73 4 46 10.27 46 18V26" stroke="url(#lockShackle)" strokeWidth="6" strokeLinecap="round" fill="none"/>
          {/* Body */}
          <rect x="14" y="26" width="36" height="28" rx="4" fill="url(#lockGold)"/>
          <rect x="16" y="28" width="32" height="24" rx="3" fill="#FBBF24"/>
          {/* Keyhole */}
          <circle cx="32" cy="38" r="5" fill="#78350F"/>
          <rect x="30" y="38" width="4" height="10" fill="#78350F"/>
        </g>
        {/* Key */}
        <g filter="url(#lockShadow)">
          <ellipse cx="52" cy="50" rx="6" ry="6" fill="url(#lockKey)"/>
          <ellipse cx="52" cy="50" rx="3" ry="3" fill="#92400E"/>
          <rect x="38" y="48" width="16" height="4" rx="1" fill="url(#lockKey)"/>
          <rect x="36" y="46" width="4" height="8" rx="1" fill="url(#lockKey)"/>
          <rect x="40" y="52" width="2" height="4" rx="0.5" fill="url(#lockKey)"/>
          <rect x="44" y="52" width="2" height="3" rx="0.5" fill="url(#lockKey)"/>
        </g>
      </svg>
    ),
    appliance: (
      <svg className={className} viewBox="0 0 64 64" fill="none">
        <defs>
          <linearGradient id="applianceMetal" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F5F5F5"/>
            <stop offset="30%" stopColor="#E5E5E5"/>
            <stop offset="70%" stopColor="#D4D4D4"/>
            <stop offset="100%" stopColor="#A3A3A3"/>
          </linearGradient>
          <linearGradient id="applianceScreen" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E3A8A"/>
            <stop offset="100%" stopColor="#1E40AF"/>
          </linearGradient>
          <linearGradient id="applianceGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA"/>
            <stop offset="100%" stopColor="#3B82F6"/>
          </linearGradient>
          <filter id="applianceShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="3" stdDeviation="2" floodColor="#000" floodOpacity="0.2"/>
          </filter>
        </defs>
        {/* Washing machine */}
        <g filter="url(#applianceShadow)">
          <rect x="10" y="6" width="44" height="52" rx="4" fill="url(#applianceMetal)"/>
          <rect x="12" y="8" width="40" height="48" rx="3" fill="#FAFAFA"/>
          {/* Door */}
          <circle cx="32" cy="36" r="16" fill="#E5E5E5" stroke="#D4D4D4" strokeWidth="2"/>
          <circle cx="32" cy="36" r="12" fill="url(#applianceScreen)"/>
          <circle cx="32" cy="36" r="10" fill="#1E3A8A" opacity="0.8"/>
          {/* Clothes inside */}
          <path d="M26 32C28 30 32 32 34 30S38 32 40 30" stroke="#60A5FA" strokeWidth="2" fill="none" opacity="0.6"/>
          <path d="M24 38C26 36 30 38 32 36S36 38 38 36" stroke="#93C5FD" strokeWidth="2" fill="none" opacity="0.5"/>
          {/* Control panel */}
          <rect x="14" y="10" width="36" height="10" rx="2" fill="#F5F5F5"/>
          <circle cx="20" cy="15" r="3" fill="url(#applianceGlow)"/>
          <rect x="26" y="13" width="20" height="4" rx="1" fill="url(#applianceScreen)"/>
          <text x="28" y="16.5" fill="#60A5FA" fontSize="4" fontFamily="monospace">30°C</text>
        </g>
        {/* LED indicator */}
        <circle cx="46" cy="15" r="2" fill="#22C55E">
          <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite"/>
        </circle>
      </svg>
    ),
    moving: (
      <svg className={className} viewBox="0 0 64 64" fill="none">
        <defs>
          <linearGradient id="moveTruck" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6"/>
            <stop offset="50%" stopColor="#2563EB"/>
            <stop offset="100%" stopColor="#1D4ED8"/>
          </linearGradient>
          <linearGradient id="moveBox" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D4A574"/>
            <stop offset="50%" stopColor="#B8956A"/>
            <stop offset="100%" stopColor="#9C7E5A"/>
          </linearGradient>
          <linearGradient id="moveWindow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#BFDBFE"/>
            <stop offset="100%" stopColor="#93C5FD"/>
          </linearGradient>
          <linearGradient id="moveTire" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#404040"/>
            <stop offset="50%" stopColor="#262626"/>
            <stop offset="100%" stopColor="#171717"/>
          </linearGradient>
          <filter id="moveShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.25"/>
          </filter>
        </defs>
        {/* Truck */}
        <g filter="url(#moveShadow)">
          {/* Cargo area */}
          <rect x="2" y="20" width="40" height="28" rx="2" fill="url(#moveTruck)"/>
          <rect x="4" y="22" width="36" height="24" rx="1" fill="#2563EB"/>
          {/* Cab */}
          <rect x="42" y="28" width="18" height="20" rx="2" fill="url(#moveTruck)"/>
          <rect x="46" y="32" width="10" height="8" rx="1" fill="url(#moveWindow)"/>
          {/* Door line */}
          <line x1="42" y1="28" x2="42" y2="48" stroke="#1E40AF" strokeWidth="1"/>
        </g>
        {/* Wheels */}
        <g filter="url(#moveShadow)">
          <circle cx="14" cy="52" r="6" fill="url(#moveTire)"/>
          <circle cx="14" cy="52" r="3" fill="#737373"/>
          <circle cx="36" cy="52" r="6" fill="url(#moveTire)"/>
          <circle cx="36" cy="52" r="3" fill="#737373"/>
          <circle cx="52" cy="52" r="6" fill="url(#moveTire)"/>
          <circle cx="52" cy="52" r="3" fill="#737373"/>
        </g>
        {/* Boxes */}
        <g filter="url(#moveShadow)">
          <rect x="6" y="26" width="12" height="10" rx="1" fill="url(#moveBox)"/>
          <line x1="12" y1="26" x2="12" y2="36" stroke="#8B6914" strokeWidth="1"/>
          <line x1="6" y1="31" x2="18" y2="31" stroke="#8B6914" strokeWidth="1"/>
          <rect x="20" y="28" width="10" height="8" rx="1" fill="url(#moveBox)"/>
          <line x1="25" y1="28" x2="25" y2="36" stroke="#8B6914" strokeWidth="1"/>
        </g>
        {/* Box on top */}
        <g filter="url(#moveShadow)">
          <rect x="8" y="4" width="16" height="14" rx="1" fill="url(#moveBox)"/>
          <line x1="16" y1="4" x2="16" y2="18" stroke="#8B6914" strokeWidth="1.5"/>
          <line x1="8" y1="11" x2="24" y2="11" stroke="#8B6914" strokeWidth="1.5"/>
        </g>
      </svg>
    ),
    other: (
      <svg className={className} viewBox="0 0 64 64" fill="none">
        <defs>
          <linearGradient id="otherMetal" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E5E5E5"/>
            <stop offset="50%" stopColor="#A3A3A3"/>
            <stop offset="100%" stopColor="#737373"/>
          </linearGradient>
          <linearGradient id="otherHandle" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#DC2626"/>
            <stop offset="50%" stopColor="#EF4444"/>
            <stop offset="100%" stopColor="#DC2626"/>
          </linearGradient>
          <linearGradient id="otherYellow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FDE047"/>
            <stop offset="100%" stopColor="#FACC15"/>
          </linearGradient>
          <filter id="otherShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.2"/>
          </filter>
        </defs>
        {/* Screwdriver */}
        <g filter="url(#otherShadow)">
          <rect x="4" y="28" width="24" height="8" rx="2" fill="url(#otherHandle)"/>
          <rect x="6" y="30" width="2" height="4" fill="#B91C1C"/>
          <rect x="10" y="30" width="2" height="4" fill="#B91C1C"/>
          <rect x="14" y="30" width="2" height="4" fill="#B91C1C"/>
          <rect x="26" y="30" width="24" height="4" rx="1" fill="url(#otherMetal)"/>
          <path d="M48 30L54 32L48 34Z" fill="#737373"/>
        </g>
        {/* Hammer */}
        <g filter="url(#otherShadow)">
          <rect x="18" y="4" width="6" height="28" rx="1" fill="#8B4513"/>
          <rect x="20" y="6" width="2" height="24" fill="#A0522D" opacity="0.5"/>
          <rect x="8" y="2" width="26" height="10" rx="2" fill="url(#otherMetal)"/>
          <rect x="32" y="2" width="6" height="10" rx="1" fill="#A3A3A3"/>
          <line x1="10" y1="7" x2="32" y2="7" stroke="#D4D4D4" strokeWidth="1"/>
        </g>
        {/* Measuring tape */}
        <g filter="url(#otherShadow)">
          <rect x="36" y="42" width="22" height="16" rx="3" fill="url(#otherYellow)"/>
          <rect x="38" y="44" width="18" height="12" rx="2" fill="#FEF08A"/>
          <circle cx="47" cy="50" r="4" fill="#FACC15"/>
          <circle cx="47" cy="50" r="2" fill="#EAB308"/>
          <rect x="52" y="56" width="8" height="4" rx="1" fill="url(#otherYellow)"/>
          <line x1="54" y1="57" x2="54" y2="59" stroke="#EAB308" strokeWidth="0.5"/>
          <line x1="56" y1="57" x2="56" y2="59" stroke="#EAB308" strokeWidth="0.5"/>
        </g>
        {/* Gear/Settings icon */}
        <g filter="url(#otherShadow)" opacity="0.8">
          <circle cx="10" cy="52" r="6" fill="url(#otherMetal)"/>
          <circle cx="10" cy="52" r="3" fill="#525252"/>
          <rect x="8" y="44" width="4" height="4" fill="url(#otherMetal)"/>
          <rect x="8" y="56" width="4" height="4" fill="url(#otherMetal)"/>
          <rect x="2" y="50" width="4" height="4" fill="url(#otherMetal)"/>
          <rect x="14" y="50" width="4" height="4" fill="url(#otherMetal)"/>
        </g>
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
