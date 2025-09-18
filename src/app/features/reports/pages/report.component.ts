import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { EvidenceService } from '../../evidence/service/evidence.service';  
import { Evidence } from '../../evidence/models/evidence.model';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportsComponent implements OnInit {
  email = { to: '', evidenceId: '', message: '' };
  evidences: Evidence[] = [];
  selectedEvidence: Evidence | null = null;

  emailHistories: any[] = []; // history table
  modalEvidence: Evidence | null = null;
  modalOpen = false;

  constructor(private evidenceService: EvidenceService, private http: HttpClient) {}

  ngOnInit() {
    this.loadEvidences();
    this.loadHistory();
  }

  loadEvidences() {
    this.evidenceService.getAll().subscribe(data => {
      this.evidences = data;
    });
  }

  onEvidenceSelect() {
    if (this.email.evidenceId) {
      this.selectedEvidence = this.evidences.find(
        e => e.id.toString() === this.email.evidenceId
      ) || null;
    } else {
      this.selectedEvidence = null;
    }
  }

  openEvidenceModal(evidenceId: string | number) {
    // convert evidenceId ke number kalau perlu
    const id = typeof evidenceId === 'string' ? parseInt(evidenceId) : evidenceId;
    this.modalEvidence = this.evidences.find(e => e.id === id) || null;
    this.modalOpen = true;
  }


  closeModal() {
    this.modalOpen = false;
    this.modalEvidence = null;
  }

  sendEmail() {
    if (!this.email.to || !this.selectedEvidence) {
      alert('Isi email tujuan dan pilih evidence!');
      return;
    }

    const emailData = {
      to: this.email.to,
      subject: `Evidence Report - ID: ${this.selectedEvidence.id} - ${this.selectedEvidence.temuan.slice(0,30)}...`,
      html: `
      <div style="max-width:600px;margin:auto;font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#333;border:1px solid #ddd;border-radius:8px;overflow:hidden;">
        
        <div style="background:#2c3e50;color:#fff;padding:16px;text-align:center;">
          <h1 style="margin:0;font-size:20px;">📑 Evidence Report</h1>
        </div>

        <div style="padding:20px;">
          <h2 style="color:#2c3e50;font-size:18px;margin-top:0;">Detail Evidence</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:8px;border-bottom:1px solid #eee;"><strong>Temuan</strong></td>
              <td style="padding:8px;border-bottom:1px solid #eee;">${this.selectedEvidence.temuan}</td>
            </tr>
            <tr>
              <td style="padding:8px;border-bottom:1px solid #eee;"><strong>Rekomendasi</strong></td>
              <td style="padding:8px;border-bottom:1px solid #eee;">${this.selectedEvidence.rekomendasi}</td>
            </tr>
            <tr>
              <td style="padding:8px;border-bottom:1px solid #eee;"><strong>Status</strong></td>
              <td style="padding:8px;border-bottom:1px solid #eee;">${this.selectedEvidence.status}</td>
            </tr>
            <tr>
              <td style="padding:8px;border-bottom:1px solid #eee;"><strong>Kriteria</strong></td>
              <td style="padding:8px;border-bottom:1px solid #eee;">${this.selectedEvidence.kriteria}</td>
            </tr>
            <tr>
              <td style="padding:8px;border-bottom:1px solid #eee;"><strong>Progress</strong></td>
              <td style="padding:8px;border-bottom:1px solid #eee;">${this.selectedEvidence.progress}</td>
            </tr>
            <tr>
              <td style="padding:8px;"><strong>Tanggal</strong></td>
              <td style="padding:8px;">${this.formatDate(this.selectedEvidence.tanggal)}</td>
            </tr>
          </table>

          <div style="margin:20px 0;">
            <p style="margin:0 0 8px 0;"><strong>Pesan dari Pengirim:</strong></p>
            <div style="background:#f9f9f9;padding:12px;border-radius:6px;border:1px solid #eee;">
              ${this.email.message}
            </div>
          </div>
        </div>

        <div style="background:#f4f4f4;color:#777;padding:12px;text-align:center;font-size:12px;">
          Sistem Evidence Report © ${new Date().getFullYear()}
        </div>
      </div>
      `
    };

    this.http.post('http://localhost:3000/api/send-email', emailData).subscribe({
      next: () => {
        alert(`Email sukses dikirim ke: ${this.email.to}`);
        this.saveHistory('SUCCESS');
        this.resetForm();
      },
      error: () => {
        alert('Gagal mengirim email. Cek backend console.');
        this.saveHistory('FAILED');
      }
    });
  }

  saveHistory(status: string) {
    const history = {
      ...this.email,
      evidenceId: this.selectedEvidence?.id,
      status,
      sentAt: new Date()
    };

    this.http.post('http://localhost:3000/api/email-history', history)
      .subscribe(() => this.loadHistory());
  }

  loadHistory() {
    this.http.get<any[]>('http://localhost:3000/api/email-history')
      .subscribe(data => {
        this.emailHistories = data;
      });
  }

  resetForm() {
    this.email = { to: '', evidenceId: '', message: '' };
    this.selectedEvidence = null;
  }

  formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('id-ID');
  }
}
