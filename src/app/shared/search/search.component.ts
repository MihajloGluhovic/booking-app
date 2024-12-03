import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DateService } from '../services/date.service';
import { RoomService } from '../services/rooms.service';
import { dateRangeValidator } from './validators/date-range.validator';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,

    MatIconModule,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  dateRangeForm: FormGroup;
  minDate: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private dateService: DateService,
    private roomsService: RoomService
  ) {
    // Create the form with startDate and endDate fields
    this.dateRangeForm = this.fb.group(
      {
        startDate: [null, Validators.required],
        endDate: [null, Validators.required],
      },
      { validators: dateRangeValidator() } // Custom validator for date range
    );
  }

  search() {
    const startDate = this.dateService.formatDate(
      this.dateRangeForm.get('startDate')?.value
    );
    const endDate = this.dateService.formatDate(
      this.dateRangeForm.get('endDate')?.value
    );

    const request = `available?startDate=${startDate}&endDate=${endDate}`;
    localStorage.setItem('startDateStorage', startDate);
    localStorage.setItem('endDateStorage', endDate);

    this.roomsService.getRoomsOnDate(request).subscribe(
      (rooms) => console.log('Rooms updated:', rooms),
      (error) => console.error('Error fetching rooms:', error)
    );
  }
}
