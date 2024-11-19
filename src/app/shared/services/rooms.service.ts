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

  constructor(private http: HttpClient) {}

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
    const fullUrl = environment.apiUrl + '/roomtypes/' + date;
    const headers = new HttpHeaders({
      'Ocp-Apim-Subscription-Key': environment.apiKey,
    });

    return this.http.get<RoomInterface[]>(fullUrl, { headers }).pipe(
      tap((rooms) => {
        this.roomsSubject.next(rooms);
        this.isLoadingSubject.next(false);
      })
    );
  }

  getRoomById(slug: string): Observable<RoomInterface> {
    const token = localStorage.getItem('token');

    const startDateItem = localStorage.getItem('startDateStorage');
    const endDateItem = localStorage.getItem('endDateStorage');

    const body = { startDate: startDateItem, endDate: endDateItem };

    this.isLoadingSubject.next(true);

    const fullUrl = environment.apiUrl + '/roomtypes/' + slug;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Ocp-Apim-Subscription-Key': environment.apiKey,
    });

    return this.http.post<RoomInterface>(fullUrl, body, { headers }).pipe(
      tap((room) => {
        // this.roomsSubject.next(rooms);
        this.isLoadingSubject.next(false);
        console.log('Single Room:', room);
      })
    );
  }

  refreshRooms(): void {
    this.getRooms().subscribe();
  }
}
