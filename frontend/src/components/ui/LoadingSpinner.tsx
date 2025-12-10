'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'emerald' | 'white' | 'gray';
  className?: string;
}

export function LoadingSpinner({
  size = 'md',
  color = 'emerald',
  className = ''
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const colorClasses = {
    emerald: 'border-emerald-200 border-t-emerald-600',
    white: 'border-white/30 border-t-white',
    gray: 'border-gray-200 border-t-gray-600',
  };

  return (
    <div
      className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

interface LoadingOverlayProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingOverlay({ message = 'Chargement...', fullScreen = false }: LoadingOverlayProps) {
  const containerClass = fullScreen
    ? 'fixed inset-0 z-50'
    : 'absolute inset-0';

  return (
    <div className={`${containerClass} bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center`}>
      <LoadingSpinner size="lg" />
      {message && (
        <p className="mt-4 text-gray-600 font-medium">{message}</p>
      )}
    </div>
  );
}

interface LoadingButtonProps {
  loading: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function LoadingButton({
  loading,
  children,
  onClick,
  disabled = false,
  className = '',
  type = 'button'
}: LoadingButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`relative inline-flex items-center justify-center transition-all ${className} ${
        (disabled || loading) ? 'opacity-70 cursor-not-allowed' : ''
      }`}
    >
      {loading && (
        <LoadingSpinner size="sm" color="white" className="absolute" />
      )}
      <span className={loading ? 'invisible' : ''}>{children}</span>
    </button>
  );
}

interface PageLoaderProps {
  message?: string;
}

export function PageLoader({ message = 'Chargement de la page...' }: PageLoaderProps) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-16 h-16 border-4 border-emerald-100 rounded-full"></div>
        {/* Spinning ring */}
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-emerald-500 rounded-full animate-spin"></div>
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse"></div>
        </div>
      </div>
      <p className="mt-6 text-gray-600 font-medium">{message}</p>
      <p className="mt-2 text-gray-400 text-sm" dir="rtl">جاري التحميل...</p>
    </div>
  );
}

export function InlineLoader({ text = 'Chargement' }: { text?: string }) {
  return (
    <div className="flex items-center gap-2 text-gray-500">
      <LoadingSpinner size="sm" color="gray" />
      <span className="text-sm">{text}</span>
    </div>
  );
}
