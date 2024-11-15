import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { RegisterRequestInterface } from '../interfaces/registerRequestInterface';
import { environment } from '../../../environments/environment.development';
import { UserInterface } from '../interfaces/user.interface';
import { LoginRequestInterface } from '../interfaces/loginRequestInterface.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUserSig = signal<UserInterface | undefined | null>(undefined);

  constructor(private http: HttpClient) {
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
  }

  private storeUser(user: UserInterface) {
    localStorage.setItem('token', user.token);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSig.set(user);
  }
}
