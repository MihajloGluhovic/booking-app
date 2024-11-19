import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
  private route = inject(ActivatedRoute);
  private roomService = inject(RoomService);
  private fb = inject(FormBuilder);

  room: RoomInterface | undefined;
  dateRangeForm: FormGroup;
  servicesForm: FormGroup;
  isLoading: boolean = true;
  totalPrice: number = 0;

  staticFeatures: string[] = [];

  constructor() {
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
    this.servicesForm.valueChanges.subscribe(() => {
      this.calculateTotalPrice();
    });

    const roomSlug = this.route.snapshot.paramMap.get('slug');
    if (roomSlug) {
      this.roomService.getRoomById(roomSlug).subscribe({
        next: (room) => {
          this.room = room;
          this.isLoading = false;

          // Ensure staticFeatures and dynamicFeatures are not null or undefined
          const staticFeatures = room.staticFeatures || {};
          const dynamicFeatures = room.dynamicFeatures || {};

          // Debug: Log room data to ensure dynamicFeatures exists
          console.log('Room data:', room);

          // Populate static features (if applicable)
          this.staticFeatures = Object.keys(staticFeatures)
            .filter((key) => staticFeatures[key])
            .map((key) => this.formatFeatureName(key));

          // Set the startDate and endDate from the room
          this.dateRangeForm.patchValue({
            startDate: room.startDate,
            endDate: room.endDate,
          });
        },
        error: (err) => {
          console.error('Error fetching room:', err);
          this.isLoading = false; // Stop loading even on error
        },
      });
    }
  }

  formatFeatureName(featureKey: string): string {
    return featureKey.replace(/([A-Z])/g, ' $1').trim();
  }

  makeReservation(): void {
    if (this.dateRangeForm.valid) {
      const { startDate, endDate } = this.dateRangeForm.value;
      // Handle the reservation logic here
    }
  }
  onServiceChange(): void {
    // This method is called whenever a checkbox value changes
    this.calculateTotalPrice();
  }

  calculateTotalPrice(): void {
    const services = this.servicesForm.value;

    // Prices for each service
    const prices = {
      breakfast: 20,
      sauna: 10,
      gym: 10,
      laundry: 10,
      parking: 5,
    };

    // Calculate total price based on selected services
    this.totalPrice = 0;

    if (services.breakfast) {
      this.totalPrice += prices.breakfast;
    }
    if (services.sauna) {
      this.totalPrice += prices.sauna;
    }
    if (services.gym) {
      this.totalPrice += prices.gym;
    }
    if (services.laundry) {
      this.totalPrice += prices.laundry;
    }
    if (services.parking) {
      this.totalPrice += prices.parking;
    }
  }
}
