import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RoomInterface } from '../interfaces/room.interface';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { AuthService } from '../../auth/services/auth.service';
import { ReservationFetch } from '../interfaces/reservationFetch.interface';
import { ReservationResponse } from '../interfaces/reservationResponse.interface';
import { Receipt } from '../interfaces/receipt.interface';

@Injectable({ providedIn: 'root' })
export class RoomService {
  private roomsSubject = new BehaviorSubject<RoomInterface[]>([]);
  rooms$ = this.roomsSubject.asObservable();

  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  getRooms(): Observable<RoomInterface[]> {
    const fullUrl = environment.apiUrl + '/roomtypes/allroomtypes';
    const headers = new HttpHeaders({
      'Ocp-Apim-Subscription-Key': environment.apiKey,
    });

    return this.http.get<RoomInterface[]>(fullUrl, { headers }).pipe(
      tap((rooms) => this.roomsSubject.next(rooms)),
      catchError((error) => {
        console.error('Error loading rooms:', error);
        return throwError(
          () => new Error(error.message || 'Failed to load rooms')
        );
      })
    );
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
      }),
      catchError((error) => {
        console.error('Error loading rooms:', error);
        return throwError(
          () => new Error(error.message || 'Failed to load rooms')
        );
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
        this.isLoadingSubject.next(false);
        console.log('Single Room:', room);
      }),
      catchError((error) => {
        console.error('Error loading rooms:', error);
        return throwError(
          () => new Error(error.message || 'Failed to load rooms')
        );
      })
    );
  }

  reserveRoom(form: ReservationFetch): Observable<ReservationResponse> {
    const token = localStorage.getItem('token');
    console.log(token);
    const fullUrl = `${environment.apiUrl}/bookings/book`;
    const headers = new HttpHeaders({
      'Ocp-Apim-Subscription-Key': environment.apiKey,
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<ReservationResponse>(fullUrl, form, { headers }).pipe(
      tap((response) => {
        console.log(response);
      }),
      catchError((error) => {
        console.error('Error reserving room:', error);
        return throwError(
          () => new Error(error.message || 'Failed to reserve room')
        );
      })
    );
  }

  refreshRooms(): void {
    this.getRooms().subscribe();
  }

  getReceiptByBookingId(bookingId: string): Observable<Receipt> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(() => {
        new Error('Unauthorized: No token provided');
      });
    }
    const fullUrl = `${environment.apiUrl}/bookings/${bookingId}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Ocp-Apim-Subscription-Key': environment.apiKey,
    });
    this.isLoadingSubject.next(true);

    return this.http.get<Receipt>(fullUrl, { headers }).pipe(
      tap((response) => {
        console.log('Fetched Receipt: ', response);
        this.isLoadingSubject.next(false);
      }),
      catchError((error) => {
        console.error('Error fetching receipt: ', error);
        this.isLoadingSubject.next(false);
        return throwError(
          () => new Error(error.message || 'Failed to fetch receipt')
        );
      })
    );
  }
}
