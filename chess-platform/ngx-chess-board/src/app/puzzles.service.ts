import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PuzzlesService {
  private apiUrl = 'http://localhost:3000/api'; 

  constructor(private http:HttpClient) { }
  // getPuzzles(rating: number, popularity: number) {
  //   const url = `${this.apiUrl}/puzzles/filter/${popularity}/${rating}`;

  //   // Envoyer la requête HTTP GET avec l'URL construite
  //   return this.http.get(url);
  // }
  getRandomPuzzle() {
    const url = `${this.apiUrl}/puzzles/random`;
    return this.http.get(url);
  }
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
