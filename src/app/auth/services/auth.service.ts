import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { RegisterRequestInterface } from '../interfaces/registerRequestInterface';
import { environment } from '../../../environments/environment.development';
import { UserInterface } from '../interfaces/user.interface';
import { LoginRequestInterface } from '../interfaces/loginRequestInterface.interface';
import { Router } from '@angular/router';
import { ChangePassRequest } from '../interfaces/changePassRequest.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUserSig = signal<UserInterface | undefined | null>(undefined);

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage(); // Initialize user on service creation
  }

  private loadUserFromStorage() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user'); // Optionally store user info
    if (token && user) {
      this.currentUserSig.set(JSON.parse(user));
    } else {
      this.currentUserSig.set(null);
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
        console.log('Login response:', user);
        this.storeUser(user);
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error('Login error:', error);
      }
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSig.set(null);
    console.log('User and token removed from localStorage');
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
