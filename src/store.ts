import { Devis } from './types';

const STORAGE_KEY = 'devis-express-data';

function generatePublicId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateNumero(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear()).slice(-2);
  const devis = getAllDevis();
  const count = devis.length + 1;
  return `DEV-${year}${month}-${String(count).padStart(3, '0')}`;
}

export function getAllDevis(): Devis[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getDevisByPublicId(publicId: string): Devis | undefined {
  const devis = getAllDevis();
  return devis.find(d => d.publicId === publicId);
}

export function createDevis(devis: Omit<Devis, 'publicId' | 'numero' | 'status' | 'createdAt' | 'updatedAt'>): Devis {
  const now = new Date().toISOString();
  const newDevis: Devis = {
    ...devis,
    publicId: generatePublicId(),
    numero: generateNumero(),
    status: 'envoye',
    createdAt: now,
    updatedAt: now,
  };
  const allDevis = getAllDevis();
  allDevis.push(newDevis);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allDevis));
  return newDevis;
}

export function updateDevisStatus(publicId: string, status: Devis['status']): Devis | undefined {
  const allDevis = getAllDevis();
  const index = allDevis.findIndex(d => d.publicId === publicId);
  if (index === -1) return undefined;
  allDevis[index].status = status;
  allDevis[index].updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allDevis));
  return allDevis[index];
}

export function deleteDevis(publicId: string): boolean {
  const allDevis = getAllDevis();
  const filtered = allDevis.filter(d => d.publicId !== publicId);
  if (filtered.length === allDevis.length) return false;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

export function duplicateDevis(publicId: string): Devis | undefined {
  const original = getDevisByPublicId(publicId);
  if (!original) return undefined;
  const now = new Date().toISOString();
  const newDevis: Devis = {
    ...original,
    publicId: generatePublicId(),
    numero: generateNumero(),
    status: 'envoye',
    createdAt: now,
    updatedAt: now,
    items: original.items.map(item => ({ ...item, id: crypto.randomUUID() })),
  };
  const allDevis = getAllDevis();
  allDevis.push(newDevis);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allDevis));
  return newDevis;
}

export function getWhatsAppLink(devis: Devis): string {
  const baseUrl = window.location.origin + window.location.pathname;
  const link = `${baseUrl}#/d/${devis.publicId}`;
  const text = `Bonjour ${devis.client.name}, voici votre devis de ${devis.total.toLocaleString('fr-FR')} FCFA : ${link}`;
  return `https://wa.me/${devis.client.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
}

export function seedDemoData(): void {
  const existing = getAllDevis();
  if (existing.length > 0) return;

  const demoDevis: Devis[] = [
    {
      publicId: 'abc123',
      numero: 'DEV-2609-001',
      freelance: { name: 'Moussa Design', phone: '+221 77 456 78 90', logoUrl: '', waveLink: 'https://pay.wave.com/m/moussa' },
      client: { name: 'Restaurant Le Baobab', phone: '+221 76 123 45 67' },
      items: [
        { id: '1', desc: 'Création logo + charte graphique', qte: 1, prix: 150000 },
        { id: '2', desc: 'Design menu restaurant (recto/verso)', qte: 1, prix: 75000 },
        { id: '3', desc: 'Affiche A3 promotion ouverture', qte: 2, prix: 25000 },
      ],
      total: 275000,
      remise: 0,
      acomptePercent: 50,
      status: 'envoye',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      publicId: 'def456',
      numero: 'DEV-2609-002',
      freelance: { name: 'Moussa Design', phone: '+221 77 456 78 90', logoUrl: '', waveLink: 'https://pay.wave.com/m/moussa' },
      client: { name: 'Boutique Teranga Mode', phone: '+221 78 234 56 78' },
      items: [
        { id: '4', desc: 'Shooting photo collection (10 looks)', qte: 1, prix: 200000 },
        { id: '5', desc: 'Retouche photos (30 images)', qte: 30, prix: 3000 },
        { id: '6', desc: 'Vidéo teaser Instagram Reel', qte: 1, prix: 100000 },
      ],
      total: 390000,
      remise: 10,
      acomptePercent: 50,
      status: 'vu',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      publicId: 'ghi789',
      numero: 'DEV-2609-003',
      freelance: { name: 'Moussa Design', phone: '+221 77 456 78 90', logoUrl: '', waveLink: 'https://pay.wave.com/m/moussa' },
      client: { name: 'TechStart Sénégal', phone: '+221 70 345 67 89' },
      items: [
        { id: '7', desc: 'Identité visuelle complète startup', qte: 1, prix: 300000 },
        { id: '8', desc: 'Maquettes landing page', qte: 1, prix: 150000 },
      ],
      total: 450000,
      remise: 5,
      acomptePercent: 40,
      status: 'accepte',
      createdAt: new Date(Date.now() - 432000000).toISOString(),
      updatedAt: new Date(Date.now() - 259200000).toISOString(),
    },
    {
      publicId: 'jkl012',
      numero: 'DEV-2609-004',
      freelance: { name: 'Moussa Design', phone: '+221 77 456 78 90', logoUrl: '', waveLink: 'https://pay.wave.com/m/moussa' },
      client: { name: 'Coiffure Awa Beauty', phone: '+221 76 456 78 90' },
      items: [
        { id: '9', desc: 'Logo + enseigne lumineuse design', qte: 1, prix: 120000 },
        { id: '10', desc: 'Cartes de visite (lot de 500)', qte: 1, prix: 35000 },
      ],
      total: 155000,
      remise: 0,
      acomptePercent: 50,
      status: 'paye',
      createdAt: new Date(Date.now() - 604800000).toISOString(),
      updatedAt: new Date(Date.now() - 432000000).toISOString(),
    },
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(demoDevis));
}
