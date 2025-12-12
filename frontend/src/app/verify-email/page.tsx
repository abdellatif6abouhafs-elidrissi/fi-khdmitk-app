'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get('email') || '';

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, 6).split('');

    if (digits.length > 0) {
      const newCode = ['', '', '', '', '', ''];
      digits.forEach((digit, i) => {
        if (i < 6) {
          newCode[i] = digit;
        }
      });
      setCode(newCode);
      // Focus the last filled input or the next empty one
      const focusIndex = Math.min(digits.length, 5);
      setTimeout(() => inputRefs.current[focusIndex]?.focus(), 0);
    }
  };

  // Handle input change - single digit only
  const handleChange = (index: number, value: string) => {
    // Only take the first digit entered
    const digit = value.replace(/\D/g, '').slice(0, 1);

    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);

    // Auto-focus next input
    if (digit && index < 5) {
      setTimeout(() => inputRefs.current[index + 1]?.focus(), 0);
    }
  };

  // Handle keydown for navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newCode = [...code];
      if (code[index]) {
        // Clear current input
        newCode[index] = '';
        setCode(newCode);
      } else if (index > 0) {
        // Go back and clear previous
        newCode[index - 1] = '';
        setCode(newCode);
        setTimeout(() => inputRefs.current[index - 1]?.focus(), 0);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Verify code
  const handleVerify = async () => {
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setError('Veuillez entrer le code complet');
      return;
    }

    if (!email) {
      setError('Email manquant. Veuillez retourner à la page d\'inscription.');
      return;
    }

    setLoading(true);
    setError('');

    // Decode email in case it's URL encoded
    const decodedEmail = decodeURIComponent(email).toLowerCase().trim();

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: decodedEmail, code: fullCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur de vérification');
      }

      setSuccess('Email vérifié avec succès!');

      // Redirect to home after 2 seconds (use window.location to refresh auth state)
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Resend code
  const handleResend = async () => {
    if (countdown > 0) return;

    if (!email) {
      setError('Email manquant. Veuillez retourner à la page d\'inscription.');
      return;
    }

    setResendLoading(true);
    setError('');

    const decodedEmail = decodeURIComponent(email).toLowerCase().trim();

    try {
      const response = await fetch('/api/auth/resend-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: decodedEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi');
      }

      setSuccess('Un nouveau code a été envoyé!');
      setCountdown(60); // 60 seconds countdown
      setCode(['', '', '', '', '', '']);
      setTimeout(() => setSuccess(''), 3000);
      // Focus first input
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">FK</span>
            </div>
          </Link>
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Vérifiez votre email</h1>
          <p className="mt-2 text-gray-600">
            Nous avons envoyé un code de vérification à
          </p>
          <p className="font-semibold text-emerald-600">{email}</p>
        </div>

        {/* Code Input */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 bg-emerald-50 text-emerald-600 px-4 py-3 rounded-xl text-sm text-center">
              {success}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
              Entrez le code à 6 chiffres
            </label>
            <div className="flex justify-center gap-2 sm:gap-3" dir="ltr" onPaste={handlePaste}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-11 h-14 sm:w-12 sm:h-16 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  disabled={loading}
                  autoComplete="one-time-code"
                />
              ))}
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleVerify}
            disabled={loading || code.join('').length !== 6}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Vérification...
              </span>
            ) : (
              'Vérifier'
            )}
          </Button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 mb-2">
              Vous n'avez pas reçu le code ?
            </p>
            <button
              onClick={handleResend}
              disabled={countdown > 0 || resendLoading}
              className={`text-sm font-semibold ${
                countdown > 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-emerald-600 hover:text-emerald-700'
              }`}
            >
              {resendLoading ? (
                'Envoi en cours...'
              ) : countdown > 0 ? (
                `Renvoyer dans ${countdown}s`
              ) : (
                'Renvoyer le code'
              )}
            </button>
          </div>
        </div>

        {/* Help */}
        <p className="mt-8 text-center text-sm text-gray-500">
          Le code expire dans 15 minutes.{' '}
          <Link href="/contact" className="text-emerald-600 hover:text-emerald-700">
            Besoin d'aide ?
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <svg className="animate-spin h-8 w-8 text-emerald-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
