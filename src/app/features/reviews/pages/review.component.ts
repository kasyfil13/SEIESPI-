import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <- tambahkan ini
import { ActivatedRoute } from '@angular/router';
import { EvidenceService } from '../../evidence/service/evidence.service';
import { Evidence } from '../../evidence/models/evidence.model';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule], // <- tambahkan FormsModule
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewsComponent {
  evidences: Evidence[] = [];
  evidence?: Evidence;

  selectedMonth: number = new Date().getMonth() + 1;
  months = [
    { value: 1, name: 'Januari' }, { value: 2, name: 'Februari' },
    { value: 3, name: 'Maret' }, { value: 4, name: 'April' },
    { value: 5, name: 'Mei' }, { value: 6, name: 'Juni' },
    { value: 7, name: 'Juli' }, { value: 8, name: 'Agustus' },
    { value: 9, name: 'September' }, { value: 10, name: 'Oktober' },
    { value: 11, name: 'November' }, { value: 12, name: 'Desember' }
  ];

  constructor(private route: ActivatedRoute, private evidenceSvc: EvidenceService) {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        // Detail evidence
        this.evidenceSvc.getById(Number(id)).subscribe(e => {
          this.evidence = e;
          this.evidences = [];
        });
      } else {
        // Semua evidence
        this.evidenceSvc.getAll().subscribe(data => {
          this.evidences = data;
          this.evidence = undefined;
        });
      }
    });
  }

  // Download PDF untuk 1 evidence
  downloadPDF(evidence: Evidence) {
    const pdf = new jsPDF();
    pdf.setFontSize(16);
    pdf.text('Detail Evidence', 10, 10);
    pdf.setFontSize(12);
    let y = 20;

    pdf.text(`ID: ${evidence.id}`, 10, y); y += 6;
    pdf.text(`Temuan: ${evidence.temuan}`, 10, y); y += 6;
    pdf.text(`Rekomendasi: ${evidence.rekomendasi}`, 10, y); y += 6;
    pdf.text(`Status: ${evidence.status}`, 10, y); y += 6;
    pdf.text(`Kriteria: ${evidence.kriteria}`, 10, y); y += 6;
    pdf.text(`Progress: ${evidence.progress}`, 10, y); y += 6;
    pdf.text(`Tanggal: ${new Date(evidence.tanggal).toLocaleDateString()}`, 10, y); y += 10;

    pdf.save(`evidence-${evidence.id}.pdf`);
  }

  // Download PDF untuk semua evidence di bulan tertentu
  downloadPDFPerBulan() {
  const filtered = this.evidences.filter(e => 
    new Date(e.tanggal).getMonth() + 1 === this.selectedMonth
  );

  if (filtered.length === 0) {
    alert('Tidak ada evidence di bulan ini!');
    return;
  }

  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  let y = 15;

  // Judul
  pdf.setFontSize(16);
  pdf.setTextColor(15, 52, 96);
  pdf.text(`Evidence Bulan ${this.months.find(m => m.value === this.selectedMonth)?.name}`, pageWidth / 2, y, { align: 'center' });
  y += 10;

  pdf.setFontSize(12);
  filtered.forEach(e => {
    // Card background
    pdf.setDrawColor(15, 52, 96);
    pdf.setFillColor(240, 240, 240); // abu-abu terang
    pdf.roundedRect(10, y, pageWidth - 20, 50, 3, 3, 'FD'); // x, y, width, height, rx, ry, style Fill+Stroke

    // Isi card
    let textY = y + 7;
    pdf.setTextColor(0, 0, 0);
    pdf.text(`ID: ${e.id}`, 15, textY); textY += 6;
    pdf.text(`Temuan: ${e.temuan}`, 15, textY); textY += 6;
    pdf.text(`Rekomendasi: ${e.rekomendasi}`, 15, textY); textY += 6;
    pdf.text(`Status: ${e.status}`, 15, textY); textY += 6;
    pdf.text(`Kriteria: ${e.kriteria}`, 15, textY); textY += 6;
    pdf.text(`Progress: ${e.progress}`, 15, textY); textY += 6;
    pdf.text(`Tanggal: ${new Date(e.tanggal).toLocaleDateString()}`, 15, textY);

    y += 60; // jarak antar card

    // Halaman baru kalau melebihi
    if (y > 250) {
      pdf.addPage();
      y = 15;
    }
  });

  pdf.save(`evidence_bulan_${this.selectedMonth}.pdf`);
}

}
