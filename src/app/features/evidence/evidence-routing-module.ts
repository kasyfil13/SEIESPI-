import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EvidenceComponent } from './pages/evidence.page.component';
import { EvidenceListComponent } from './components/evidence-list.component';
import { EvidenceFormComponent } from './evidence-form/evidence-form';
const routes: Routes = [
  {
    path: '',
    component: EvidenceComponent,
    children: [
      { path: '', component: EvidenceListComponent },
      { path: 'new', component: EvidenceFormComponent },
      { path: ':id/edit', component: EvidenceFormComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvidenceRoutingModule {}
