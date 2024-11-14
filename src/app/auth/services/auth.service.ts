import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { RegisterRequestInterface } from '../interfaces/registerRequestInterface';
import { environment } from '../../../environments/environment.development';
import { UserInterface } from '../interfaces/user.interface';
import { LoginRequestInterface } from '../interfaces/loginRequestInterface.interface';
import { RegisterResponseInterface } from '../interfaces/registerResponseInterface.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUserSig = signal<UserInterface | undefined | null>(undefined);
  constructor(private http: HttpClient) {}

  register(data: RegisterRequestInterface) {
    const fullUrl = environment.apiUrl + '/users/register';
    const headers = new HttpHeaders({
      'Ocp-Apim-Subscription-Key': environment.apiKey,
    });
    return this.http
      .post<UserInterface>(fullUrl, data, { headers })
      .subscribe((user) => {
        console.log('Register response:', user);
      });
  }

  login(data: LoginRequestInterface) {
    const fullUrl = environment.apiUrl + '/users/login';
    const headers = new HttpHeaders({
      'Ocp-Apim-Subscription-Key': environment.apiKey,
    });
    return this.http
      .post<UserInterface>(fullUrl, data, { headers })
      .subscribe((user) => {
        console.log('Login response:', user);
        localStorage.setItem('token', user.token);
        this.currentUserSig.set(user);
      });
  }
}
