import { Component, OnInit } from '@angular/core';
import { RoomService } from '../../shared/services/rooms.service';
import { BookingsInterface } from '../../shared/interfaces/bookings.interface';
import { BookingCardComponent } from '../../shared/booking-card/booking-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, BookingCardComponent],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.css',
})
export class MyBookingsComponent implements OnInit {
  bookingList: BookingsInterface[] = [];

  constructor(private roomService: RoomService) {}

  ngOnInit(): void {
    this.roomService.getUserBookings().subscribe(
      (userBookings) => {
        console.log("All user's reservations: ", userBookings);
        this.bookingList = userBookings;
      },
      (err) => {
        console.error('Error fetching bookings: ', err);
      }
    );
  }
}
