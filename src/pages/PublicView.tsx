import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Devis } from '../types';
import { getDevisByPublicId, updateDevisStatus } from '../store';
import QuotePreview from '../components/QuotePreview';

const statusConfig = {
  envoye: { label: 'Envoyé', color: 'bg-blue-100 text-blue-700', icon: '📤' },
  vu: { label: 'Vu', color: 'bg-yellow-100 text-yellow-700', icon: '👁' },
  accepte: { label: 'Accepté', color: 'bg-purple-100 text-purple-700', icon: '✅' },
  paye: { label: 'Payé', color: 'bg-green-100 text-green-700', icon: '💰' },
};

export default function PublicView() {
  const { publicId } = useParams<{ publicId: string }>();
  const [searchParams] = useSearchParams();
  const isOwner = searchParams.get('created') === 'true';

  const [devis, setDevis] = useState<Devis | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (publicId) {
      const d = getDevisByPublicId(publicId);
      if (d) {
        setDevis(d);
        // Track view
        if (d.status === 'envoye') {
          updateDevisStatus(publicId, 'vu');
          setDevis({ ...d, status: 'vu' });
        }
      }
      setLoading(false);
    }
  }, [publicId]);

  const handleAccept = () => {
    if (publicId && devis) {
      updateDevisStatus(publicId, 'accepte');
      setDevis({ ...devis, status: 'accepte' });
      setAccepted(true);
      setShowConfetti(true);
      // Trigger confetti
      import('canvas-confetti').then(({ default: confetti }) => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00C853', '#009624', '#4CAF50', '#81C784'],
        });
      });
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const handlePay = () => {
    if (devis?.freelance?.waveLink) {
      window.open(devis.freelance.waveLink, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00C853] to-[#009624]"></div>
          <p className="text-sm text-gray-400">Chargement du devis...</p>
        </div>
      </div>
    );
  }

  if (!devis) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-xl font-semibold text-[#0A0A0A] mb-2">Devis introuvable</h1>
          <p className="text-gray-500 text-sm mb-4">Ce devis n'existe pas ou a été supprimé.</p>
          <Link to="/dashboard" className="text-[#00C853] hover:underline text-sm font-medium">
            Retour au dashboard
          </Link>
        </div>
      </div>
    );
  }

  const status = statusConfig[devis.status];
  const items = devis.items || [];
  const total = items.reduce((sum, item) => sum + item.qte * item.prix, 0);
  const remiseAmount = total * ((devis.remise || 0) / 100);
  const finalTotal = total - remiseAmount;
  const acompteAmount = finalTotal * ((devis.acomptePercent || 50) / 100);

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-32">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00C853] to-[#009624] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-bold text-[#0A0A0A]">Devis Express</span>
          </Link>
          <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${status.color} flex items-center gap-1.5`}>
            <span>{status.icon}</span>
            <span>{status.label}</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Client greeting */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#0A0A0A] mb-1">
            Devis pour {devis.client.name}
          </h1>
          <p className="text-sm text-gray-500">
            Numéro {devis.numero} • {new Date(devis.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Quote Preview */}
        <QuotePreview devis={devis} />

        {/* Owner actions (only visible to the freelance who created it) */}
        {isOwner && (
          <div className="mt-6 bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-semibold text-[#0A0A0A] text-sm mb-3">📋 Actions rapide</h3>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                Voir le dashboard
              </Link>
              <button
                onClick={() => {
                  const link = `${window.location.origin}${window.location.pathname}#/d/${devis.publicId}`;
                  navigator.clipboard.writeText(link);
                  alert('Lien copié !');
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                📋 Copier le lien
              </button>
              <a
                href={`https://wa.me/${devis.client.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour ${devis.client.name}, voici votre devis de ${finalTotal.toLocaleString('fr-FR')} FCFA : ${window.location.origin}${window.location.pathname}#/d/${devis.publicId}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-lg text-sm font-medium transition-colors"
              >
                💬 Envoyer sur WhatsApp
              </a>
              {devis.status !== 'paye' && (
                <button
                  onClick={() => {
                    if (publicId) {
                      updateDevisStatus(publicId, 'paye');
                      setDevis({ ...devis, status: 'paye' });
                    }
                  }}
                  className="px-4 py-2 bg-[#00C853] hover:bg-[#00B84D] text-white rounded-lg text-sm font-medium transition-colors"
                >
                  💰 Marquer comme payé
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sticky CTA for client (not owner) */}
      {!isOwner && devis.status !== 'paye' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 p-4 z-50">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-3">
            {!accepted && devis.status !== 'accepte' ? (
              <button
                onClick={handleAccept}
                className="flex-1 py-3.5 border-2 border-[#0A0A0A] text-[#0A0A0A] font-semibold rounded-xl hover:bg-[#0A0A0A] hover:text-white transition-all text-sm"
              >
                ✅ Accepter le devis
              </button>
            ) : (
              <div className="flex-1 py-3.5 bg-purple-50 text-purple-700 font-semibold rounded-xl text-sm text-center flex items-center justify-center gap-2">
                ✅ Devis accepté !
              </div>
            )}
            {devis.freelance.waveLink && (
              <button
                onClick={handlePay}
                className="flex-1 py-3.5 bg-[#00C853] hover:bg-[#00B84D] text-white font-semibold rounded-xl transition-all text-sm shadow-lg shadow-[#00C853]/20"
              >
                💳 Payer l'acompte de {acompteAmount.toLocaleString('fr-FR')} FCFA via Wave
              </button>
            )}
          </div>
        </div>
      )}

      {/* Confetti overlay */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center animate-bounce">
            <div className="text-4xl mb-3">🎉</div>
            <h2 className="text-lg font-bold text-[#0A0A0A]">Devis accepté !</h2>
            <p className="text-sm text-gray-500 mt-1">Le freelance a été notifié</p>
          </div>
        </div>
      )}
    </div>
  );
}
