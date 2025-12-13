'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { NotificationBell } from '@/components/NotificationBell';

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
            <img src="/logo.svg" alt="Fi-Khidmatik" className="w-10 h-10 rounded-xl" />
            <span className="font-bold text-xl text-gray-900">Fi-Khidmatik</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-600 hover:text-emerald-600 transition-colors">
              {t('home')}
            </Link>
            {/* Show Artisans link only for customers or non-logged users */}
            {(!user || user.role === 'customer') && (
              <Link href="/artisans" className="text-gray-600 hover:text-emerald-600 transition-colors">
                {t('artisans')}
              </Link>
            )}
            <Link href="/about" className="text-gray-600 hover:text-emerald-600 transition-colors">
              {t('about')}
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-emerald-600 transition-colors">
              {t('contact')}
            </Link>
            {/* Role-based navigation */}
            {user && user.role === 'artisan' && (
              <Link href="/dashboard" className="text-emerald-600 font-medium hover:text-emerald-700 transition-colors flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Dashboard
              </Link>
            )}
            {user && user.role === 'admin' && (
              <Link href="/admin" className="text-purple-600 font-medium hover:text-purple-700 transition-colors flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Admin
              </Link>
            )}
            {user && user.role === 'customer' && (
              <Link href="/bookings" className="text-emerald-600 font-medium hover:text-emerald-700 transition-colors flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
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

            {/* Notification Bell */}
            {user && <NotificationBell />}

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
                    {user.role === 'artisan' && (
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-emerald-600 font-medium hover:bg-emerald-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                          </svg>
                          Mon tableau de bord
                        </span>
                      </Link>
                    )}
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-purple-600 font-medium hover:bg-purple-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Administration
                        </span>
                      </Link>
                    )}
                    {user.role === 'customer' && (
                      <Link
                        href="/bookings"
                        className="block px-4 py-2 text-emerald-600 font-medium hover:bg-emerald-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {t('bookings')}
                        </span>
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
                  {user.role === 'artisan' && (
                    <Link href="/dashboard" className="flex items-center gap-2 text-emerald-600 font-medium hover:text-emerald-700" onClick={() => setIsMenuOpen(false)}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      Mon tableau de bord
                    </Link>
                  )}
                  {user.role === 'admin' && (
                    <Link href="/admin" className="flex items-center gap-2 text-purple-600 font-medium hover:text-purple-700" onClick={() => setIsMenuOpen(false)}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Administration
                    </Link>
                  )}
                  {user.role === 'customer' && (
                    <Link href="/bookings" className="flex items-center gap-2 text-emerald-600 font-medium hover:text-emerald-700" onClick={() => setIsMenuOpen(false)}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {t('bookings')}
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
