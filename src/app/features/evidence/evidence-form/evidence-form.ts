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
      
        <div class="debug-info" style="background: #f0f0f0; padding: 10px; margin-bottom: 10px; border-radius: 4px;">
          <small>Debug: ID = {{ form.get('id')?.value || 'null' }} | Edit Mode: {{ isEdit }}</small>
        </div>

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

        <button type="submit" class="btn-save" [disabled]="form.invalid">
          {{ isEdit ? 'Update' : 'Save' }}
        </button>
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

    .btn-save:hover:not(:disabled) {
      background: #3a9fd6;
    }

    .btn-save:disabled {
      background: #ccc;
      cursor: not-allowed;
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
    // Get ID from route
    const routeId = this.route.snapshot.paramMap.get('id');
    this.id = routeId ? Number(routeId) : 0;
    this.isEdit = this.id > 0;

    console.log('Route ID:', routeId, 'Parsed ID:', this.id, 'Is Edit:', this.isEdit);


    this.initForm();

    // Load data for edit
    if (this.isEdit) {
      this.loadEvidence();
    }
  }

  private initForm() {
    this.form = this.fb.group({
      id: [this.isEdit ? this.id : null], 
      temuan: ['', Validators.required],
      rekomendasi: ['', Validators.required],
      status: ['', Validators.required],
      kriteria: ['', Validators.required],
      progress: ['', Validators.required],
      tanggal: ['', Validators.required],
    });
  }

  private loadEvidence() {
    this.svc.getById(this.id).subscribe({
      next: (evidence) => {
        console.log('Loaded evidence:', evidence);
        
        // Force set the ID to make sure it's there
        const dataWithId = { ...evidence, id: this.id };
        this.form.patchValue(dataWithId);
        
        // Double check after patch
        console.log('Form value after patch:', this.form.value);
      },
      error: (error) => {
        console.error('Error loading evidence:', error);

      }
    });
  }

onSubmit() {
    if (this.form.valid) {
      const formData = this.form.value as Evidence;
      
      console.log('Submitting form data:', formData);
      console.log('Form ID value:', formData.id);

      this.svc.upsert(formData).subscribe({
        next: (result) => {
          console.log('Upsert result:', result);
          this.router.navigate(['/evidence']);
        },
        error: (error) => {
          console.error('Error saving evidence:', error);
        }
      });
    } else {
      this.form.markAllAsTouched();
      console.log('Form is invalid:', this.form.errors);
    }
  }
}