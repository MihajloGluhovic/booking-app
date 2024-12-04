import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { RoomInterface } from '../interfaces/room.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { RoomService } from '../services/rooms.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-room-card',
  standalone: true,
  imports: [
    CommonModule,
    MatTooltipModule,
    MatCardModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,
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

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private roomService: RoomService
  ) {}

  ngOnInit(): void {
    // Check if dates are in the query parameters
    this.route.queryParams.subscribe((params) => {
      const startDate = params['startDate'];
      const endDate = params['endDate'];
      this.isSearched = !!(startDate && endDate);
    });
  }

  viewDetails(): void {
    this.roomService.searchDate$.pipe(take(1)).subscribe((dates) => {
      if (dates) {
        const [startDate, endDate] = dates;
        this.router.navigate(['/room', this.roomInfo.id], {
          queryParams: { startDate, endDate },
        });
      }
    });
  }
}
