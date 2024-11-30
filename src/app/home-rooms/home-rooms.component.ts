import { Component, OnInit } from '@angular/core';
import { RoomCardComponent } from '../shared/room-card/room-card.component';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { RoomService } from '../shared/services/rooms.service';
import { RoomInterface } from '../shared/interfaces/room.interface';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-home-rooms',
  standalone: true,
  imports: [
    CommonModule,
    RoomCardComponent,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
  templateUrl: './home-rooms.component.html',
  styleUrl: './home-rooms.component.css',
})
export class HomeRoomsComponent implements OnInit {
  rooms?: RoomInterface[];
  isLoading: boolean = false;
  layout: 'grid' | 'list' = 'grid';
  sortBy: string = 'featured';

  constructor(private roomService: RoomService) {}

  ngOnInit() {
    this.loadRooms();
  }

  loadRooms() {
    this.isLoading = true;
    this.roomService.refreshRooms();
    this.roomService.rooms$.subscribe(
      (rooms) => {
        this.rooms = this.sortRooms(rooms);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading rooms:', error);
        this.isLoading = false;
      }
    );
  }

  changeLayout(layout: 'grid' | 'list') {
    this.layout = layout;
  }

  sortRooms(rooms: RoomInterface[]): RoomInterface[] {
    switch (this.sortBy) {
      case 'price-low':
        return rooms.sort((a, b) => a.price - b.price);
      case 'price-high':
        return rooms.sort((a, b) => b.price - a.price);
      default:
        return rooms; // Default sorting logic
    }
  }

  onSortChange(sortValue: string) {
    this.sortBy = sortValue;
    if (this.rooms) {
      this.rooms = this.sortRooms(this.rooms);
    }
  }
}
