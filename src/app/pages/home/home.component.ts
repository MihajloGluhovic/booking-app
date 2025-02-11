import { Component, OnInit } from '@angular/core';
import {} from '@angular/common/http';
import { SearchComponent } from '../../shared/search/search.component';
import { HomeRoomsComponent } from '../../home-rooms/home-rooms.component';
import { AuthService } from '../../auth/services/auth.service';
import { MatIcon } from '@angular/material/icon';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SearchComponent, HomeRoomsComponent, MatIcon],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getToken();
  }
}
