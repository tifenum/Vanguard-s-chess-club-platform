import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router'; // Import Router
import * as jwt_decode from 'jwt-decode';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private userDataSource = new BehaviorSubject({ email: '', password: '' });
  private baseUrl = 'http://localhost:3000/api'; // Change this to your backend base URL
  currentUserData = this.userDataSource.asObservable();
  constructor(private http: HttpClient, private router: Router) {} // Inject Router

  changeData(newUserData) {
    this.userDataSource.next(newUserData);
  }

  registerUser(userData: any) {
    return this.http.post(`${this.baseUrl}/register`, userData).pipe(
      tap((response: any) => {
        if (response.user && response.user.role === 'admin') {
          // Store admin token
          localStorage.setItem('adminToken', response.token);
        } else {
          // Store regular user token
          localStorage.setItem('token', response.token);
        }
      })
    );
  }
  
  


  logout(userId: string): Observable<any> {
    // Récupérer le token d'authentification depuis le stockage local
    const token = localStorage.getItem('token');
    // Vérifier si le token est disponible
    if (!token) {
      // Gérer l'absence de token (par exemple, rediriger vers la page de connexion)
      // Vous pouvez implémenter votre logique de redirection ici
      return throwError('Token not found');
    }
  
    // Créer les en-têtes HTTP avec le token d'authentification inclus
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    // Effectuer la requête PUT pour déconnecter l'utilisateur
    return this.http.put<any>(`${this.baseUrl}/users/${userId}/logout`, {}, { headers }).pipe(
      tap(() => {
        // En cas de succès, supprimer le token d'authentification du stockage local
        localStorage.removeItem('token');
        // Rediriger vers la page de connexion
        this.router.navigate(['/login']);
      }),
      catchError(error => {
        // En cas d'erreur, logguer l'erreur et renvoyer un observable avec l'erreur
        console.error('Logout failed:', error);
        return throwError(error);
      })
    );
  }
  
  getConnectedUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/users/connected`);
  }
  getUserIdFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode< { _id: string } >(token); // Type annotation for decodedToken
      return decodedToken._id;
    }
    return null;
  }
  saveUserImage(imageFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', imageFile);

    // Retrieve token from local storage
    const token = localStorage.getItem('token');

    // Set headers with authorization token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(`${this.baseUrl}/saveImage`, formData, { headers });
  }
  getToken(): string {
    return localStorage.getItem('token');
  }
  // getTasks(): Observable<any[]> {
  //   return this.http.get<any[]>(this.apiUrl);
  // }
  // getUserData() :Observable<any>{
  //   const token =localStorage.getItem('token');
  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${token}`});
  //   return this.http.get(`${this.baseUrl}/userData`,{headers});
  // }
  // Modify the getUserData() method in the Angular service
getUserData(): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  return this.http.get(`${this.baseUrl}/userData`, { headers });
}

  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post(`${this.baseUrl}/login`, body).pipe(
      catchError((error: any) => {
        console.error('Error logging in:', error);
        throw error; // Rethrow the error to be caught by the subscriber
      }),
      tap((response: any) => {
        if (response.user && response.user.role === 'admin' ) {
          // Store admin token
          localStorage.setItem('adminToken', response.token);
          // Redirect admin to admin dashboard
          this.router.navigate(['/admindashboard']);
        } else {
          // Store regular user token
          localStorage.setItem('token', response.token);
          // Redirect regular user to account page
          this.router.navigate(['/account']);
        }
      })
    );
  }
}