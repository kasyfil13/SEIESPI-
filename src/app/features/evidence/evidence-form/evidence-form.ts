// src/app/features/evidence/pages/evidence-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EvidenceService } from '../service/evidence.service';
import { Evidence } from '../models/evidence.model';

@Component({
  selector: 'app-evidence-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2 class="text-2xl mb-4">{{ isEdit ? 'Edit' : 'New' }} Evidence</h2>

    <form [formGroup]="form" (ngSubmit)="save()" class="space-y-4">
      <div>
        <label class="block font-medium">Temuan</label>
        <input formControlName="temuan" class="border p-2 w-full" />
      </div>

      <div>
        <label class="block font-medium">Rekomendasi</label>
        <textarea formControlName="rekomendasi" class="border p-2 w-full"></textarea>
      </div>

      <div>
        <label class="block font-medium">Status</label>
        <input formControlName="status" class="border p-2 w-full" />
      </div>

      <div>
        <label class="block font-medium">Kriteria</label>
        <input formControlName="kriteria" class="border p-2 w-full" />
      </div>

      <div>
        <label class="block font-medium">Progress</label>
        <input formControlName="progress" class="border p-2 w-full" />
      </div>

      <div>
        <label class="block font-medium">Tanggal</label>
        <input type="date" formControlName="tanggal" class="border p-2 w-full" />
      </div>

      <button type="submit" class="bg-green-600 text-white px-3 py-1 rounded">Save</button>
    </form>
  `
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
<<<<<<< Updated upstream
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.isEdit = !!this.id;
=======
    const routeId = this.route.snapshot.paramMap.get('id');
    this.id = routeId ? Number(routeId) : 0;
    this.isEdit = this.id > 0;
>>>>>>> Stashed changes

    const evidence = this.isEdit ? this.svc.getById(this.id) : null;

<<<<<<< Updated upstream
=======

    this.initForm();

    if (this.isEdit) {
      this.loadEvidence();
    }
  }

  private initForm() {
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
  save() {
    if (this.form.valid) {
      this.svc.upsert(this.form.value as Evidence);
      this.router.navigate(['/evidence']);
=======
  private loadEvidence() {
    this.svc.getById(this.id).subscribe({
      next: (evidence) => {
        console.log('Loaded evidence:', evidence);
        
        const dataWithId = { ...evidence, id: this.id };
        this.form.patchValue(dataWithId);
        
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
>>>>>>> Stashed changes
    }
  }
}
