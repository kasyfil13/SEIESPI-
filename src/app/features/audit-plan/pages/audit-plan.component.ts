import { Component } from '@angular/core';

@Component({
  selector: 'app-audit-plan',
  standalone:true,
  templateUrl: './audit-plan.component.html',
  styleUrls: ['./audit-plan.component.scss']
})
export class AuditPlanComponent {
  auditPlans = [
    { name: 'Finance Audit', date: '2024-09-01' },
    { name: 'IT Security Audit', date: '2024-09-15' },
    { name: 'Operations Audit', date: '2024-10-01' }
  ];

  createPlan() {
    alert('New Audit Plan creation!');
  }

  viewPlan(plan: any) {
    alert(`Viewing Plan: ${plan.name}`);
  }
}
