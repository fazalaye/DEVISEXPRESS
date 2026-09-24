import { Devis } from '../types';

interface QuotePreviewProps {
  devis: Partial<Devis>;
  compact?: boolean;
}

export default function QuotePreview({ devis, compact = false }: QuotePreviewProps) {
  const items = devis.items || [];
  const total = items.reduce((sum, item) => sum + item.qte * item.prix, 0);
  const remiseAmount = total * ((devis.remise || 0) / 100);
  const finalTotal = total - remiseAmount;
  const acompteAmount = finalTotal * ((devis.acomptePercent || 50) / 100);

  return (
    <div className={`bg-white ${compact ? '' : 'shadow-lg'} border border-gray-100 ${compact ? 'p-4' : 'p-8'} rounded-lg`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-3">
          {devis.freelance?.logoUrl ? (
            <img src={devis.freelance.logoUrl} alt="Logo" className="w-12 h-12 rounded-lg object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#00C853] to-[#009624] flex items-center justify-center text-white font-bold text-lg">
              {(devis.freelance?.name || 'F')[0].toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-semibold text-[#0A0A0A] text-sm">{devis.freelance?.name || 'Votre nom'}</p>
            <p className="text-xs text-gray-500">{devis.freelance?.phone || '+221 7X XXX XX XX'}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Devis</p>
          <p className="font-mono font-semibold text-[#0A0A0A] text-sm">{devis.numero || 'DEV-XX-XXX'}</p>
          <p className="text-xs text-gray-400 mt-1">
            {devis.createdAt ? new Date(devis.createdAt).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>

      {/* Client Info */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Client</p>
        <p className="font-semibold text-[#0A0A0A] text-sm">{devis.client?.name || 'Nom du client'}</p>
        <p className="text-xs text-gray-500">{devis.client?.phone || '+221 7X XXX XX XX'}</p>
      </div>

      {/* Items Table */}
      <div className="mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 text-xs text-gray-400 uppercase tracking-wider font-medium">Description</th>
              <th className="text-center py-2 text-xs text-gray-400 uppercase tracking-wider font-medium w-16">Qté</th>
              <th className="text-right py-2 text-xs text-gray-400 uppercase tracking-wider font-medium w-28">Prix U.</th>
              <th className="text-right py-2 text-xs text-gray-400 uppercase tracking-wider font-medium w-28">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-4 text-center text-gray-300 text-xs">Aucune ligne ajoutée</td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-b border-gray-50">
                  <td className="py-3 text-[#0A0A0A]">{item.desc || '—'}</td>
                  <td className="py-3 text-center text-gray-600">{item.qte}</td>
                  <td className="py-3 text-right text-gray-600">{item.prix.toLocaleString('fr-FR')} F</td>
                  <td className="py-3 text-right font-medium text-[#0A0A0A]">{(item.qte * item.prix).toLocaleString('fr-FR')} F</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Sous-total</span>
          <span className="text-[#0A0A0A]">{total.toLocaleString('fr-FR')} FCFA</span>
        </div>
        {(devis.remise || 0) > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Remise ({devis.remise}%)</span>
            <span className="text-red-500">-{remiseAmount.toLocaleString('fr-FR')} FCFA</span>
          </div>
        )}
        <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-100">
          <span className="text-[#0A0A0A]">Total</span>
          <span className="text-[#0A0A0A]">{finalTotal.toLocaleString('fr-FR')} FCFA</span>
        </div>
        <div className="flex justify-between text-sm pt-2">
          <span className="text-[#00C853] font-semibold">Acompte ({devis.acomptePercent || 50}%)</span>
          <span className="text-[#00C853] font-bold text-base">{acompteAmount.toLocaleString('fr-FR')} FCFA</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">Devis valide 7 jours • Généré avec Devis Express</p>
      </div>
    </div>
  );
}
