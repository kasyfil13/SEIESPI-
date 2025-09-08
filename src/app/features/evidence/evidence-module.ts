import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EvidenceListComponent } from './components/evidence-list.component';
import { EvidenceComponent } from './pages/evidence.page.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    EvidenceComponent ,
    EvidenceListComponent
  ]
})
export class EvidenceModule {}
