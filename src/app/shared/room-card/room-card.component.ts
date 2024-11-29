import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

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
export class RoomCardComponent implements OnChanges {
  @Input('roomInfo') room: any;
  isSearched: boolean = false;

  ngOnChanges(): void {
    const startDate = localStorage.getItem('startDateStorage');
    const endDate = localStorage.getItem('endDateStorage');
    if (startDate && endDate) {
      this.isSearched = true;
    }
  }
}
