//status evidence
export type EvidenceStatus = 'Selesai' | 'Belum Selesai';

// kriteria rekomendasi
export type Kriteria =
  | 'Prosedur'
  | 'Dokumen'
  | 'Evaluasi ERP'
  | 'Need extra support'
  | 'Tambahan Personil'
  | 'Penyusunan PKPT'
  | 'Pelatihan / Sertifikasi SPI'
  | 'Share drive / Server Proyek'
  | 'RO / RK'
  | 'SKEP'
  | 'Manrisk'
  | 'Sanksi'
  | 'Revisi SIK'
  | 'Tanda Tangan';

// model temuan
export interface Temuan {
  id: number;
  temuan: string | null;
}

// model rekomendasi
export interface Rekomendasi {
  id: number;
  deskripsi: string;
  kriteria: Kriteria;
  temuan: Temuan; 
}

// model evidence
export interface Evidence {
  id: number;
  evidence_name: string;
  status_saat_ini: EvidenceStatus;
  progress_bulan_ini: string;
  rekomendasi: Rekomendasi;
}
