// admin-auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    return this.http.post<any>('http://localhost:3000/admin/login', { email, password });
  }
}
