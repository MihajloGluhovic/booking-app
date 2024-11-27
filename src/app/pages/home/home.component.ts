import { Component, OnInit } from '@angular/core';
import {} from '@angular/common/http';
import { SearchComponent } from '../../shared/search/search.component';
import { RoomFiltersComponent } from '../../shared/room-filters/room-filters.component';
import { HomeRoomsComponent } from '../../home-rooms/home-rooms.component';
import { AuthService } from '../../auth/services/auth.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SearchComponent, RoomFiltersComponent, HomeRoomsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getToken();
  }
}
