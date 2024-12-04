import { Component, OnInit } from '@angular/core';
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
import { Router, ActivatedRoute } from '@angular/router';

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
export class SearchComponent implements OnInit {
  dateRangeForm: FormGroup;
  minDate: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private dateService: DateService,
    private roomsService: RoomService,
    private router: Router,
    private route: ActivatedRoute
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

  ngOnInit() {
    // First check URL parameters
    this.route.queryParams.subscribe((params) => {
      const { startDate, endDate } = params;
      this.roomsService.getRoomsOnDate(startDate, endDate);
      if (startDate && endDate) {
        this.dateRangeForm.patchValue({
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        });
        this.roomsService.updateSearchDates(startDate, endDate);
      }
    });

    // Then subscribe to searchDate$ as before
    this.roomsService.searchDate$.subscribe((dates) => {
      if (dates) {
        const [startDate, endDate] = dates;
        this.dateRangeForm.patchValue({
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        });
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { startDate, endDate },
          queryParamsHandling: 'merge',
        });
        this.search();
      }
    });
  }

  search() {
    const startDate = this.dateService.formatDate(
      this.dateRangeForm.get('startDate')?.value
    );
    const endDate = this.dateService.formatDate(
      this.dateRangeForm.get('endDate')?.value
    );

    // Update URL with query parameters
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { startDate, endDate },
      queryParamsHandling: 'merge',
    });

    this.roomsService.getRoomsOnDate(startDate, endDate).subscribe({
      next: (rooms) => console.log('Rooms updated:', rooms),
      error: (error) => console.error('Error fetching rooms:', error),
    });
  }
}
