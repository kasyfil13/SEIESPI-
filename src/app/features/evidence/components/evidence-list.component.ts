// src/app/features/evidence/pages/evidence-list.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EvidenceService } from '../service/evidence.service';
import { Evidence } from '../models/evidence.model';

@Component({
  selector: 'app-evidence-list',
  imports: [CommonModule, RouterModule],
  template: `
    <h2 class="text-2xl mb-4">Evidence List</h2>
    <a routerLink="new" class="bg-blue-600 text-white px-3 py-1 rounded">+ Add Evidence</a>

    <div *ngFor="let e of evidences" class="bg-white p-4 mt-4 rounded shadow">
      <h3 class="font-bold">{{ e.temuan }}</h3>
      <p><strong>Rekomendasi:</strong> {{ e.rekomendasi }}</p>
      <p><strong>Status:</strong> {{ e.status }}</p>
      <p><strong>Kriteria:</strong> {{ e.kriteria }}</p>
      <p><strong>Progress:</strong> {{ e.progress }}</p>
      <p class="text-sm text-gray-500">{{ e.tanggal }}</p>
      <div class="mt-2">
        <a [routerLink]="['/evidence/edit', e.id]" class="bg-yellow-500 text-white px-2 py-1 rounded">Edit</a>
        <button (click)="delete(e.id)" class="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
      </div>
    </div>
  `
})
export class EvidenceListComponent {
  evidences: Evidence[] = [];

  constructor(private svc: EvidenceService) {
    this.evidences = this.svc.getAll();
  }

  delete(id: number) {
    this.svc.delete(id);
    this.evidences = this.svc.getAll(); // refresh
  }
}
