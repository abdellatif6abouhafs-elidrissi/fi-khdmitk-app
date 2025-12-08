'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';

interface Service {
  _id: string;
  category: string;
  name: string;
  price: string;
}

interface Artisan {
  id: string;
  fullName: string;
  city: string;
  rating: number;
  totalReviews: number;
  isVerified: boolean;
  services: Service[];
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

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '14:00', '15:00', '16:00', '17:00', '18:00',
];

export default function BookingPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();

  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [loadingArtisan, setLoadingArtisan] = useState(true);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    serviceId: '',
    date: '',
    time: '',
    address: '',
    description: '',
    urgency: 'normal',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch artisan data
  useEffect(() => {
    const fetchArtisan = async () => {
      try {
        const response = await fetch(`/api/artisans/${params.id}`);
        const data = await response.json();
        if (data.artisan) {
          setArtisan(data.artisan);
        }
      } catch (error) {
        console.error('Error fetching artisan:', error);
      } finally {
        setLoadingArtisan(false);
      }
    };

    if (params.id) {
      fetchArtisan();
    }
  }, [params.id]);

  const handleSubmit = async () => {
    if (!user) {
      router.push('/login?redirect=/book/' + params.id);
      return;
    }

    if (!artisan) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const selectedService = artisan.services.find(s => s._id === formData.serviceId);

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          artisanId: artisan.id,
          service: {
            category: selectedService?.category,
            name: selectedService?.name,
            price: selectedService?.price,
          },
          date: formData.date,
          time: formData.time,
          address: formData.address,
          description: formData.description,
          urgency: formData.urgency,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la réservation');
      }

      setStep(4); // Success step
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedService = artisan?.services.find(s => s._id === formData.serviceId);

  if (loadingArtisan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-emerald-600" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Artisan non trouvé</h2>
          <Link href="/artisans" className="text-emerald-600 hover:underline">
            Retour à la liste des artisans
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link href={`/artisans/${params.id}`} className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour au profil
        </Link>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= s
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > s ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    s
                  )}
                </div>
                {s < 3 && (
                  <div className={`w-24 sm:w-32 h-1 ${step > s ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className={step >= 1 ? 'text-emerald-600' : 'text-gray-500'}>Service</span>
            <span className={step >= 2 ? 'text-emerald-600' : 'text-gray-500'}>Date & Heure</span>
            <span className={step >= 3 ? 'text-emerald-600' : 'text-gray-500'}>Confirmation</span>
          </div>
        </div>

        {/* Artisan Card Mini */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6 flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
            {artisan.fullName.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{artisan.fullName}</h3>
              {artisan.isVerified && (
                <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{artisan.city}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {artisan.rating}
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Step 1: Service Selection */}
          {step === 1 && (
            <div className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Choisissez un service</h2>

              <div className="space-y-3 mb-6">
                {artisan.services.map((service) => (
                  <button
                    key={service._id}
                    onClick={() => setFormData({ ...formData, serviceId: service._id })}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      formData.serviceId === service._id
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {categoryIcons[service.category] || '🔨'}
                        </span>
                        <span className="font-medium text-gray-900">{service.name}</span>
                      </div>
                      <span className="text-emerald-600 font-medium">{service.price}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Niveau d'urgence
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'normal', label: 'Normal', desc: 'Dans la semaine' },
                    { value: 'urgent', label: 'Urgent', desc: 'Sous 48h' },
                    { value: 'emergency', label: 'Urgence', desc: "Aujourd'hui" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setFormData({ ...formData, urgency: opt.value })}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${
                        formData.urgency === opt.value
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-medium text-gray-900">{opt.label}</p>
                      <p className="text-xs text-gray-500">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => setStep(2)}
                disabled={!formData.serviceId}
              >
                Continuer
              </Button>
            </div>
          )}

          {/* Step 2: Date & Time */}
          {step === 2 && (
            <div className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Choisissez la date et l'heure</h2>

              <div className="space-y-6">
                <Input
                  label="Date souhaitée"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heure préférée
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setFormData({ ...formData, time })}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                          formData.time === time
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <Input
                  label="Adresse d'intervention"
                  type="text"
                  placeholder="123 Rue Example, Casablanca"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />

                <Textarea
                  label="Description du problème"
                  placeholder="Décrivez votre problème en détail..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="flex gap-4 mt-8">
                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                  Retour
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => setStep(3)}
                  disabled={!formData.date || !formData.time || !formData.address}
                >
                  Continuer
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Confirmez votre réservation</h2>

              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Service</span>
                  <span className="font-medium text-gray-900">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tarif estimé</span>
                  <span className="font-medium text-emerald-600">{selectedService?.price}</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date</span>
                    <span className="font-medium text-gray-900">
                      {new Date(formData.date).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Heure</span>
                  <span className="font-medium text-gray-900">{formData.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Urgence</span>
                  <span className="font-medium text-gray-900">
                    {formData.urgency === 'normal' ? 'Normal' : formData.urgency === 'urgent' ? 'Urgent' : 'Urgence'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Adresse</span>
                  <span className="font-medium text-gray-900 text-right max-w-[60%]">{formData.address}</span>
                </div>
                {formData.description && (
                  <div className="border-t border-gray-200 pt-4">
                    <span className="text-gray-500 block mb-2">Description</span>
                    <p className="text-gray-900">{formData.description}</p>
                  </div>
                )}
              </div>

              <div className="bg-amber-50 rounded-xl p-4 mt-6 flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-amber-800">
                  Le paiement se fait directement avec l'artisan après l'intervention. Le tarif final peut varier selon la complexité du travail.
                </p>
              </div>

              {!user && (
                <div className="bg-blue-50 rounded-xl p-4 mt-4 flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-blue-800">
                    Vous devez être connecté pour confirmer votre réservation. Vous serez redirigé vers la page de connexion.
                  </p>
                </div>
              )}

              <div className="flex gap-4 mt-8">
                <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>
                  Retour
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Confirmation...' : user ? 'Confirmer la réservation' : 'Se connecter et réserver'}
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="p-6 sm:p-8 text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Réservation confirmée !</h2>
              <p className="text-gray-600 mb-8">
                Votre demande a été envoyée à {artisan.fullName}. Vous recevrez une confirmation par email.
              </p>

              <div className="bg-gray-50 rounded-xl p-6 text-left mb-8">
                <h3 className="font-semibold text-gray-900 mb-3">Prochaines étapes</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-emerald-600 text-sm font-medium">1</span>
                    </div>
                    <span className="text-gray-600">L'artisan confirmera votre rendez-vous sous 24h</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-emerald-600 text-sm font-medium">2</span>
                    </div>
                    <span className="text-gray-600">Vous pourrez suivre le statut dans "Mes réservations"</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-emerald-600 text-sm font-medium">3</span>
                    </div>
                    <span className="text-gray-600">Après l'intervention, laissez un avis pour aider la communauté</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-4">
                <Link href="/bookings" className="flex-1">
                  <Button variant="outline" className="w-full">Mes réservations</Button>
                </Link>
                <Link href="/" className="flex-1">
                  <Button variant="primary" className="w-full">Retour à l'accueil</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
