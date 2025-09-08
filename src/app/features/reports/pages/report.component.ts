// src/app/features/reports/pages/report.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Report {
  id: number;
  name: string;
  date: string;
}

@Component({
  selector: 'app-reports',
  
  imports: [CommonModule],
  templateUrl: './report.component.html',
})
export class ReportsComponent {
  reports: Report[] = [
    { id: 1, name: 'Quarterly Audit', date: '2025-09-01' },
    { id: 2, name: 'Compliance Check', date: '2025-09-05' }
  ];

  generateReport() {
    console.log('Generating report...');
    alert('Report generated!');
  }

  downloadReport(report: Report) {
    console.log(`Downloading: ${report.name}`);
    alert(`Downloading ${report.name}`);
  }
}
