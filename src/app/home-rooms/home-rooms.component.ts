import { Component } from '@angular/core';
import { RoomCardComponent } from '../shared/room-card/room-card.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

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
export class HomeRoomsComponent {
  room: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.http
      .get('https://hotelapi.azurewebsites.net/api/roomtypes/1003')
      .subscribe(
        (response) => {
          console.log('API response:', response); // Logs the response
          this.room = response;
        },
        (error) => {
          console.error('API call error:', error); // Logs any error if occurs
        }
      );
  }
}
