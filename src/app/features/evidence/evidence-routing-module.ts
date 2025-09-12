import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EvidenceComponent } from './pages/evidence.page.component';
import { EvidenceListComponent } from './components/evidence-list.component';
import { EvidenceFormComponent } from './evidence-form/evidence-form';
import { ReviewsComponent } from '../reviews/pages/review.component';

const routes: Routes = [
  { path: '', component: EvidenceListComponent },        
  { path: 'new', component: EvidenceFormComponent },      
  { path: 'edit/:id', component: EvidenceFormComponent },  
  { path: 'reviews/:id', component: ReviewsComponent } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvidenceRoutingModule {}
