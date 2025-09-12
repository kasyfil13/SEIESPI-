import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardHomeComponent } from './pages/dashboard-home.component';
import { DashboardRoutingModule } from './dashboard-routing-module';

@NgModule({
  imports: [CommonModule, DashboardRoutingModule, DashboardHomeComponent
  ]
})
export class DashboardModule {}
