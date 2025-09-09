import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EvidenceService } from '../service/evidence.service';
import { Evidence } from '../models/evidence.model';

@Component({
  selector: 'app-evidence-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card">
      <h2 class="card-title">{{ isEdit ? 'Edit Evidence' : 'Tambah Evidence' }}</h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-container">
        <div class="form-group">
          <label for="temuan">Temuan</label>
          <input id="temuan" formControlName="temuan" />
          <small *ngIf="form.get('temuan')?.invalid && form.get('temuan')?.touched" class="error">Wajib diisi</small>
        </div>

        <div class="form-group">
          <label for="rekomendasi">Rekomendasi</label>
          <input id="rekomendasi" formControlName="rekomendasi" />
          <small *ngIf="form.get('rekomendasi')?.invalid && form.get('rekomendasi')?.touched" class="error">Wajib diisi</small>
        </div>

        <div class="form-group">
          <label for="status">Status</label>
          <select id="status" formControlName="status">
            <option value="">-- Pilih Status --</option>
            <option value="Draft">Draft</option>
            <option value="In Review">In Review</option>
            <option value="Signed">Signed</option>
          </select>
          <small *ngIf="form.get('status')?.invalid && form.get('status')?.touched" class="error">Pilih status</small>
        </div>

        <div class="form-group">
          <label for="kriteria">Kriteria</label>
          <input id="kriteria" formControlName="kriteria" />
          <small *ngIf="form.get('kriteria')?.invalid && form.get('kriteria')?.touched" class="error">Wajib diisi</small>
        </div>

        <div class="form-group">
          <label for="progress">Progress</label>
          <select id="progress" formControlName="progress">
            <option value="">-- Pilih Progress --</option>
            <option value="Belum Tindak">Belum Tindak</option>
            <option value="Dalam Proses">Dalam Proses</option>
            <option value="Tercapai">Tercapai</option>
          </select>
          <small *ngIf="form.get('progress')?.invalid && form.get('progress')?.touched" class="error">Pilih progress</small>
        </div>

        <div class="form-group">
          <label for="tanggal">Tanggal</label>
          <input id="tanggal" type="date" formControlName="tanggal" />
          <small *ngIf="form.get('tanggal')?.invalid && form.get('tanggal')?.touched" class="error">Wajib diisi</small>
        </div>


        <button type="submit" class="btn-save">Save</button>
      </form>
    </div>

    
  `,
  styles: [`
    .card {
  max-width: 500px;
  margin: 40px auto;
  padding: 24px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.card-title {
  font-size: 24px; 
  
  margin-bottom: 20px;
  font-weight: 600;
  color: #333;
  text-align: center;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 6px;
  font-weight: 500;
  color: #444;
}

.form-group input,
.form-group select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #4cafef;
  outline: none;
}

.btn-save {
  align-self: flex-end;
  background: #4cafef;
  color: #fff;
  font-weight: 600;
  padding: 10px 18px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-save:hover {
  background: #3a9fd6;
}

.error {
  color: red;
  font-size: 13px;
  margin-top: 4px;
}

  `]
})
export class EvidenceFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  id!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private svc: EvidenceService
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.isEdit = !!this.id;

    const evidence = this.isEdit ? this.svc.getById(this.id) : null;

    this.form = this.fb.group({
      id: [evidence?.id],
      temuan: [evidence?.temuan || '', Validators.required],
      rekomendasi: [evidence?.rekomendasi || '', Validators.required],
      status: [evidence?.status || '', Validators.required],
      kriteria: [evidence?.kriteria || '', Validators.required],
      progress: [evidence?.progress || '', Validators.required],
      tanggal: [evidence?.tanggal || '', Validators.required],
});

  }
/*******  96415995-d103-4a80-b626-0aa4833eb2dd  *******/
  onSubmit() {
    if (this.form.valid) {
      this.svc.upsert(this.form.value as Evidence);
      this.router.navigate(['/evidence']);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
