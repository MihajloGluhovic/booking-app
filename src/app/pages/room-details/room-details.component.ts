import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RoomInterface } from '../../shared/interfaces/room.interface';
import { CommonModule } from '@angular/common';

import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { RoomService } from '../../shared/services/rooms.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthService } from '../../auth/services/auth.service';
import { ReservationFetch } from '../../shared/interfaces/reservationFetch.interface';

@Component({
  selector: 'app-room-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,

    MatChipsModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatCheckboxModule,
    // MatProgressSpinner,
    MatNativeDateModule,
  ],
  templateUrl: './room-details.component.html',
  styleUrl: './room-details.component.css',
})
export class RoomDetailsComponent implements OnInit {
  room: RoomInterface | undefined;

  dateRangeForm: FormGroup;
  servicesForm: FormGroup;

  isLoading: boolean = true;
  totalPrice: number = 0;
  pricePerNight: number = 0;
  guestCount: number = 1;
  maxGuests: number = 1;

  staticFeatures: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roomService: RoomService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.dateRangeForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
    this.servicesForm = this.fb.group({
      breakfast: [false],
      sauna: [false],
      gym: [false],
      laundry: [false],
      parking: [false],
    });
  }

  ngOnInit(): void {
    this.authService.checkToken().subscribe((tokenStatus) => {
      if (tokenStatus === 'invalid' || tokenStatus === 'noToken') {
        this.router.navigate(['/login']); // Redirect for invalid or missing token
        console.log('Redirecting to login: Token expired or missing');
        return;
      }

      // Proceed with the rest of the component logic
      this.servicesForm.valueChanges.subscribe(() => {
        this.calculateTotalPrice();
      });

      const roomSlug = this.route.snapshot.paramMap.get('slug');
      if (roomSlug) {
        this.roomService.getRoomById(roomSlug).subscribe({
          next: (room) => {
            this.room = room;
            this.guestCount = room.maxOccupancy;
            this.maxGuests = room.maxOccupancy;
            this.isLoading = false;

            const staticFeatures = room.staticFeatures || {};

            this.staticFeatures = Object.keys(staticFeatures)
              .filter((key) => staticFeatures[key])
              .map((key) => this.formatFeatureName(key));

            this.dateRangeForm.patchValue({
              startDate: room.startDate,
              endDate: room.endDate,
            });
            this.calculateTotalPrice();
          },
          error: (err) => {
            console.error('Error fetching room:', err);
            this.isLoading = false;
          },
        });
      }
    });
  }

  formatFeatureName(featureKey: string): string {
    return featureKey.replace(/([A-Z])/g, ' $1').trim();
  }

  getSelectedServices(): number[] {
    const servicesMapping = ['breakfast', 'sauna', 'gym', 'laundry', 'parking'];
    return servicesMapping
      .map((service, index) =>
        this.servicesForm.value[service] ? index + 1 : null
      )
      .filter((value) => value !== null);
  }

  makeReservation(): void {
    this.authService.checkToken().subscribe((tokenStatus) => {
      if (tokenStatus === 'invalid' || tokenStatus === 'noToken') {
        this.router.navigate(['/login']); // Redirect for invalid or missing token
        console.log('Redirecting to login: Token expired or missing');
        return;
      }

      if (!this.room) {
        return;
      }

      const { startDate, endDate } = this.dateRangeForm.value;
      const selectedFeatures = this.getSelectedServices();
      const numOfPeople = this.guestCount;
      const id = this.room.id;

      // console.log('Start Date', startDate);
      // console.log('End Date', endDate);
      // console.log('Selected Services', selectedFeatures);
      // console.log('Guest Count', guestNumber);
      // console.log('Room ID', id);

      const request: ReservationFetch = {
        startDate,
        endDate,
        id,
        selectedFeatures,
        numOfPeople,
      };

      this.roomService.reserveRoom(request).subscribe((response) => {});
    });
  }
  onServiceChange(): void {
    // This method is called whenever a checkbox value changes
    this.calculateTotalPrice();
  }

  calculateTotalPrice(): void {
    if (!this.room) return;

    const services = this.servicesForm.value;

    // Room base price per night
    const pricePerNight = this.room.price || 0;

    // Extract start and end dates
    const startDate = this.dateRangeForm.get('startDate')?.value;
    const endDate = this.dateRangeForm.get('endDate')?.value;

    if (startDate && endDate) {
      // Calculate days staying
      const start = new Date(startDate);
      const end = new Date(endDate);
      const timeDiff = end.getTime() - start.getTime();
      const daysStaying = Math.ceil(timeDiff / (1000 * 3600 * 24));

      // Base room cost and extra guests
      const roomCost = pricePerNight * daysStaying;
      const extraGuestsCost =
        this.guestCount > 1 ? 30 * (this.guestCount - 1) * daysStaying : 0;

      // Calculate optional services cost
      const servicesCost = {
        breakfast: services.breakfast ? 20 * this.guestCount * daysStaying : 0,
        sauna: services.sauna ? 10 * this.guestCount * daysStaying : 0,
        gym: services.gym ? 10 * this.guestCount * daysStaying : 0,
        laundry: services.laundry ? 10 : 0, // Flat rate
        parking: services.parking ? 5 : 0, // Flat rate
      };

      const totalServicesCost = Object.values(servicesCost).reduce(
        (acc, cost) => acc + cost,
        0
      );

      // Set final values
      this.totalPrice = roomCost + extraGuestsCost + totalServicesCost;
      this.pricePerNight =
        pricePerNight +
        (this.guestCount > 1 ? 30 * (this.guestCount - 1) : 0) +
        Object.values(servicesCost).reduce(
          (acc, cost) => acc + cost / daysStaying,
          0
        );
    } else {
      this.totalPrice = 0;
      this.pricePerNight = 0;
    }
  }

  increaseGuests(): void {
    if (this.guestCount < this.maxGuests) {
      this.guestCount++;
      this.calculateTotalPrice();
    }
  }

  decreaseGuests(): void {
    if (this.guestCount > 1) {
      this.guestCount--;
      this.calculateTotalPrice();
    }
  }
}
