'use client';

import { useState, useEffect } from 'react';

interface Artisan {
  _id: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    city: string;
    isVerified: boolean;
  };
  bio: string;
  experience: number;
  services: { category: string; name: string; price: string }[];
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  isApproved: boolean;
  completedJobs: number;
  createdAt: string;
}

export default function AdminArtisansPage() {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchArtisans();
  }, [currentPage, filterStatus]);

  const fetchArtisans = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(filterStatus !== 'all' && { status: filterStatus }),
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await fetch(`/api/admin/artisans?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setArtisans(data.artisans || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching artisans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchArtisans();
  };

  const handleApprove = async (artisanId: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/admin/artisans/${artisanId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isApproved: true }),
      });
      fetchArtisans();
    } catch (error) {
      console.error('Error approving artisan:', error);
    }
  };

  const handleReject = async (artisanId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir rejeter cet artisan ?')) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/admin/artisans/${artisanId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isApproved: false }),
      });
      fetchArtisans();
    } catch (error) {
      console.error('Error rejecting artisan:', error);
    }
  };

  const handleDelete = async (artisanId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet artisan ?')) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/admin/artisans/${artisanId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchArtisans();
    } catch (error) {
      console.error('Error deleting artisan:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Gestion des Artisans</h2>
          <p className="text-gray-400 mt-1">Approuvez et gérez les artisans de la plateforme</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Rechercher par nom ou service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="approved">Approuvés</option>
            <option value="rejected">Rejetés</option>
          </select>
          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors"
          >
            Rechercher
          </button>
        </form>
      </div>

      {/* Artisans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artisans.length > 0 ? (
          artisans.map((artisan) => (
            <div
              key={artisan._id}
              className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-colors"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                      <span className="text-white text-xl font-bold">
                        {artisan.user?.fullName?.charAt(0) || 'A'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{artisan.user?.fullName}</h3>
                      <p className="text-sm text-gray-400">{artisan.user?.city}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      artisan.isApproved
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {artisan.isApproved ? 'Approuvé' : 'En attente'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Contact */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {artisan.user?.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {artisan.user?.phone}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-700">
                  <div className="text-center">
                    <p className="text-xl font-bold text-white">{artisan.experience || 0}</p>
                    <p className="text-xs text-gray-500">Ans exp.</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-white">{artisan.completedJobs || 0}</p>
                    <p className="text-xs text-gray-500">Jobs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-white flex items-center justify-center gap-1">
                      {artisan.rating?.toFixed(1) || '0.0'}
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </p>
                    <p className="text-xs text-gray-500">Note</p>
                  </div>
                </div>

                {/* Services */}
                <div>
                  <p className="text-xs text-gray-500 mb-2">Services</p>
                  <div className="flex flex-wrap gap-2">
                    {artisan.services?.slice(0, 3).map((service, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-lg"
                      >
                        {service.name}
                      </span>
                    ))}
                    {artisan.services?.length > 3 && (
                      <span className="px-2 py-1 bg-gray-700 text-gray-400 text-xs rounded-lg">
                        +{artisan.services.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 py-4 bg-gray-700/30 flex items-center justify-between">
                {!artisan.isApproved ? (
                  <>
                    <button
                      onClick={() => handleApprove(artisan._id)}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Approuver
                    </button>
                    <button
                      onClick={() => handleReject(artisan._id)}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium transition-colors"
                    >
                      Rejeter
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleReject(artisan._id)}
                      className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg text-sm font-medium transition-colors"
                    >
                      Suspendre
                    </button>
                    <button
                      onClick={() => handleDelete(artisan._id)}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium transition-colors"
                    >
                      Supprimer
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            Aucun artisan trouvé
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            Précédent
          </button>
          <span className="text-gray-400">
            Page {currentPage} sur {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}
