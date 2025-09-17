// src/app/features/evidence/pages/evidence.page.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EvidenceService } from '../service/evidence.service';
import { Evidence } from '../models/evidence.model';

@Component({
  selector: 'app-evidence-page',
  templateUrl: './evidence.page.component.html',
  styleUrls: ['./evidence.page.component.scss']
})
export class EvidencePageComponent {
  showModal = false;
  private selectedEvidence: Evidence | null = null;

  constructor(
    private evidenceService: EvidenceService,
    private router: Router
  ) {}

  openModal(evidence: Evidence) {
    this.selectedEvidence = evidence;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedEvidence = null;
  }

  // ✅ Provide safe defaults that match the Evidence type
  evidenceDetails(): Evidence {
    return this.selectedEvidence || {
      id: 0,
      temuan: '',
      rekomendasi: '',
      status: 'Draft',      // 👈 must be one of: "Draft" | "In Review" | "Signed"
      kriteria: '',
      progress: 'Belum Tindak', // 👈 replace with one of your allowed progress values
      tanggal: new Date().toISOString().split('T')[0]
    };
  }

  onEdit() {
    if (!this.selectedEvidence) return;
    this.closeModal();
    this.router.navigate(['/evidence', 'edit', this.selectedEvidence.id]);
  }

  async onDelete() {
    if (!this.selectedEvidence) return;

    if (confirm('Are you sure you want to delete this evidence?')) {
      await this.evidenceService.delete(this.selectedEvidence.id);
      this.closeModal();
      window.location.reload();
    }
  }

  onDetail() {
    if (!this.selectedEvidence) return;
    alert(JSON.stringify(this.selectedEvidence, null, 2));
  }
}
