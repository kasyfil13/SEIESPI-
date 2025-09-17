import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { createClient } from '@supabase/supabase-js';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Evidence } from '../models/evidence.model';


const supabaseUrl = 'https://jpfpkshbzggrssbvvpaq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwZnBrc2hiemdncnNzYnZ2cGFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczODI3NjUsImV4cCI6MjA3Mjk1ODc2NX0.RidCt1a5WuTtfx0utUUWuQJFE69fDQiGtSPpDmQZs3U';  // keep your anon key here
const supabase = createClient(supabaseUrl, supabaseKey);

@Injectable({
  providedIn: 'root'
})
export class EvidenceService {
  private table = 'evidence';

  async getAll(): Promise<Evidence[]> {
    const { data, error } = await supabase.from(this.table).select('*');
    if (error) throw error;
    return data || [];
  }

  async getById(id: number): Promise<Evidence | null> {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

   async upsert(evidence: Partial<Evidence>): Promise<number> {
    const { data, error } = await supabase
      .from(this.table)
      .upsert([evidence], { onConflict: 'id' }) // update if id exists
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase upsert error:', error.message);
      throw error;
    }

    return data.id;
  }

async save(evidence: Evidence): Promise<number> {
  let query;

  if (evidence.id) {
    // Update existing record
    query = supabase
      .from(this.table)
      .update({
        temuan: evidence.temuan,
        rekomendasi: evidence.rekomendasi,
        status: evidence.status,
        kriteria: evidence.kriteria,
        progress: evidence.progress,
        tanggal: evidence.tanggal
      })
      .eq('id', evidence.id)
      .select()
      .single();
  } else {
    // Insert new record
    const { id, ...payload } = evidence; // remove id
    query = supabase
      .from(this.table)
      .insert([payload])
      .select()
      .single();
  }

  const { data, error } = await query;
  console.log('Supabase response:', { data, error }); // debug response
  if (error) throw error;

  return data.id;
}


  async delete(id: number): Promise<void> {
    const { error } = await supabase.from(this.table).delete().eq('id', id);
    if (error) throw error;
  }
}

// @Injectable({
//   providedIn: 'root'
// })
// export class EvidenceService {
//   private apiUrl = 'http://localhost:3000/api/evidences';
  
//   constructor(private http: HttpClient) {}

//   getAll(): Observable<Evidence[]> { 
//     return this.http.get<Evidence[]>(this.apiUrl);
//   }
  
//   getById(id: number): Observable<Evidence> {
//     return this.http.get<Evidence>(`${this.apiUrl}/${id}`);
//   }

  
// update(evidence: Evidence): Observable<any> {
//   return this.http.put(`${this.apiUrl}/${evidence.id}`, evidence);
// }


//   // NEW: Create evidence
//   create(evidence: Evidence): Observable<any> {
//     return this.http.post(this.apiUrl, evidence);
//   }
  
// delete(id: number): Observable<any> {
//   return this.http.delete(`http://localhost:3000/api/evidences/${id}`);
// }


  
//   upsert(evidence: Evidence): Observable<number> { 
//     if (evidence.id) {
//       return this.update(evidence).pipe(
//         map(() => evidence.id!)
//       );
//     } else {
//       return this.create(evidence).pipe(
//         map(response => response.id)
//       );
//     }
//   }

// }