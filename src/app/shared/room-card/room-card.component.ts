import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { RoomInterface } from '../interfaces/room.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-room-card',
  standalone: true,
  imports: [
    CommonModule,
    MatTooltipModule,
    MatCardModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './room-card.component.html',
  styleUrl: './room-card.component.css',
})
export class RoomCardComponent implements OnInit {
  @Input() roomInfo!: RoomInterface;

  // Add getters for the template
  get title(): string {
    return this.roomInfo?.description || 'Room Title'; // Using description as title if that's how your API returns it
  }

  get description(): string {
    return (
      this.roomInfo?.fullDescription ||
      this.roomInfo?.description ||
      'No description available'
    );
  }

  isSearched: boolean = false;

  constructor(private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    // Check if dates are selected
    const startDate = localStorage.getItem('startDateStorage');
    const endDate = localStorage.getItem('endDateStorage');
    this.isSearched = !!(startDate && endDate);
  }

  viewDetails(): void {
    if (this.isSearched) {
      this.router.navigate(['/room', this.roomInfo.id]);
    } else {
      this.snackBar.open(
        'Please select your check-in and check-out dates first',
        'Close',
        {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['warning-snackbar'],
        }
      );
    }
  }
}
