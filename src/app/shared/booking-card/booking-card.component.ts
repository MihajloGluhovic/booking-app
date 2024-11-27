import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RoomService } from '../services/rooms.service';

@Component({
  selector: 'app-booking-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './booking-card.component.html',
  styleUrl: './booking-card.component.css',
})
export class BookingCardComponent implements OnInit {
  @Input() bookings: any[] = []; // Ensure the type is Booking[]
  activeBookings: any[] = [];
  expiredBookings: any[] = [];

  constructor(private router: Router, private roomService: RoomService) {}

  ngOnInit(): void {
    this.categorizeBookings();
  }

  ngOnChanges(): void {
    this.categorizeBookings();
  }

  private categorizeBookings(): void {
    this.activeBookings = this.bookings.filter((booking) => !booking.isExpired);
    this.expiredBookings = this.bookings.filter((booking) => booking.isExpired);
  }

  navigateToBooking(bookingId: number): void {
    this.router.navigate([`/bookings/${bookingId}`]);
  }

  deleteBooking(bookingId: number): void {
    this.roomService.deleteBooking(bookingId).subscribe(
      (message) => {
        console.log('Deleted booking successfully: ', message);
        this.bookings = this.bookings.filter((b) => b.bookingId !== bookingId);
        this.categorizeBookings(); // Re-categorize after deletion
      },
      (err) => {
        console.error('Error deleting booking: ', err);
      }
    );
  }
}
