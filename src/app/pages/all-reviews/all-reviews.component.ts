import { Component, OnInit } from '@angular/core';
import { RoomService } from '../../shared/services/rooms.service';
import { ReviewInterface } from '../../shared/interfaces/review.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-reviews.component.html',
  styleUrl: './all-reviews.component.css',
})
export class AllReviewsComponent implements OnInit {
  allReviews: ReviewInterface[] = [];
  globalRating: number = 0;

  constructor(private roomService: RoomService) {}

  ngOnInit(): void {
    this.roomService.getAllReviews().subscribe(
      (response) => {
        this.allReviews = response.reviews;
        this.globalRating = parseFloat(response.average.toFixed(1));
      },
      (err) => {
        console.error('Error getting reviews and rating', err);
      }
    );
  }

  getRatingPercentage(): number {
    return (this.globalRating / 5) * 100;
  }
}
