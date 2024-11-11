import { Component } from '@angular/core';
import { RoomCardComponent } from '../shared/room-card/room-card.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
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
export class HomeRoomsComponent {
  rooms?: RoomInterface[];

  constructor(private http: HttpClient, private roomService: RoomService) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    const roomUrl = '/roomtypes/allroomtypes';
    this.roomService.getRooms(roomUrl).subscribe(
      (response) => {
        console.log('All rooms: ' + response);
        this.rooms = response;
      },
      (error) => {
        console.error('API call error: ', error);
      }
    );

    // this.http.get(environment.apiUrl + '/roomtypes/1003').subscribe(
    //   (response) => {
    //     console.log('API response:', response); // Logs the response
    //     this.room = response;
    //   },
    //   (error) => {
    //     console.error('API call error:', error); // Logs any error if occurs
    //   }
    // );
  }
}
