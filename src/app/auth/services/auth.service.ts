import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { RegisterRequestInterface } from '../interfaces/registerRequestInterface';
import { environment } from '../../../environments/environment.development';
import { UserInterface } from '../interfaces/user.interface';
import { LoginRequestInterface } from '../interfaces/loginRequestInterface.interface';
import { Router } from '@angular/router';
import { ChangePassRequest } from '../interfaces/changePassRequest.interface';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUserSig = signal<UserInterface | undefined | null>(undefined);

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false); // New BehaviorSubject
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable(); // Expose it as an Observable

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage(); // Initialize user on service creation
  }

  private loadUserFromStorage() {
    const token = localStorage.getItem('token');

    if (token) {
      this.checkToken().subscribe((status) => {
        if (status === 'valid') {
          this.isAuthenticatedSubject.next(true);
          console.log('Status: ', status);
        } else {
          this.isAuthenticatedSubject.next(false);
          console.log('Status: ', status);
        }
      });
    } else {
      this.isAuthenticatedSubject.next(false);
      console.log('Status: ', status);
    }
  }

  checkToken(): Observable<'valid' | 'invalid' | 'noToken'> {
    const token = localStorage.getItem('token');
    console.log('Check token: ', token);
    if (token) {
      const fullUrl = environment.apiUrl + '/users/check-token';
      const headers = new HttpHeaders({
        'Ocp-Apim-Subscription-Key': environment.apiKey,
        Authorization: `Bearer ${token}`,
      });
      return this.http
        .get<string>(fullUrl, { headers, responseType: 'text' as 'json' })
        .pipe(
          map(() => 'valid' as 'valid'), // Explicitly cast the result to 'valid'
          catchError(() => of('invalid' as 'invalid')) // Explicitly cast the error result to 'invalid'
        );
    } else {
      return of('noToken');
    }
  }

  register(data: RegisterRequestInterface) {
    const fullUrl = environment.apiUrl + '/users/register';
    const headers = new HttpHeaders({
      'Ocp-Apim-Subscription-Key': environment.apiKey,
    });
    return this.http.post<UserInterface>(fullUrl, data, { headers }).subscribe(
      (user) => {
        console.log('Register response:', user);
        this.storeUser(user);
      },
      (error) => {
        console.error('Register error:', error);
      }
    );
  }

  login(data: LoginRequestInterface) {
    const fullUrl = environment.apiUrl + '/users/login';
    const headers = new HttpHeaders({
      'Ocp-Apim-Subscription-Key': environment.apiKey,
    });
    return this.http.post<UserInterface>(fullUrl, data, { headers }).subscribe(
      (user) => {
        console.log('Login successful:', user);
        this.storeUser(user);
        this.isAuthenticatedSubject.next(true); // Emit authenticated
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error('Login error:', error);
      }
    );
  }

  updatedLogin(data: LoginRequestInterface): void {
    const fullUrl = environment.apiUrl + '/users/login';
    const headers = new HttpHeaders({
      'Ocp-Apim-Subscription-Key': environment.apiKey,
    });

    this.http.post<UserInterface>(fullUrl, data, { headers }).subscribe(
      (user) => {
        if (user.isActive) {
          // User is active, proceed with login
          console.log('Login successful:', user);
          this.storeUser(user);
          this.isAuthenticatedSubject.next(true);
          this.router.navigate(['/home']);
        } else {
          // User is inactive, save data in localStorage
          console.log('Account is inactive');
          localStorage.setItem('inactiveUser', JSON.stringify(user));
        }
      },
      (error) => {
        console.error('Login error:', error);
      }
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isAuthenticatedSubject.next(false); // Emit not authenticated
    this.router.navigate(['/login']);
  }

  changePassword(data: ChangePassRequest) {
    const token = this.getToken();
    const fullUrl = environment.apiUrl + '/users/update-password';
    const headers = new HttpHeaders({
      'Ocp-Apim-Subscription-Key': environment.apiKey,
      Authorization: `Bearer ${token}`,
    });

    return this.http.put(fullUrl, data, { headers });
  }

  deactivateAccount() {
    const token = this.getToken();
    console.log(token);
    const fullUrl = environment.apiUrl + '/users/deactivate-account';
    console.log(fullUrl);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Ocp-Apim-Subscription-Key': environment.apiKey,
    });

    return this.http.put(fullUrl, {}, { headers, responseType: 'text' });
  }

  activateAccount(): void {
    const inactiveUser = localStorage.getItem('inactiveUser');
    if (!inactiveUser) {
      console.error('No inactive user found');
      return;
    }

    const user = JSON.parse(inactiveUser) as UserInterface;
    const token = user.token; // Assuming the token is part of UserInterface

    const fullUrl = `${environment.apiUrl}/users/restore-account`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Ocp-Apim-Subscription-Key': environment.apiKey,
    });

    this.http.put(fullUrl, {}, { headers }).subscribe(
      () => {
        console.log('Account activated successfully');
        localStorage.removeItem('inactiveUser'); // Cleanup
        this.storeUser(user); // Log in the user
        this.isAuthenticatedSubject.next(true);
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error('Error activating account:', error);
      }
    );
  }

  private storeUser(user: UserInterface) {
    localStorage.setItem('token', user.token);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSig.set(user);
  }

  getToken(): string | null {
    const currentUser = this.currentUserSig();
    return currentUser?.token || null;
  }
}
