import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService } from '../../shared/services/rooms.service';
import { MatSpinner } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-receipt',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,

    MatTooltipModule,
    MatRadioModule,
    MatIcon,
    MatRadioModule,
    MatSelectModule,
    MatInputModule,
    MatOptionModule,
    MatFormFieldModule,
    MatSpinner,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    DatePipe,
    CurrencyPipe,
  ],
  templateUrl: './receipt.component.html',
  styleUrl: './receipt.component.css',
})
export class ReceiptComponent implements OnInit {
  receipt!: any;
  features: { name: string; price: string }[] = [];
  reviewForm: FormGroup;
  rating: number = 0; // The rating selected by the user
  ratingArr = [1, 2, 3, 4, 5]; // Array for 5 stars
  starCount: number = 5; // Default to 5 stars
  color: string = 'accent'; // Material color (can change to 'primary' or 'warn')

  isEditing = false;
  editReviewForm: FormGroup;
  editRating: any;

  dailyFeatures: { name: string; pricePerPerson: number }[] = [
    { name: 'Breakfast', pricePerPerson: 20 },
    { name: 'Sauna Access', pricePerPerson: 10 },
    { name: 'Gym Access', pricePerPerson: 10 },
  ];

  oneTimeFeatures: { name: string; price: number }[] = [
    { name: 'Laundry Service', price: 10 },
    { name: 'Parking', price: 5 },
  ];

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.reviewForm = this.fb.group({
      comment: ['', Validators.maxLength(250)],
      rating: [null, Validators.required],
    });
    this.editReviewForm = this.fb.group({
      comment: ['', [Validators.required, Validators.maxLength(500)]],
    });
  }

  ngOnInit(): void {
    const bookingId = this.route.snapshot.paramMap.get('bookingId');
    if (bookingId) {
      this.roomService.getReceiptByBookingId(bookingId).subscribe({
        next: (data) => {
          this.receipt = {
            ...data,
            numberOfNights: this.calculateNights(
              data.startDate.toString(),
              data.endDate.toString()
            ),
          };
          this.parseFeatures();
        },
        error: (error) => {
          console.error('Error fetching receipt:', error);
          this.receipt = null;
        },
      });
    }
  }

  calculateNights(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  onStarClick(selectedRating: number, event: Event): void {
    event.stopPropagation(); // Prevent the event from bubbling up and triggering form submission
    event.preventDefault(); // Prevent default action of the event

    this.rating = selectedRating;
    this.reviewForm.patchValue({ rating: selectedRating }); // Update form control value
  }

  // Method to show icon (filled or outline based on rating)
  showIcon(index: number): string {
    return index < this.rating ? 'star' : 'star_border'; // Filled or empty star
  }

  // Handle form submission
  submitReview(): void {
    if (this.reviewForm.valid) {
      const reviewData = this.reviewForm.value;
      const bookingId = this.route.snapshot.paramMap.get('bookingId');
      const fetchData = { bookingId, ...reviewData };
      if (bookingId) {
        console.log(fetchData);
        this.roomService.postReview(fetchData).subscribe(
          (response) => {
            console.log(response);
            this.router.navigate(['/bookings']);
          },
          (err) => {
            console.error('Error posting review: ', err);
          }
        );
      }
    }
  }
  parseFeatures(): void {
    if (this.receipt) {
      const names = this.receipt.featureNames.split(',');
      const prices = this.receipt.featurePrices.split(',');

      this.features = names.map((name: any, index: any) => ({
        name: name.trim(),
        price: prices[index]?.trim() || '0.00',
      }));
    }
  }

  // Toggle to edit mode
  editReview() {
    this.isEditing = true;
    this.editRating = this.receipt.review.rating; // Set initial rating
    this.editReviewForm.patchValue({
      comment: this.receipt.review.comment,
    });
  }

  // Handle star click for editing
  onEditStarClick(star: number, event: Event) {
    event.preventDefault(); // Prevent the default form submit behavior
    this.editRating = star;
  }

  // Return icon for star based on rating
  showEditIcon(index: number): string {
    return index < this.editRating ? 'star' : 'star_border';
  }

  // Submit the edited review
  submitEditedReview() {
    if (this.editReviewForm.valid) {
      const updatedReview = {
        bookingId: this.receipt.bookingId,
        comment: this.editReviewForm.value.comment,
        rating: this.editRating,
      };
      console.log('Updated Review:', updatedReview);
      this.roomService.editReview(updatedReview).subscribe(
        (response) => {
          console.log('Successfully edited review: ', response);
        },
        (error) => {
          console.error('Error editing review: ', error);
        }
      );

      // Save logic goes here (emit to parent or update API)
      this.receipt.review = updatedReview;
      this.isEditing = false;
    }
  }

  deleteReview() {
    const bookingId = this.receipt.bookingId;
    this.roomService.deleteReview(bookingId).subscribe(
      (response) => {
        console.log('Successfully deleted review: ', response);
        this.router.navigate(['/bookings']);
      },
      (err) => {
        console.error('Error deleting review: ', err);
      }
    );
  }
  // Cancel edit mode
  cancelEdit() {
    this.isEditing = false;
  }
}
