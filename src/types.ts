export interface DevisItem {
  id: string;
  desc: string;
  qte: number;
  prix: number;
}

export interface Devis {
  publicId: string;
  numero: string;
  freelance: {
    name: string;
    phone: string;
    logoUrl: string;
    waveLink: string;
  };
  client: {
    name: string;
    phone: string;
  };
  items: DevisItem[];
  total: number;
  remise: number;
  acomptePercent: number;
  status: "envoye" | "vu" | "accepte" | "paye";
  createdAt: string;
  updatedAt: string;
}

export type DevisStatus = Devis["status"];
