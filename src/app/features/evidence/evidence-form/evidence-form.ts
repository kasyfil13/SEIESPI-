// src/app/features/evidence/evidence-form/evidence-form.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EvidenceService } from '../service/evidence.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-evidence-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './evidence-form.html',
  styleUrls: ['./evidence-form.scss']
})
export class EvidenceFormComponent {
  form: FormGroup;
  isEdit = false;
  id?: number;

  constructor(
    private fb: FormBuilder,
    private svc: EvidenceService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      id: [null],  // 👈 left here but Supabase auto-generates if null
      temuan: ['', Validators.required],
      rekomendasi: ['', Validators.required],
      status: ['Draft', Validators.required],
      kriteria: ['', Validators.required],
      progress: ['Belum Tindak', Validators.required],
      tanggal: [new Date().toISOString().split('T')[0]]
    });
  }

  async ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.isEdit = true;
      try {
        const evidence = await this.svc.getById(this.id);
        if (evidence) {
          this.form.patchValue(evidence);
        }
      } catch (err) {
        console.error('❌ Failed to load evidence:', err);
      }
    }
  }

  async save() {
    if (this.form.invalid) {
      alert('Form is invalid!');
      return;
    }

    try {
      const formData = { ...this.form.value };

      // Ensure id is null for new inserts (so Supabase auto-generates)
      if (!this.isEdit) {
        delete formData.id;
      }

      const id = await this.svc.upsert(formData);
      console.log('✅ Evidence saved, ID:', id);

      this.router.navigate(['/evidence']);
    } catch (err) {
      console.error('❌ Failed to save evidence:', err);
      alert('Failed to save evidence');
    }
  }

  cancel() {
    this.router.navigate(['/evidence']);
  }
}
