import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-home',
  standalone : true ,
  imports: [CommonModule],
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss'],
  encapsulation: ViewEncapsulation.None   // allow precise styling like the mock
})
export class DashboardHomeComponent {}
