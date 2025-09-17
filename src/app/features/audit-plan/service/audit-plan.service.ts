import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Audit } from '../models/audit.model'; // konsisten pakai Audit

@Injectable({
  providedIn: 'root'
})
export class AuditPlanService {
  private apiUrl = 'http://localhost:3000/api/audit'; // endpoint sesuai tabel

  constructor(private http: HttpClient) {}

  getAll(): Observable<Audit[]> { 
    return this.http.get<Audit[]>(this.apiUrl);
  }

  getById(id: number): Observable<Audit> {
    return this.http.get<Audit>(`${this.apiUrl}/${id}`);
  }

  update(audit: Audit): Observable<any> {
    return this.http.put(`${this.apiUrl}/${audit.id}`, audit);
  }

  create(audit: Audit): Observable<any> {
    return this.http.post(this.apiUrl, audit);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  upsert(audit: Audit): Observable<number> { 
    if (audit.id) {
      return this.update(audit).pipe(
        map(() => audit.id!)
      );
    } else {
      return this.create(audit).pipe(
        map((response: any) => response.id)
      );
    }
  }
}
