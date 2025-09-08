import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvidenceListComponent } from '../components/evidence-list.component';

@Component({
  selector: 'app-evidence',
  standalone: true,
  imports: [CommonModule, EvidenceListComponent],
  templateUrl: './evidence.page.component.html',
  styleUrls: ['./evidence.page.component.scss']
})
export class EvidenceComponent {}
