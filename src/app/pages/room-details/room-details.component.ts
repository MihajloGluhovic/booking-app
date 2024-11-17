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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { RoomService } from '../../shared/services/rooms.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-room-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,

    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatProgressSpinner,
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
  isLoading: boolean = true;

  constructor() {
    this.dateRangeForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const roomSlug = this.route.snapshot.paramMap.get('slug');
    if (roomSlug) {
      console.log('RoomSlug: ', roomSlug);
      this.roomService.getRoomById(roomSlug).subscribe({
        next: (room) => {
          this.room = room;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching room:', err);
          this.isLoading = false; // Stop loading even on error
        },
      });
    }
  }

  makeReservation(): void {
    if (this.dateRangeForm.valid && this.room) {
      const { startDate, endDate } = this.dateRangeForm.value;
      console.log(`Reservation for room ${this.room.id}:`, {
        startDate,
        endDate,
      });
      // Call reservation service or handle reservation logic here
    }
  }
}
