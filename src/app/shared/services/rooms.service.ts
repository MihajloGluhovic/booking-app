import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RoomInterface } from '../interfaces/room.interface';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class RoomService {
  private roomsSubject = new BehaviorSubject<RoomInterface[]>([]);
  rooms$ = this.roomsSubject.asObservable();

  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  constructor(private http: HttpClient) {
    this.refreshRooms();
  }

  getRooms(): Observable<RoomInterface[]> {
    const fullUrl = environment.apiUrl + '/roomtypes/allroomtypes';
    const headers = new HttpHeaders({
      'Ocp-Apim-Subscription-Key': environment.apiKey,
    });

    return this.http
      .get<RoomInterface[]>(fullUrl, { headers })
      .pipe(tap((rooms) => this.roomsSubject.next(rooms)));
  }

  getRoomsOnDate(date: string): Observable<RoomInterface[]> {
    this.isLoadingSubject.next(true);
    const fullUrl = environment.apiUrl + '/roomtypes/' + date;
    const headers = new HttpHeaders({
      'Ocp-Apim-Subscription-Key': environment.apiKey,
    });

    return this.http.get<RoomInterface[]>(fullUrl, { headers }).pipe(
      tap((rooms) => {
        this.roomsSubject.next(rooms);
        this.isLoadingSubject.next(false);
        console.log('Request:', rooms);
      })
    );
  }

  refreshRooms(): void {
    this.getRooms().subscribe();
  }
}
