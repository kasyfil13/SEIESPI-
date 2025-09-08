export interface Evidence {
  id: number;
  temuan: string;
  rekomendasi: string;
  status: 'Draft' | 'In Review' | 'Signed';
  kriteria: string;
  progress: 'Belum Tindak' | 'Dalam Proses' | 'Tercapai';
  tanggal : string ;
}
