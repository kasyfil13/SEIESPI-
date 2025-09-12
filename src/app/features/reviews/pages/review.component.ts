import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-reviews',
 
  imports : [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewsComponent {
<<<<<<< Updated upstream
reports: any;
downloadReport(_t5: any) {
throw new Error('Method not implemented.');
=======
  evidences: Evidence[] = [];
  evidence?: Evidence;

constructor(private route: ActivatedRoute, private evidenceSvc: EvidenceService) {
  this.route.paramMap.subscribe(params => {
    const id = params.get('id');
    if (id) {
      
      this.evidenceSvc.getById(Number(id)).subscribe(e => {
        this.evidence = e;
        this.evidences = [];
      });
    } else {
      this.evidenceSvc.getAll().subscribe(data => {
        this.evidences = data;
        this.evidence = undefined;
      });
    }
  });
>>>>>>> Stashed changes
}
generateReport() {
throw new Error('Method not implemented.');
}
  reviews = [
    { title: 'Finance Review', comment: 'Missing receipts', approved: false },
    { title: 'IT Review', comment: 'Outdated patches', approved: false }
  ];

  approveReview(review: any) {
    review.approved = true;
    alert(`Approved Review: ${review.title}`);
  }
}
