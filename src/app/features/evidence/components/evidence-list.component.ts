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
<a routerLink="new" class="bg-blue-600 text-white px-3 py-1 rounded">+ Add Evidence</a>
      </div>

      <!-- Filter Buttons -->
      <div class="filter-bar">
        <button (click)="setFilter('')" [class.active]="selectedFilter === ''">Semua</button>
        <button (click)="setFilter('Belum Tindak')" [class.active]="selectedFilter === 'Belum Tindak'">Belum Tindak</button>
        <button (click)="setFilter('Dalam Proses')" [class.active]="selectedFilter === 'Dalam Proses'">Dalam Proses</button>
        <button (click)="setFilter('Tercapai')" [class.active]="selectedFilter === 'Tercapai'">Tercapai</button>
      </div>

      <!-- Table Container -->
      <div class="table-container">
        <table class="evidence-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Temuan</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Tanggal</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let e of filteredEvidences" class="table-row">
              <td>{{ filteredEvidences.indexOf(e) + 1 }}</td>
              <td class="temuan-cell">{{ e.temuan }}</td>
              <td>{{ e.status }}</td>
              <td>
                <span class="status-progress" [ngClass]="getStatusClass(e.progress)">
                  {{ getStatusText(e.progress) }}
                </span>
              </td>
              <td>{{ e.tanggal | date:'dd-MM-yyyy' }}</td>
              <td>
                <button (click)="openModal(e)" class="btn-detail">View Details</button>
              </td>
            </tr>
          </tbody>
        </table>
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
              <div class="detail-item"><label>Temuan : </label><br><span>{{ selectedEvidence.temuan }}</span></div>
              <div class="detail-item"><label>Rekomendasi : </label><br><span>{{ selectedEvidence.rekomendasi }}</span></div>
              <div class="detail-item"><label>Status : </label><br><span>{{ selectedEvidence.status }}</span></div>
              <div class="detail-item"><label>Kriteria : </label><br><span>{{ selectedEvidence.kriteria }}</span></div>
              <div class="detail-item"><label>Progress : </label><br><span>{{ selectedEvidence.progress }}</span></div>
              <div class="detail-item"><label>Tanggal : </label><br><span>{{ selectedEvidence.tanggal | date:'dd-MM-yyyy' }}</span></div>
            </div>
          </div>
          <div class="modal-footer">
            <button [routerLink]="['/evidence/edit', selectedEvidence.id]" class="btn btn-edit">Edit</button>
            <button (click)="downloadPDF(selectedEvidence)" class="btn btn-download">Download PDF</button>
            <button (click)="delete(selectedEvidence.id); closeModal()" class="btn btn-delete">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `,
styles: [`
    * { box-sizing: border-box; margin:0; padding:0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    .container { max-width: 1200px; margin: 32px auto; padding: 0 16px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
    .title { font-size: 32px; font-weight: 700; color: #fff; }
    .add-btn { background-color: #22c55e; color: #fff; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-weight: 600; transition: all 0.2s ease; }
    .add-btn:hover { background-color: #1d4ed8; }

    .table-container {
      background-color: #0f1e17;
      border-radius: 12px;
      border: 3px solid #22c55e;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    }
    
    .evidence-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .evidence-table thead {
      background-color: #22c55e;
    }
    
    .evidence-table th {
      padding: 16px 12px;
      text-align: left;
      font-weight: 700;
      color: #fff;
      font-size: 16px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .evidence-table tbody tr {
      border-bottom: 1px solid #2d4a35;
      transition: background-color 0.2s ease;
    }
    
    .evidence-table tbody tr:hover {
      background-color: #1a2f1f;
    }
    
    .evidence-table td {
      padding: 16px 12px;
      color: #fff;
      font-size: 16px;
    }
    
    .temuan-cell {
      max-width: 300px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .btn-detail { 
      padding: 6px 12px; 
      border: none; 
      border-radius: 6px; 
      background-color: #22c55e; 
      color: #fff; 
      font-weight: 600; 
      cursor: pointer; 
      transition: background 0.2s;
      font-size: 12px;
    }
    .btn-detail:hover { background-color: #2563eb; }

    .modal-overlay { position: fixed; inset:0; background-color: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal { background-color: #fff; border-radius: 16px; width: 100%; max-width: 600px; display: flex; flex-direction: column; max-height: 90vh; overflow-y: auto; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 18px 24px; margin-top: 10px }
    .modal-header h3 { font-size: 33px; color: #1f2937; text-align: center; }
    .close-btn { background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280; }
    .modal-body { padding: 16px 24px; }
    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .detail-item label { font-size: 16px; font-weight: 600; color: #6b7280; }
    .detail-item span { font-size: 17px; color: #111827; font-weight: 500; }
    .modal-footer { display: flex; justify-content: flex-end; gap: 8px; padding: 16px 24px; border-top: 1px solid #e5e7eb; }

    .btn { padding: 8px 16px; border-radius: 8px; font-weight: 600; font-size: 16px; cursor: pointer; border: none; }
    .btn-edit { background-color: #22c55e; color: #fff; }
    .btn-edit:hover { background-color: #16a34a; }
    .btn-download { background-color: #3b82f6; color: #fff; }
    .btn-download:hover { background-color: #2563eb; }
    .btn-delete { background-color: #ef4444; color: #fff; }
    .btn-delete:hover { background-color: #dc2626; }

    .status-progress{ 
      padding: 4px 8px; 
      border-radius: 20px; 
      font-size: 12px; 
      font-weight: 600; 
      color: #fff; 
      text-align: center;
      display: inline-block;
    }
    .status-not-started { background-color: #ef4444; }
    .status-in-progress { background-color: #f59e0b; }
    .status-completed { background-color: #22c55e; }

    .filter-bar {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
    }
    .filter-bar button {
      padding: 6px 12px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      background: #374151;
      color: white;
      font-weight: 500;
      transition: background 0.2s;
    }
    .filter-bar button:hover {
      background: #2563eb;
    }
    .filter-bar button.active {
      background: #22c55e;
    }

    @media (max-width: 768px) {
      .table-container {
        overflow-x: auto;
      }
      
      .evidence-table {
        min-width: 800px;
      }
      
      .evidence-table th,
      .evidence-table td {
        padding: 12px 8px;
        font-size: 12px;
      }
    }
  `]

})

export class EvidenceListComponent {
  evidences: Evidence[] = [];
  filteredEvidences: Evidence[] = [];
  selectedFilter: string = '';
  selectedEvidence: Evidence | null = null;

constructor(private svc: EvidenceService) {
  this.svc.getAll().subscribe(data => {
    // urutkan berdasarkan id ascending
    this.evidences = data.sort((a, b) => a.id - b.id);
    this.filteredEvidences = [...this.evidences];
  });
}

  setFilter(progress: string) {
    this.selectedFilter = progress;
    if (progress) {
      this.filteredEvidences = this.evidences.filter(e => e.progress === progress);
    } else {
      this.filteredEvidences = [...this.evidences];
    }
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
  this.svc.delete(id).subscribe(() => {
    this.svc.getAll().subscribe(data => {
      this.evidences = data;
      this.setFilter(this.selectedFilter);
    });
    if (this.selectedEvidence?.id === id) this.closeModal();
  });
}

downloadPDF(evidence: Evidence) {
  const pdf = new jsPDF();

  //headernya
  pdf.setFillColor(41, 128, 185); 
  pdf.rect(10, 10, 190, 12, 'F'); 
  pdf.setTextColor(255, 255, 255); 
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Detail Evidence', 12, 19);

  //isinya
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  let y = 30; 
  const lineSpacing = 10;

  const addField = (label: string, value: any) => {
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${label}:`, 10, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${value}`, 50, y);
    y += lineSpacing;
  };

  addField('ID', evidence.id);
  addField('Temuan', evidence.temuan);
  addField('Rekomendasi', evidence.rekomendasi);
  addField('Status', evidence.status);
  addField('Kriteria', evidence.kriteria);
  addField('Progress', evidence.progress);
  addField('Tanggal', evidence.tanggal);
  pdf.setLineWidth(0.5);
  pdf.line(10, y, 200, y);

  pdf.save(`evidence-${evidence.id}.pdf`);
}
}