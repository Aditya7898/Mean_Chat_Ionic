import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

const BaseUrl = 'http://localhost:3000/api/chatapp';

@Injectable()
export class AuthProvider {
  constructor(private http: HttpClient) {}

  // Register
  RegisterUser(username, email, password): Observable<any> {
    return this.http.post(`${BaseUrl}/register`, {
      username,
      email,
      password
    });
  }

  // Login
  LoginUser(username, password): Observable<any> {
    return this.http.post(`${BaseUrl}/login`, {
      username,
      password
    });
  }

  //
  GetAllUsers(): Observable<any> {
    return this.http.get(`${BaseUrl}/users`);
  }
}
