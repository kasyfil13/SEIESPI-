// src/app/features/evidence/evidence-list.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EvidenceService } from '../service/evidence.service';
import { Evidence } from '../models/evidence.model';

@Component({
  selector: 'app-evidence-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './evidence-list.component.html',
  styleUrls: ['./evidence-list.component.scss']
})
export class EvidenceListComponent {
  evidences: Evidence[] = [];
  searchTerm = '';
  progressFilter: string = 'All';  // 👈 added filter state

  constructor(private evidenceService: EvidenceService) {}

  async ngOnInit() {
    this.evidences = await this.evidenceService.getAll();
    console.log('📌 evidences in component:', this.evidences);
  }

  setFilter(filter: string) {
    this.progressFilter = filter;
  }

  filteredEvidences() {
    return this.evidences.filter(e => {
      const matchesSearch =
        !this.searchTerm || e.temuan.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesFilter =
        this.progressFilter === 'All' || e.progress === this.progressFilter;

      return matchesSearch && matchesFilter;
    });
  }

  async delete(id: number) {
    await this.evidenceService.delete(id);
    this.evidences = await this.evidenceService.getAll(); // refresh
  }
}
