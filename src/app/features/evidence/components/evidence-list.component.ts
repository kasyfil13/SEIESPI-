import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EvidenceService } from '../service/evidence.service';
import { Evidence } from '../models/evidence.model';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-evidence-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <div class="header">
        <h2 class="title">Evidence Management</h2>
        <a routerLink="new" class="add-btn">+ Add Evidence</a>
      </div>

      <div class="card-container">
        <div *ngFor="let e of evidences" class="card">
          <div class="card-body">
            <h3 class="card-title">{{ e.temuan }}</h3>
            <h4 class="progress">Progress : </h4>
            <span class="status-badge" [ngClass]="getStatusClass(e.progress)">
              {{ getStatusText(e.progress) }}
            </span>
          </div>
          <div class="card-footer">
            <button (click)="openModal(e)" class="btn-detail">View Details</button>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <div class="modal-overlay" *ngIf="selectedEvidence" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Evidence Details</h3>
            <button class="close-btn" (click)="closeModal()">&times;</button>
          </div>
          <div class="modal-body">
            <div class="detail-grid">
              <div class="detail-item"><label>ID : </label><span>{{ selectedEvidence.id }}</span></div>
              <div class="detail-item"><label>Temuan : </label><span>{{ selectedEvidence.temuan }}</span></div>
              <div class="detail-item"><label>Rekomendasi : </label><span>{{ selectedEvidence.rekomendasi }}</span></div>
              <div class="detail-item"><label>Kriteria : </label><span>{{ selectedEvidence.kriteria }}</span></div>
              <div class="detail-item"><label>Progress : </label><span>{{ selectedEvidence.progress }}</span></div>
              <div class="detail-item"><label>Tanggal : </label><span>{{ selectedEvidence.tanggal }}</span></div>
            </div>
          </div>
          <div class="modal-footer">
            <button [routerLink]="['/evidence/edit', selectedEvidence.id]" class="btn btn-edit">Edit</button>
            <button (click)="downloadPDF(selectedEvidence)" class="btn btn-download">Download PDF</button>
            <button (click)="delete(selectedEvidence.id); closeModal()" class="btn btn-delete">Delete</button>
          </div>
        </div>
      </div>
  `,
  styles: [`
    * { box-sizing: border-box; margin:0; padding:0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    .container { max-width: 1200px; margin: 2rem auto; padding: 0 1rem; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .title { font-size: 2rem; font-weight: 700; color: #fff; }
    .add-btn { background-color: #2563eb; color: #fff; padding: 0.5rem 1rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600; transition: all 0.2s ease; }
    .add-btn:hover { background-color: #1d4ed8; }

    .card-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; }
    .card { background-color: #0f1e17; border-radius: 0.75rem; border: 3px solid; box-shadow: 0 4px 10px rgba(0,0,0,0.05); display: flex; flex-direction: column; justify-content: space-between; transition: transform 0.2s; }
    .card:hover { transform: translateY(-5px); }

    .card-body { padding: 1rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
    .card-title { font-size: 25px; font-weight: 700; color: #fff; margin-bottom: 25px; }
    .progress-text { font-size: 0.875rem; color: #fff; }

    .card-footer { padding: 0.75rem 1rem 1rem; }
    .btn-detail { width: 100%; padding: 0.5rem; border: none; border-radius: 0.5rem; background-color: #22c55e; color: #fff; font-weight: 600; cursor: pointer; transition: background 0.2s; }
    .btn-detail:hover { background-color: #2563eb; }

    /* Modal */
    .modal-overlay { position: fixed; inset:0; background-color: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal { background-color: #fff; border-radius: 1rem; width: 100%; max-width: 600px; display: flex; flex-direction: column; max-height: 90vh; overflow-y: auto; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; }
    .modal-header h3 { font-size: 1.875rem; color: #1f2937; }
    .close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #6b7280; }
    .modal-body { padding: 1rem 1.5rem; }
    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
    .detail-item label { font-size: 0.75rem; font-weight: 600; color: #6b7280; }
    .detail-item span { font-size: 0.875rem; color: #111827; font-weight: 500; }
    .modal-footer { display: flex; justify-content: flex-end; gap: 0.5rem; padding: 1rem 1.5rem; border-top: 1px solid #e5e7eb; }

    .btn { padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; cursor: pointer; border: none; }
    .btn-edit { background-color: #22c55e; color: #fff; }
    .btn-edit:hover { background-color: #16a34a; }
    .btn-download { background-color: #3b82f6; color: #fff; }
    .btn-download:hover { background-color: #2563eb; }
    .btn-delete { background-color: #ef4444; color: #fff; }
    .btn-delete:hover { background-color: #dc2626; }

    .status-badge { 
      padding: 5px 10px; 
      border-radius: 9999px; 
      font-size: 13px; 
      font-weight: 600; 
      color: #fff; 
      margin-bottom: 5px; 
    }
    .status-not-started { background-color: #ef4444; }
    .status-in-progress { background-color: #f59e0b; }
    .status-completed { background-color: #22c55e; }
  `]
})
export class EvidenceListComponent {
  evidences: Evidence[] = [];
  selectedEvidence: Evidence | null = null;

  constructor(private svc: EvidenceService) {
    this.evidences = this.svc.getAll();
  }

  openModal(e: Evidence) { this.selectedEvidence = e; }
  closeModal() { this.selectedEvidence = null; }

  getStatusClass(progress: string): string {
    if (progress === 'Belum Tindak' || progress === 'Not Started') return 'status-not-started';
    if (progress === 'Dalam Proses' || progress === 'In Progress') return 'status-in-progress';
    if (progress === 'Tercapai' || progress === 'Completed' || progress === 'Selesai') return 'status-completed';
    return 'status-not-started';
  }

  getStatusText(progress: string): string {
    if (progress === 'Belum Tindak' || progress === 'Not Started') return 'Belum Mulai';
    if (progress === 'Dalam Proses' || progress === 'In Progress') return 'In Progress';
    if (progress === 'Tercapai' || progress === 'Completed' || progress === 'Selesai') return 'Selesai';
    return 'Belum Mulai';
  }

  delete(id: number) {
    this.svc.delete(id);
    this.evidences = this.svc.getAll();
    if (this.selectedEvidence?.id === id) this.closeModal();
  }

  downloadPDF(evidence: Evidence) {
    const pdf = new jsPDF();
    pdf.setFontSize(16);
    pdf.text('Detail Evidence', 10, 10);
    pdf.setFontSize(12);
    pdf.text(`ID: ${evidence.id}`, 10, 20);
    pdf.text(`Temuan: ${evidence.temuan}`, 10, 30);
    pdf.text(`Rekomendasi: ${evidence.rekomendasi}`, 10, 40);
    pdf.text(`Status: ${evidence.status}`, 10, 50);
    pdf.text(`Kriteria: ${evidence.kriteria}`, 10, 60);
    pdf.text(`Progress: ${evidence.progress}`, 10, 70);
    pdf.text(`Tanggal: ${evidence.tanggal}`, 10, 80);
    pdf.save(`evidence-${evidence.id}.pdf`);
  }
}
