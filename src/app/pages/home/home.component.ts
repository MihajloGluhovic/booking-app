import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SearchComponent } from '../../shared/search/search.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SearchComponent, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
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
