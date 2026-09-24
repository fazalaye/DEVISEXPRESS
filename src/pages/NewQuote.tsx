import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DevisItem } from '../types';
import { createDevis } from '../store';
import QuotePreview from '../components/QuotePreview';

export default function NewQuote() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('+221 ');
  const [freelanceName, setFreelanceName] = useState('');
  const [freelancePhone, setFreelancePhone] = useState('+221 ');
  const [waveLink, setWaveLink] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [remise, setRemise] = useState(0);
  const [acomptePercent, setAcomptePercent] = useState(50);
  const [items, setItems] = useState<DevisItem[]>([
    { id: crypto.randomUUID(), desc: '', qte: 1, prix: 0 },
  ]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [generating, setGenerating] = useState(false);

  const addItem = () => {
    setItems([...items, { id: crypto.randomUUID(), desc: '', qte: 1, prix: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof DevisItem, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    if (!clientName || !clientPhone || !freelanceName || !freelancePhone) {
      alert('Veuillez remplir les informations obligatoires (nom client, téléphone, votre nom, votre téléphone)');
      return;
    }
    const hasValidItems = items.some(item => item.desc && item.prix > 0);
    if (!hasValidItems) {
      alert('Veuillez ajouter au moins une ligne avec une description et un prix');
      return;
    }

    setGenerating(true);
    setTimeout(() => {
      const devis = createDevis({
        freelance: { name: freelanceName, phone: freelancePhone, logoUrl, waveLink },
        client: { name: clientName, phone: clientPhone },
        items: items.filter(item => item.desc && item.prix > 0),
        total: items.reduce((sum, item) => sum + item.qte * item.prix, 0) * (1 - remise / 100),
        remise,
        acomptePercent,
      });
      setGenerating(false);
      navigate(`/d/${devis.publicId}?created=true`);
    }, 800);
  };

  const total = items.reduce((sum, item) => sum + item.qte * item.prix, 0);
  const finalTotal = total * (1 - remise / 100);
  const acompteAmount = finalTotal * (acomptePercent / 100);

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
          <Link to="/dashboard" className="text-sm text-gray-500 hover:text-[#0A0A0A] transition-colors">
            ← Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Form */}
          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="font-semibold text-[#0A0A0A] mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#00C853]/10 text-[#00C853] text-xs flex items-center justify-center font-bold">1</span>
                Informations
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Votre nom *</label>
                  <input
                    type="text"
                    value={freelanceName}
                    onChange={e => setFreelanceName(e.target.value)}
                    placeholder="Ex: Moussa Design"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853]/20 focus:border-[#00C853] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Votre téléphone *</label>
                  <input
                    type="tel"
                    value={freelancePhone}
                    onChange={e => setFreelancePhone(e.target.value)}
                    placeholder="+221 77 123 45 67"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853]/20 focus:border-[#00C853] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Nom du client *</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    placeholder="Ex: Restaurant Le Baobab"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853]/20 focus:border-[#00C853] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Téléphone client *</label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={e => setClientPhone(e.target.value)}
                    placeholder="+221 76 543 21 00"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853]/20 focus:border-[#00C853] transition-all"
                  />
                </div>
              </div>

              {/* Logo Upload */}
              <div className="mt-4">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Votre logo (optionnel)</label>
                <div className="flex items-center gap-3">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="w-10 h-10 rounded-lg object-cover border border-gray-200" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm text-[#00C853] hover:underline font-medium"
                  >
                    {logoUrl ? 'Changer' : 'Uploader un logo'}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="font-semibold text-[#0A0A0A] mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#00C853]/10 text-[#00C853] text-xs flex items-center justify-center font-bold">2</span>
                Prestations
              </h2>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={item.id} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                    <span className="text-xs text-gray-400 mt-2.5 w-4 shrink-0">{index + 1}</span>
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={item.desc}
                        onChange={e => updateItem(item.id, 'desc', e.target.value)}
                        placeholder="Description de la prestation"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853]/20 focus:border-[#00C853] transition-all"
                      />
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="text-[10px] text-gray-400 uppercase">Qté</label>
                          <input
                            type="number"
                            min="1"
                            value={item.qte}
                            onChange={e => updateItem(item.id, 'qte', parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-1.5 rounded border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853]/20 focus:border-[#00C853]"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-[10px] text-gray-400 uppercase">Prix U. (FCFA)</label>
                          <input
                            type="number"
                            min="0"
                            value={item.prix || ''}
                            onChange={e => updateItem(item.id, 'prix', parseInt(e.target.value) || 0)}
                            placeholder="50000"
                            className="w-full px-2 py-1.5 rounded border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853]/20 focus:border-[#00C853]"
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="mt-2 p-1 text-gray-300 hover:text-red-400 transition-colors"
                      disabled={items.length === 1}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addItem}
                className="mt-3 w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-400 hover:border-[#00C853] hover:text-[#00C853] transition-all flex items-center justify-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Ajouter une ligne
              </button>
            </div>

            {/* Totals & Payment */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="font-semibold text-[#0A0A0A] mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#00C853]/10 text-[#00C853] text-xs flex items-center justify-center font-bold">3</span>
                Total & Paiement
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Remise (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={remise}
                    onChange={e => setRemise(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853]/20 focus:border-[#00C853] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Acompte (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={acomptePercent}
                    onChange={e => setAcomptePercent(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853]/20 focus:border-[#00C853] transition-all"
                  />
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total</span>
                  <span className="font-semibold text-[#0A0A0A]">{finalTotal.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#00C853] font-medium">Acompte à encaisser</span>
                  <span className="font-bold text-[#00C853]">{acompteAmount.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>

              {/* Wave Link */}
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <label className="text-xs font-medium text-gray-500">Lien Wave pour l'acompte</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowTooltip(!showTooltip)}
                      className="w-4 h-4 rounded-full bg-gray-200 text-gray-500 text-[10px] flex items-center justify-center hover:bg-gray-300"
                    >
                      ?
                    </button>
                    {showTooltip && (
                      <div className="absolute bottom-full left-0 mb-2 w-56 p-2 bg-[#0A0A0A] text-white text-xs rounded-lg shadow-lg z-10">
                        Va dans ton app Wave → Recevoir → Partager le lien de paiement
                        <div className="absolute top-full left-4 w-2 h-2 bg-[#0A0A0A] rotate-45 -mt-1"></div>
                      </div>
                    )}
                  </div>
                </div>
                <input
                  type="url"
                  value={waveLink}
                  onChange={e => setWaveLink(e.target.value)}
                  placeholder="https://pay.wave.com/m/..."
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853]/20 focus:border-[#00C853] transition-all"
                />
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full py-4 bg-[#00C853] hover:bg-[#00B84D] disabled:bg-[#00C853]/50 text-white font-semibold rounded-xl transition-all shadow-lg shadow-[#00C853]/20 flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Génération en cours...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Générer le lien du devis
                </>
              )}
            </button>
          </div>

          {/* Right: Live Preview */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Aperçu en direct</h3>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">Se met à jour automatiquement</span>
            </div>
            <QuotePreview
              devis={{
                freelance: { name: freelanceName, phone: freelancePhone, logoUrl, waveLink },
                client: { name: clientName, phone: clientPhone },
                items,
                remise,
                acomptePercent,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
