import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EvidenceService } from '../service/evidence.service';
import { Evidence } from '../models/evidence.model';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-evidence-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="header">
      <h2>Evidence List</h2>
      <a routerLink="new" class="add-btn">+ Add Evidence</a>
    </div>

    <div class="card-container">
      <div *ngFor="let e of evidences" class="card">
        <h3>Temuan: {{ e.temuan }}</h3>
        <p>Progress: {{ e.progress }}</p>
        <button (click)="openModal(e)" class="detail-btn">Lihat Detail</button>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal" *ngIf="selectedEvidence">
      <div class="modal-content">
        <span class="close" (click)="closeModal()">&times;</span>
        <h3>Detail Evidence</h3>
        <p><strong>ID:</strong> {{ selectedEvidence.id }}</p>
        <p><strong>Temuan:</strong> {{ selectedEvidence.temuan }}</p>
        <p><strong>Rekomendasi:</strong> {{ selectedEvidence.rekomendasi }}</p>
        <p><strong>Status:</strong> {{ selectedEvidence.status }}</p>
        <p><strong>Kriteria:</strong> {{ selectedEvidence.kriteria }}</p>
        <p><strong>Progress:</strong> {{ selectedEvidence.progress }}</p>
        <p><strong>Tanggal:</strong> {{ selectedEvidence.tanggal }}</p>
        <div class="card-buttons">
          <button [routerLink]="['/evidence/edit', selectedEvidence.id]" class="edit-btn">Edit</button>
          <button (click)="delete(selectedEvidence.id); closeModal()" class="delete-btn">Delete</button>
          <button (click)="downloadPDF(selectedEvidence)" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Download PDF</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .add-btn {
      text-decoration: none;
      background-color: #1e40af;
      color: white;
      padding: 6px 12px;
      border-radius: 4px;
    }

    .card-container {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
    }

  .card {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 16px;
    width: 250px;
    box-shadow: 2px 2px 6px rgba(0,0,0,0.1);
    background-color: #000; 
    color: #fff; 
  }


    .card h3 { margin: 0 0 8px 0; }
    .card p { margin: 4px 0; }

    .detail-btn {
      background-color: #3b82f6;
      border: none;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 8px;
    }

    .detail-btn:hover { background-color: #1d4ed8; }

    .modal {
      display: flex;
      position: fixed;
      z-index: 1000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgba(0,0,0,0.5);
      justify-content: center;
      align-items: center;
    }

    .modal-content {
      background-color: #fff; 
      color: #000;
      padding: 20px;
      border-radius: 8px;
      width: 400px;
      max-width: 90%;
      position: relative;
    }

    .close {
      position: absolute;
      right: 10px;
      top: 10px;
      font-size: 24px;
      font-weight: bold;
      cursor: pointer;
    }

    .card-buttons {
      margin-top: 10px;
      display: flex;
      gap: 8px;
    }

    .edit-btn {
      background-color: #22c55e;
      border: none;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      cursor: pointer;
    }

    .edit-btn:hover { background-color: #16a34a; }

    .delete-btn {
      background-color: #ef4444;
      border: none;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      cursor: pointer;
    }

    .delete-btn:hover { background-color: #b91c1c; }
  `]
})
export class EvidenceListComponent {
  evidences: Evidence[] = [];
  selectedEvidence: Evidence | null = null;

  constructor(private svc: EvidenceService) { 
    this.evidences = this.svc.getAll(); 
  }

  openModal(e: Evidence) {
    this.selectedEvidence = e;
  }

  closeModal() {
    this.selectedEvidence = null;
  }

  delete(id: number) {
    this.svc.delete(id);
    this.evidences = this.svc.getAll();
    if (this.selectedEvidence?.id === id) {
      this.closeModal();
    }
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
