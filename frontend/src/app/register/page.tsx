'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';

const cities = [
  { value: '', label: 'Sélectionnez une ville' },
  { value: 'casablanca', label: 'Casablanca' },
  { value: 'rabat', label: 'Rabat' },
  { value: 'marrakech', label: 'Marrakech' },
  { value: 'fes', label: 'Fès' },
  { value: 'tangier', label: 'Tanger' },
  { value: 'agadir', label: 'Agadir' },
  { value: 'meknes', label: 'Meknès' },
  { value: 'oujda', label: 'Oujda' },
  { value: 'kenitra', label: 'Kénitra' },
  { value: 'tetouan', label: 'Tétouan' },
];

const categories = [
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

function RegisterContent() {
  const { t } = useLanguage();
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams?.get('role') || 'customer';

  const [step, setStep] = useState(1);
  const [role, setRole] = useState<'customer' | 'artisan'>(defaultRole as 'customer' | 'artisan');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    city: '',
    // Artisan specific
    bio: '',
    experience: '',
    services: [] as string[],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(s => s !== serviceId)
        : [...prev.services, serviceId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setLoading(true);

    try {
      await register({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        city: formData.city,
        role: role,
      });
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">FK</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{t('register')}</h1>
          <p className="mt-2 text-gray-600">
            Créez votre compte Fi-Khidmatik
          </p>
        </div>

        {/* Role Selection */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Je suis un...</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`p-6 rounded-xl border-2 transition-all ${
                role === 'customer'
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-4xl mb-3">👤</div>
              <h3 className="font-semibold text-gray-900">Client</h3>
              <p className="text-sm text-gray-500 mt-1">Je cherche un artisan</p>
            </button>
            <button
              type="button"
              onClick={() => setRole('artisan')}
              className={`p-6 rounded-xl border-2 transition-all ${
                role === 'artisan'
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-4xl mb-3">🔧</div>
              <h3 className="font-semibold text-gray-900">Artisan</h3>
              <p className="text-sm text-gray-500 mt-1">Je propose mes services</p>
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Step 1: Basic Info */}
            {step === 1 && (
              <>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Nom complet"
                    type="text"
                    placeholder="Ahmed Ben Ali"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                  <Input
                    label={t('phone')}
                    type="tel"
                    placeholder="+212 6XX XXX XXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                <Input
                  label={t('email')}
                  type="email"
                  placeholder="exemple@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />

                <Select
                  label="Ville"
                  options={cities}
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />

                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label={t('password')}
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <Input
                    label="Confirmer le mot de passe"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>

                {role === 'artisan' ? (
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={() => setStep(2)}
                  >
                    Continuer
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? 'Création du compte...' : 'Créer mon compte'}
                  </Button>
                )}
              </>
            )}

            {/* Step 2: Artisan Details */}
            {step === 2 && role === 'artisan' && (
              <>
                <div className="mb-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Retour
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Sélectionnez vos services
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {categories.map((category) => (
                      <button
                        key={category.value}
                        type="button"
                        onClick={() => handleServiceToggle(category.value)}
                        className={`p-3 rounded-xl border-2 text-left transition-all ${
                          formData.services.includes(category.value)
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-xl">{category.icon}</span>
                        <p className="text-sm font-medium text-gray-900 mt-1">{category.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <Input
                  label="Années d'expérience"
                  type="number"
                  placeholder="5"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Bio / Description
                  </label>
                  <textarea
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 resize-none"
                    rows={4}
                    placeholder="Décrivez votre expérience et vos compétences..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={loading || formData.services.length === 0}
                >
                  {loading ? 'Création du compte...' : 'Créer mon compte artisan'}
                </Button>
              </>
            )}
          </form>

          {/* Terms */}
          <p className="mt-6 text-sm text-gray-500 text-center">
            En créant un compte, vous acceptez nos{' '}
            <Link href="/terms" className="text-emerald-600 hover:text-emerald-700">
              Conditions d'utilisation
            </Link>{' '}
            et notre{' '}
            <Link href="/privacy" className="text-emerald-600 hover:text-emerald-700">
              Politique de confidentialité
            </Link>
          </p>
        </div>

        {/* Login Link */}
        <p className="mt-8 text-center text-gray-600">
          Vous avez déjà un compte ?{' '}
          <Link href="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
            {t('login')}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-emerald-600" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    }>
      <RegisterContent />
    </Suspense>
  );
}
