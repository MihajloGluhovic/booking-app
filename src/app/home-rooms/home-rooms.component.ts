import { Component, OnChanges, OnInit } from '@angular/core';
import { RoomCardComponent } from '../shared/room-card/room-card.component';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { RoomService } from '../shared/services/rooms.service';
import { RoomInterface } from '../shared/interfaces/room.interface';

@Component({
  selector: 'app-home-rooms',
  standalone: true,
  imports: [
    RoomCardComponent,
    HttpClientModule,
    MatProgressSpinnerModule,
    CommonModule,
  ],
  templateUrl: './home-rooms.component.html',
  styleUrl: './home-rooms.component.css',
})
export class HomeRoomsComponent implements OnInit {
  rooms?: RoomInterface[];
  isLoading: boolean = false;

  constructor(private roomService: RoomService) {}

  ngOnInit() {
    this.roomService.refreshRooms();

    this.roomService.rooms$.subscribe(
      (rooms) => {
        this.rooms = rooms;
      },
      (error) => console.error('Error loading rooms:', error)
    );

    // Subscribe to loading state to show/hide spinner
  }
}
