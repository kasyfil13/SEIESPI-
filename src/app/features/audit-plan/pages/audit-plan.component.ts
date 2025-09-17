import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditPlanService } from '../service/audit-plan.service';
import { Audit } from '../models/audit.model';

@Component({
  selector: 'app-audit-plan',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit-plan.component.html',
  styleUrls: ['./audit-plan.component.scss']
})
export class AuditPlanComponent implements OnInit {
  auditPlans: Audit[] = [];
  modalOpen = false;
  editIndex: number | null = null;

  plan: Audit = {
    id: 0,
    auditName: '',
    category: '',
    startDate: '',
    endDate: '',
    auditee: 'Engineering',
    leadAuditor: '',
    scope: '',
    status: 'Belum selesai'
  };

  constructor(private auditService: AuditPlanService) {}

  ngOnInit() {
    this.loadPlans();
  }

  loadPlans() {
    this.auditService.getAll().subscribe(data => {
      this.auditPlans = data;
    });
  }

  openModal(index: number | null = null) {
    this.modalOpen = true;
    if (index !== null) {
      this.editIndex = index;
      this.plan = { ...this.auditPlans[index] };
    } else {
      this.editIndex = null;
      this.plan = {
        id: 0,
        auditName: '',
        category: '',
        startDate: '',
        endDate: '',
        auditee: 'Engineering',
        leadAuditor: '',
        scope: '',
        status: 'Belum selesai'
      };
    }
  }

  closeModal() {
    this.modalOpen = false;
  }

  savePlan() {
    this.auditService.upsert(this.plan).subscribe(id => {
      this.plan.id = id;
      if (this.editIndex !== null) {
        this.auditPlans[this.editIndex] = { ...this.plan };
      } else {
        this.auditPlans.push({ ...this.plan });
      }
      this.closeModal();
    });
  }

  deletePlan(index: number) {
    const id = this.auditPlans[index].id;
    if (confirm('Yakin ingin hapus?')) {
      this.auditService.delete(id).subscribe(() => {
        this.auditPlans.splice(index, 1);
      });
    }
  }
}
