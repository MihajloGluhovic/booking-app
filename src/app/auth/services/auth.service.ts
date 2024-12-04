import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { RegisterRequestInterface } from '../interfaces/registerRequestInterface';
import { environment } from '../../../environments/environment.development';
import { UserInterface } from '../interfaces/user.interface';
import { LoginRequestInterface } from '../interfaces/loginRequestInterface.interface';
import { Router } from '@angular/router';
import { ChangePassRequest } from '../interfaces/changePassRequest.interface';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  throwError,
} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUserSig = signal<UserInterface | undefined | null>(undefined);

  isAuthenticatedSubject = new BehaviorSubject<boolean>(false); // New BehaviorSubject
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
      console.log('Status: ', 'noToken');
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

  register(registerData: RegisterRequestInterface): Observable<any> {
    const fullUrl = environment.apiUrl + '/users/register';
    const headers = new HttpHeaders({
      'Ocp-Apim-Subscription-Key': environment.apiKey,
    });

    return new Observable((observer) => {
      this.http
        .post<UserInterface>(fullUrl, registerData, { headers })
        .pipe(
          catchError((error: HttpErrorResponse) => {
            observer.error(error.error);
            return throwError(() => error);
          })
        )
        .subscribe((response) => {
          const { email, password } = registerData;

          this.login({ email, password }).subscribe({
            next: (loggedInUser) => {
              this.storeUser(loggedInUser);
              this.isAuthenticatedSubject.next(true);
              this.router.navigate(['/home']);
              observer.next({
                success: true,
                message: 'Registration successful!',
              });
              observer.complete();
            },
            error: (err) => {
              observer.error(err.error || 'Login after registration failed');
            },
          });
        });
    });
  }

  login(data: LoginRequestInterface) {
    const fullUrl = environment.apiUrl + '/users/login';
    const headers = new HttpHeaders({
      'Ocp-Apim-Subscription-Key': environment.apiKey,
    });

    return this.http.post<UserInterface>(fullUrl, data, { headers });
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

    return this.http.put(fullUrl, data, {
      headers,
      responseType: 'text' as 'json',
    });
  }

  deactivateAccount() {
    const token = this.getToken();
    const fullUrl = environment.apiUrl + '/users/deactivate-account';
    console.log(fullUrl);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Ocp-Apim-Subscription-Key': environment.apiKey,
    });

    return this.http.put(fullUrl, {}, { headers, responseType: 'text' });
  }

  activateAccount(loginData: LoginRequestInterface): void {
    const token = this.getToken();

    const fullUrl = `${environment.apiUrl}/users/restore-account`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Ocp-Apim-Subscription-Key': environment.apiKey,
    });

    this.http.put<UserInterface>(fullUrl, {}, { headers }).subscribe(
      (user) => {
        console.log('Account activated successfully, User: ', user);

        // Triggering login method
        this.login(loginData).subscribe({
          next: (loggedInUser) => {
            // Storing the user and navigating to home page
            this.storeUser(loggedInUser);
            this.isAuthenticatedSubject.next(true);
            this.router.navigate(['/home']);
          },
          error: (err) => {
            console.error('Error logging in after activation', err);
          },
        });
      },
      (error) => {
        console.error('Error activating account:', error);
      }
    );
  }

  getUser(token: string) {
    const fullUrl = environment.apiUrl + '/users/get-user';
    const headers = new HttpHeaders({
      'Ocp-Apim-Subscription-Key': environment.apiKey,
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<UserInterface>(fullUrl, { headers }).subscribe(
      (user) => {
        this.storeUser(user);
      },
      (error) => {
        console.error('getUser error: ', error);
      }
    );
  }

  storeUser(user: UserInterface) {
    localStorage.setItem('token', user.token);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSig.set(user);
  }

  getToken(): string | null {
    const currentUser = this.currentUserSig();
    const currentToken = localStorage.getItem('token');
    return currentUser?.token || currentToken;
  }

  startTokenValidityCheck(intervalMs: number = 60000) {
    // Default check every minute
    return setInterval(() => {
      this.checkToken().subscribe((status) => {
        if (status === 'valid') {
          this.isAuthenticatedSubject.next(true);
        } else {
          this.isAuthenticatedSubject.next(false);
        }
      });
    }, intervalMs);
  }

  stopTokenValidityCheck(intervalId: number) {
    clearInterval(intervalId);
  }
}
