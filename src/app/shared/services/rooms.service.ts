import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RoomInterface } from '../interfaces/room.interface';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class RoomService {
  constructor(private http: HttpClient) {}

  getRooms(url: string): Observable<RoomInterface[]> {
    const fullUrl = environment.apiUrl + url;
    return this.http.get<RoomInterface[]>(fullUrl);
  }
}
