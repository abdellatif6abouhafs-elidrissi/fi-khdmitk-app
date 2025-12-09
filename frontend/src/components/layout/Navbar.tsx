'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';

export function Navbar() {
  const { t, lang, setLang, isRTL } = useLanguage();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">FK</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Fi-Khidmatik</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-600 hover:text-emerald-600 transition-colors">
              {t('home')}
            </Link>
            <Link href="/artisans" className="text-gray-600 hover:text-emerald-600 transition-colors">
              {t('artisans')}
            </Link>
            <Link href="/services" className="text-gray-600 hover:text-emerald-600 transition-colors">
              {t('services')}
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-emerald-600 transition-colors">
              {t('about')}
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-emerald-600 transition-colors">
              {t('contact')}
            </Link>
            {user && (
              <Link href="/bookings" className="text-gray-600 hover:text-emerald-600 transition-colors">
                {t('bookings')}
              </Link>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors"
            >
              {lang === 'fr' ? 'العربية' : 'Français'}
            </button>

            {/* Auth Buttons */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2"
                >
                  <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 font-medium">
                      {user.fullName.charAt(0)}
                    </span>
                  </div>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-medium text-gray-900 truncate">{user.fullName}</p>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      {t('profile')}
                    </Link>
                    <Link
                      href="/bookings"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      {t('bookings')}
                    </Link>
                    {user.role === 'artisan' && (
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Dashboard
                      </Link>
                    )}
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50"
                    >
                      {t('logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost">{t('login')}</Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary">{t('register')}</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-4">
              <Link href="/" className="text-gray-600 hover:text-emerald-600">
                {t('home')}
              </Link>
              <Link href="/artisans" className="text-gray-600 hover:text-emerald-600">
                {t('artisans')}
              </Link>
              <Link href="/services" className="text-gray-600 hover:text-emerald-600">
                {t('services')}
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-emerald-600">
                {t('about')}
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-emerald-600">
                {t('contact')}
              </Link>
              {user ? (
                <div className="pt-4 border-t border-gray-100 space-y-2">
                  <div className="flex items-center gap-3 pb-2">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-emerald-600 font-medium">{user.fullName.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.fullName}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <Link href="/profile" className="block text-gray-600 hover:text-emerald-600" onClick={() => setIsMenuOpen(false)}>
                    {t('profile')}
                  </Link>
                  <Link href="/bookings" className="block text-gray-600 hover:text-emerald-600" onClick={() => setIsMenuOpen(false)}>
                    {t('bookings')}
                  </Link>
                  {user.role === 'artisan' && (
                    <Link href="/dashboard" className="block text-gray-600 hover:text-emerald-600" onClick={() => setIsMenuOpen(false)}>
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left text-red-600 hover:text-red-700 pt-2"
                  >
                    {t('logout')}
                  </button>
                </div>
              ) : (
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <Link href="/login" className="flex-1">
                    <Button variant="outline" className="w-full">{t('login')}</Button>
                  </Link>
                  <Link href="/register" className="flex-1">
                    <Button variant="primary" className="w-full">{t('register')}</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
