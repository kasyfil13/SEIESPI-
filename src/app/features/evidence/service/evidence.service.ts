import { Injectable } from '@angular/core';
import { Evidence } from '../models/evidence.model';

@Injectable({
  providedIn: 'root'
})
export class EvidenceService {
  private evidences: Evidence[] = [
    { id: 1, temuan: 'Tidak ada dokumen autentik', rekomendasi: 'Menggunakan tanda tangan digital', status: 'Draft', kriteria: 'Kepatuhan', progress: 'Belum Tindak', tanggal: '08-09-2025' },
    { id: 2, temuan: 'Dokumentasi SOP tidak lengkap', rekomendasi: 'Melengkapi dokumentasi SOP', status: 'In Review', kriteria: 'Efisiensi', progress: 'Dalam Proses', tanggal: '08-09-2025' },
    { id: 3, temuan: 'Serah terima tugas tidak terekam', rekomendasi: 'Membuat log serah terima', status: 'Signed', kriteria: 'Keakuratan', progress: 'Tercapai', tanggal: '08-09-2025' }
  ];

  
  getAll(): Evidence[] { return this.evidences; }
  getById(id: number): Evidence | undefined { return this.evidences.find(e => e.id === id); }
  add(evidence: Evidence): number {
    const newId = this.evidences.length ? Math.max(...this.evidences.map(e => e.id)) + 1 : 1;
    this.evidences.push({ ...evidence, id: newId });
    return newId;
  }
  update(id: number, updated: Evidence): void {
    const index = this.evidences.findIndex(e => e.id === id);
    if (index !== -1) this.evidences[index] = { ...updated, id };
  }
  delete(id: number): void { this.evidences = this.evidences.filter(e => e.id !== id); }
  upsert(evidence: Evidence): number {
    if (evidence.id) { this.update(evidence.id, evidence); return evidence.id; }
    else return this.add(evidence);
  }
}
