import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EvidenceComponent } from './pages/evidence.page.component';
import { EvidenceListComponent } from './components/evidence-list.component';

const routes: Routes = [
  { path: '', component: EvidenceListComponent },        
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvidenceRoutingModule {}
