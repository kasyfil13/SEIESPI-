import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,   
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard-routing-module').then(m => m.DashboardRoutingModule)
      },
      {
        path: 'evidence',
        loadChildren: () =>
          import('./features/evidence/evidence-routing-module').then(m => m.EvidenceRoutingModule)
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('./features/reports/reports-routing-module').then(m => m.ReportsRoutingModule)
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('./features/admin/admin-routing-module').then(m => m.AdminRoutingModule)
      }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
