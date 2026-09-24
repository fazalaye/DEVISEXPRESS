import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Devis, DevisStatus } from '../types';
import { getAllDevis, deleteDevis, duplicateDevis, updateDevisStatus, seedDemoData } from '../store';

const columns: { key: DevisStatus; label: string; icon: string; color: string; bgColor: string }[] = [
  { key: 'envoye', label: 'Envoyé', icon: '📤', color: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-100' },
  { key: 'vu', label: 'Vu', icon: '👁', color: 'text-yellow-600', bgColor: 'bg-yellow-50 border-yellow-100' },
  { key: 'accepte', label: 'Accepté', icon: '✅', color: 'text-purple-600', bgColor: 'bg-purple-50 border-purple-100' },
  { key: 'paye', label: 'Payé', icon: '💰', color: 'text-green-600', bgColor: 'bg-green-50 border-green-100' },
];

export default function Dashboard() {
  const [devis, setDevis] = useState<Devis[]>([]);
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  useEffect(() => {
    seedDemoData();
    setDevis(getAllDevis());
  }, []);

  const refresh = () => setDevis(getAllDevis());

  const filteredDevis = devis.filter(d =>
    d.client.name.toLowerCase().includes(search.toLowerCase()) ||
    d.numero.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (publicId: string) => {
    if (confirm('Supprimer ce devis ?')) {
      deleteDevis(publicId);
      refresh();
    }
    setMenuOpen(null);
  };

  const handleDuplicate = (publicId: string) => {
    duplicateDevis(publicId);
    refresh();
    setMenuOpen(null);
  };

  const handleMarkPaid = (publicId: string) => {
    updateDevisStatus(publicId, 'paye');
    refresh();
    setMenuOpen(null);
  };

  const totalRevenue = devis
    .filter(d => d.status === 'paye')
    .reduce((sum, d) => sum + d.total, 0);

  const totalPending = devis
    .filter(d => d.status !== 'paye')
    .reduce((sum, d) => {
      const acompte = d.total * (d.acomptePercent / 100);
      return sum + acompte;
    }, 0);

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00C853] to-[#009624] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-bold text-[#0A0A0A] text-lg">Devis Express</span>
          </Link>
          <Link
            to="/new"
            className="px-4 py-2 bg-[#00C853] hover:bg-[#00B84D] text-white font-medium rounded-lg text-sm transition-all shadow-sm shadow-[#00C853]/20 flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Nouveau devis
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Total devis</p>
            <p className="text-2xl font-bold text-[#0A0A0A] mt-1">{devis.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider">En attente</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">{devis.filter(d => d.status === 'envoye' || d.status === 'vu').length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Encaissé</p>
            <p className="text-2xl font-bold text-[#00C853] mt-1">{totalRevenue.toLocaleString('fr-FR')} F</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider">À encaisser</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{totalPending.toLocaleString('fr-FR')} F</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un client ou un numéro de devis..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853]/20 focus:border-[#00C853] transition-all"
            />
          </div>
        </div>

        {/* Kanban Board */}
        {devis.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="text-5xl mb-4">📄</div>
            <h2 className="text-xl font-bold text-[#0A0A0A] mb-2">Aucun devis</h2>
            <p className="text-gray-500 text-sm mb-6">Crée ton premier devis en 30 secondes</p>
            <Link
              to="/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#00C853] hover:bg-[#00B84D] text-white font-semibold rounded-xl transition-all shadow-lg shadow-[#00C853]/20"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Créer mon premier devis
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {columns.map(col => {
              const colDevis = filteredDevis.filter(d => d.status === col.key);
              return (
                <div key={col.key} className={`rounded-xl border ${col.bgColor} p-4`}>
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{col.icon}</span>
                      <h3 className={`font-semibold text-sm ${col.color}`}>{col.label}</h3>
                    </div>
                    <span className={`w-6 h-6 rounded-full ${col.bgColor} border text-xs font-bold flex items-center justify-center ${col.color}`}>
                      {colDevis.length}
                    </span>
                  </div>

                  {/* Cards */}
                  <div className="space-y-2">
                    {colDevis.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-4">Aucun devis</p>
                    ) : (
                      colDevis.map(d => (
                        <div key={d.publicId} className="bg-white rounded-lg border border-gray-100 p-3 shadow-sm hover:shadow-md transition-shadow relative group">
                          <Link to={`/d/${d.publicId}?created=true`} className="block">
                            <p className="font-medium text-sm text-[#0A0A0A] truncate">{d.client.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{d.numero}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-sm font-bold text-[#00C853]">
                                {d.total.toLocaleString('fr-FR')} F
                              </span>
                              <span className="text-[10px] text-gray-400">
                                {new Date(d.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                              </span>
                            </div>
                          </Link>
                          
                          {/* 3 dots menu */}
                          <div className="absolute top-2 right-2">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setMenuOpen(menuOpen === d.publicId ? null : d.publicId);
                              }}
                              className="p-1 rounded hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="5" r="2" />
                                <circle cx="12" cy="12" r="2" />
                                <circle cx="12" cy="19" r="2" />
                              </svg>
                            </button>
                            {menuOpen === d.publicId && (
                              <div className="absolute right-0 top-8 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20">
                                <button
                                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDuplicate(d.publicId); }}
                                  className="w-full px-3 py-2 text-left text-xs hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <span>📋</span> Dupliquer
                                </button>
                                {d.status !== 'paye' && (
                                  <button
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleMarkPaid(d.publicId); }}
                                    className="w-full px-3 py-2 text-left text-xs hover:bg-gray-50 flex items-center gap-2"
                                  >
                                    <span>💰</span> Marquer payé
                                  </button>
                                )}
                                <button
                                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(d.publicId); }}
                                  className="w-full px-3 py-2 text-left text-xs hover:bg-red-50 text-red-500 flex items-center gap-2"
                                >
                                  <span>🗑</span> Supprimer
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Click outside to close menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
      )}
    </div>
  );
}
