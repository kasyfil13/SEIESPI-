import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EvidenceService } from '../../evidence/service/evidence.service';
import { Evidence } from '../../evidence/models/evidence.model';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewsComponent {
  evidences: Evidence[] = [];
  evidence?: Evidence;

constructor(private route: ActivatedRoute, private evidenceSvc: EvidenceService) {
  this.route.paramMap.subscribe(params => {
    const id = params.get('id');
    if (id) {
      // kalau ada id → tampilkan detail
      this.evidenceSvc.getById(Number(id)).subscribe(e => {
        this.evidence = e;
        this.evidences = [];
      });
    } else {
      this.evidenceSvc.getAll().subscribe(data => {
        this.evidences = data;
        this.evidence = undefined;
      });
    }
  });
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
