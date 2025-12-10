'use client';

import { useState, useEffect } from 'react';

const steps = [
  {
    title: 'مرحبا بك في Fi-Khidmatik!',
    titleFr: 'Bienvenue sur Fi-Khidmatik!',
    description: 'المنصة الأولى في المغرب للخدمات المنزلية',
    descriptionFr: 'La première plateforme de services à domicile au Maroc',
    icon: (
      <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
        FK
      </div>
    ),
  },
  {
    title: 'ابحث عن حرفي',
    titleFr: 'Trouvez un artisan',
    description: 'اختر الخدمة اللي كتحتاجها وشوف الحرفيين المتوفرين فمدينتك',
    descriptionFr: 'Choisissez le service dont vous avez besoin et découvrez les artisans disponibles',
    icon: (
      <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center">
        <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    ),
  },
  {
    title: 'قارن واختار',
    titleFr: 'Comparez et choisissez',
    description: 'شوف التقييمات والأثمنة وختار الحرفي اللي يناسبك',
    descriptionFr: 'Consultez les avis et les tarifs pour faire le meilleur choix',
    icon: (
      <div className="w-20 h-20 bg-amber-100 rounded-2xl flex items-center justify-center">
        <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      </div>
    ),
  },
  {
    title: 'احجز موعدك',
    titleFr: 'Réservez votre rendez-vous',
    description: 'احجز فقليقات قليلة وخلي الحرفي يجي عندك',
    descriptionFr: 'Réservez en quelques clics et laissez l\'artisan venir chez vous',
    icon: (
      <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center">
        <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    ),
  },
];

export function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem('fi-khidmatik-onboarding');
    if (!hasSeenOnboarding) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('fi-khidmatik-onboarding', 'true');
    setIsOpen(false);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handleSkip = () => {
    handleClose();
  };

  if (!isOpen) return null;

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-slide-up">
        {/* Progress Bar */}
        <div className="flex gap-1 p-4">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full transition-colors ${
                index <= currentStep ? 'bg-emerald-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="px-8 pb-8 text-center">
          <div className="flex justify-center mb-6">{step.icon}</div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">{step.titleFr}</h2>
          <p className="text-emerald-600 font-medium mb-4" dir="rtl">{step.title}</p>

          <p className="text-gray-600 mb-2">{step.descriptionFr}</p>
          <p className="text-gray-500 text-sm" dir="rtl">{step.description}</p>
        </div>

        {/* Actions */}
        <div className="px-8 pb-8 flex gap-3">
          <button
            onClick={handleSkip}
            className="flex-1 py-3 text-gray-500 font-medium hover:text-gray-700 transition-colors"
          >
            Passer
          </button>
          <button
            onClick={handleNext}
            className="flex-1 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors"
          >
            {currentStep < steps.length - 1 ? 'Suivant' : 'Commencer'}
          </button>
        </div>
      </div>
    </div>
  );
}
