import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmailHistory } from '../models/report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private emailUrl = 'http://localhost:3000/api/send-email';
  private historyUrl = 'http://localhost:3000/api/email-history';

  constructor(private http: HttpClient) {}

  // Kirim email
  sendEmail(email: { to: string; subject: string; text?: string; html?: string }): Observable<any> {
    return this.http.post(this.emailUrl, email);
  }

  // Simpan history
  saveEmailHistory(history: EmailHistory): Observable<any> {
    return this.http.post(this.historyUrl, history);
  }

  // Ambil semua history
  getEmailHistory(): Observable<EmailHistory[]> {
    return this.http.get<EmailHistory[]>(this.historyUrl);
  }
}
