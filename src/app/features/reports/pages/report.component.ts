import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EvidenceService } from '../../evidence/service/evidence.service';  
import { Evidence } from '../../evidence/models/evidence.model';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule], // <- tambahkan HttpClientModule
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportsComponent {
  email = {
    to: '',
    evidenceId: '',
    message: ''
  };

  evidences: Evidence[] = [];
  selectedEvidence: Evidence | null = null;

  constructor(private evidenceService: EvidenceService, private http: HttpClient) {
    this.loadEvidences();
  }

<<<<<<< Updated upstream
  downloadReport(report: Report) {
    console.log(`Downloading: ${report.name}`);
    alert(`Downloading ${report.name}`);
  }
=======
  loadEvidences() {
    this.evidenceService.getAll().subscribe(data => {
      this.evidences = data;
    });
  }

  onEvidenceSelect() {
    if (this.email.evidenceId) {
      this.selectedEvidence = this.evidences.find(e => e.id.toString() === this.email.evidenceId) || null;
    } else {
      this.selectedEvidence = null;
    }
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

      <!-- Footer -->
      <div style="background:#f4f4f4;color:#777;padding:12px;text-align:center;font-size:12px;">
        Sistem Evidence Report © ${new Date().getFullYear()}
      </div>
    </div>
    `
    };


    this.http.post('http://localhost:3000/api/send-email', emailData).subscribe({
      next: res => {
        console.log('Email sukses dikirim:', res);
        alert(`Email sukses dikirim ke: ${this.email.to}`);
        this.resetForm();
      },
      error: err => {
        console.error('Gagal kirim email:', err);
        alert('Gagal mengirim email. Cek backend console.');
      }
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
>>>>>>> Stashed changes
}
