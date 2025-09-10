import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuditPlanComponent } from './pages/audit-plan.component';


const routes: Routes = [
  {path: '', component: AuditPlanComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuditPlanRoutingModule { }
