import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evidence, Temuan } from '../models/evidence.model';

@Injectable({
  providedIn: 'root'
})
export class EvidenceService {
  private apiUrl = 'http://localhost:3000/api/evidence'; 
  private temuanUrl = 'http://localhost:3000/api/temuan';

  constructor(private http: HttpClient) {}
  getAll(): Observable<Evidence[]> {
    return this.http.get<Evidence[]>(this.apiUrl);
  }
  addEvidence(data: Evidence): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
  updateEvidence(id: number, data: Evidence): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }
  getTemuanList(): Observable<Temuan[]> {
    return this.http.get<Temuan[]>(this.temuanUrl);
  }
}
