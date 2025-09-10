import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Evidence } from '../models/evidence.model';

@Injectable({
  providedIn: 'root'
})
export class EvidenceService {
  private apiUrl = 'http://localhost:3000/api/evidences';
  
  constructor(private http: HttpClient) {}

  getAll(): Observable<Evidence[]> { 
    return this.http.get<Evidence[]>(this.apiUrl);
  }
  
  getById(id: number): Observable<Evidence> {
    return this.http.get<Evidence>(`${this.apiUrl}/${id}`);
  }

  
update(evidence: Evidence): Observable<any> {
  return this.http.put(`${this.apiUrl}/${evidence.id}`, evidence);
}


  // NEW: Create evidence
  create(evidence: Evidence): Observable<any> {
    return this.http.post(this.apiUrl, evidence);
  }
  
delete(id: number): Observable<any> {
  return this.http.delete(`http://localhost:3000/api/evidences/${id}`);
}


  
  upsert(evidence: Evidence): Observable<number> { 
    if (evidence.id) {
      return this.update(evidence).pipe(
        map(() => evidence.id!)
      );
    } else {
      return this.create(evidence).pipe(
        map(response => response.id)
      );
    }
  }

}