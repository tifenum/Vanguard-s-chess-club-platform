import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PredictionsService {

  constructor(private http: HttpClient) { }
  sendFen(fen: string):Observable<any> {
    return this.http.post('http://localhost:3000/api/predict', { fen });
  }
}
