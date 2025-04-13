import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Websocket2Service } from './websocket2.service';
import { filter } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class InvitationService {
  constructor(private http: HttpClient, private websocketService: Websocket2Service) { }

  private apiUrl = 'http://localhost:3000/api/invitations';

  // Vos autres méthodes de service ici...

  // listenForInvitations(): Observable<any> {
  //   return this.websocketService.getMessages().pipe(
  //     filter((message: any) => message.type === 'invitation' || message.type === 'accepted')
  //   );
  // }
  
  sendInvitation(toUserId: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.apiUrl}/invite`, { to: toUserId }, { headers });
  }

  acceptInvitation(invitationId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/accept`, { invitationId });
  }

  getInvitations(toUserId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/invitations/${toUserId}`);
  }
  getInvitationsByid(Id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/invitationsByid/${Id}`);
  }
  declineInvitation(invitationId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/decline`, { invitationId });
  }
}