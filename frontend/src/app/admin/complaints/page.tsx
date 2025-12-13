'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

interface Complaint {
  _id: string;
  subject: string;
  message: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  user: {
    fullName: string;
    email: string;
  };
  createdAt: string;
  response?: string;
}

export default function AdminComplaintsPage() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [response, setResponse] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Simulated complaints data
    const mockComplaints: Complaint[] = [
      {
        _id: '1',
        subject: 'Artisan ne répond pas',
        message: 'J\'ai réservé un plombier il y a 3 jours et il ne répond toujours pas à mes appels.',
        status: 'pending',
        priority: 'high',
        user: { fullName: 'Mohammed Alami', email: 'mohammed@example.com' },
        createdAt: new Date().toISOString(),
      },
      {
        _id: '2',
        subject: 'Problème de paiement',
        message: 'J\'ai été débité deux fois pour la même réservation.',
        status: 'in_progress',
        priority: 'high',
        user: { fullName: 'Fatima Benali', email: 'fatima@example.com' },
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        response: 'Nous vérifions votre dossier avec notre équipe comptable.',
      },
      {
        _id: '3',
        subject: 'Service non conforme',
        message: 'Le travail effectué par l\'électricien n\'était pas conforme à ce qui était convenu.',
        status: 'resolved',
        priority: 'medium',
        user: { fullName: 'Youssef Tazi', email: 'youssef@example.com' },
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        response: 'Nous avons contacté l\'artisan et organisé une intervention gratuite pour corriger le problème.',
      },
      {
        _id: '4',
        subject: 'Demande de remboursement',
        message: 'L\'artisan n\'est jamais venu et je demande un remboursement complet.',
        status: 'pending',
        priority: 'medium',
        user: { fullName: 'Sara Idrissi', email: 'sara@example.com' },
        createdAt: new Date(Date.now() - 259200000).toISOString(),
      },
    ];
    setComplaints(mockComplaints);
    setLoading(false);
  }, []);

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-500/20 text-yellow-400',
      in_progress: 'bg-blue-500/20 text-blue-400',
      resolved: 'bg-emerald-500/20 text-emerald-400',
      closed: 'bg-gray-500/20 text-gray-400',
    };
    const labels = {
      pending: 'En attente',
      in_progress: 'En cours',
      resolved: 'Résolu',
      closed: 'Fermé',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      low: 'bg-gray-500/20 text-gray-400',
      medium: 'bg-orange-500/20 text-orange-400',
      high: 'bg-red-500/20 text-red-400',
    };
    const labels = {
      low: 'Basse',
      medium: 'Moyenne',
      high: 'Haute',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[priority as keyof typeof styles]}`}>
        {labels[priority as keyof typeof labels]}
      </span>
    );
  };

  const handleUpdateStatus = (complaintId: string, newStatus: string) => {
    setComplaints(complaints.map(c =>
      c._id === complaintId ? { ...c, status: newStatus as Complaint['status'] } : c
    ));
  };

  const handleSendResponse = () => {
    if (!selectedComplaint || !response.trim()) return;

    setComplaints(complaints.map(c =>
      c._id === selectedComplaint._id
        ? { ...c, response, status: 'in_progress' as const }
        : c
    ));
    setSelectedComplaint(null);
    setResponse('');
  };

  const filteredComplaints = complaints.filter(c =>
    filter === 'all' || c.status === filter
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Réclamations</h2>
          <p className="text-gray-400 mt-1">Gérez les réclamations des utilisateurs</p>
        </div>
        {/* Filter */}
        <div className="flex gap-2">
          {['all', 'pending', 'in_progress', 'resolved'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {status === 'all' ? 'Toutes' :
               status === 'pending' ? 'En attente' :
               status === 'in_progress' ? 'En cours' : 'Résolues'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-sm">Total</p>
          <p className="text-2xl font-bold text-white">{complaints.length}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-sm">En attente</p>
          <p className="text-2xl font-bold text-yellow-400">{complaints.filter(c => c.status === 'pending').length}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-sm">En cours</p>
          <p className="text-2xl font-bold text-blue-400">{complaints.filter(c => c.status === 'in_progress').length}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-sm">Résolues</p>
          <p className="text-2xl font-bold text-emerald-400">{complaints.filter(c => c.status === 'resolved').length}</p>
        </div>
      </div>

      {/* Complaints List */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Sujet</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Utilisateur</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Priorité</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Statut</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Date</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map((complaint) => (
                <tr key={complaint._id} className="border-b border-gray-700 hover:bg-gray-700/50">
                  <td className="py-4 px-6">
                    <p className="text-white font-medium">{complaint.subject}</p>
                    <p className="text-gray-400 text-sm truncate max-w-xs">{complaint.message}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-white">{complaint.user.fullName}</p>
                    <p className="text-gray-400 text-sm">{complaint.user.email}</p>
                  </td>
                  <td className="py-4 px-6">{getPriorityBadge(complaint.priority)}</td>
                  <td className="py-4 px-6">{getStatusBadge(complaint.status)}</td>
                  <td className="py-4 px-6 text-gray-400 text-sm">
                    {new Date(complaint.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedComplaint(complaint)}
                        className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors"
                        title="Répondre"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                      </button>
                      {complaint.status !== 'resolved' && (
                        <button
                          onClick={() => handleUpdateStatus(complaint._id, 'resolved')}
                          className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                          title="Marquer comme résolu"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Response Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl max-w-lg w-full p-6 border border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{selectedComplaint.subject}</h3>
                <p className="text-gray-400 text-sm">De: {selectedComplaint.user.fullName}</p>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
              <p className="text-gray-300">{selectedComplaint.message}</p>
            </div>
            {selectedComplaint.response && (
              <div className="bg-emerald-500/10 rounded-lg p-4 mb-4 border border-emerald-500/20">
                <p className="text-sm text-emerald-400 font-medium mb-1">Réponse précédente:</p>
                <p className="text-gray-300">{selectedComplaint.response}</p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Votre réponse</label>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                placeholder="Écrivez votre réponse..."
              />
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setSelectedComplaint(null)}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSendResponse}
                disabled={!response.trim()}
                className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
