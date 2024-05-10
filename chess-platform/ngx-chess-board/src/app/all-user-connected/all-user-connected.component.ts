import { Component, OnInit } from '@angular/core';
import { InvitationService } from '../invitation.service';
import { UsersService } from '../users.service';
import { Router } from '@angular/router'; 
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Websocket2Service } from '../websocket2.service';
@Component({
  selector: 'app-all-user-connected',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './all-user-connected.component.html',
  styleUrl: './all-user-connected.component.scss'
})
export class AllUserConnectedComponent implements OnInit {
  invitations: any[] = [];
  connectedUsers: any[] = [];
  toUserId: string;
  idplayer: string;
  idrouter:string="";
  token: string;
  public inv: boolean = false;
  constructor(private userService: UsersService, private invitationService: InvitationService, private router: Router,private websocketService: Websocket2Service) { }

  ngOnInit(): void {
    
  this.toUserId=this.userService.getUserIdFromToken()
    this.token=this.userService.getToken();
    this.loadInvitations()
    this.websocketService.getMessage().subscribe((moveData: any) => {
      console.log('Received move data:', moveData);
      const dataSize = JSON.stringify(moveData).length;
      console.log("dataSize ",dataSize);
   if (dataSize>100) {
    this.loadInvitations();
        
      }  else {
      
        this.navigateTo('playwithfriends',this.idrouter,this.idplayer);
      }
      
 
    });
    this.getConnectedUsers()
  }


  getConnectedUsers(): void {
    this.userService.getConnectedUsers().subscribe(
      (users) => {
        this.connectedUsers = this.removeElementById(users, this.toUserId) ;
        console.log(this.connectedUsers)
      },
      (error) => {
        console.error('Error fetching connected users:', error);
      }
    );
  }
   removeElementById(array, idToRemove) {
    // Recherche de l'index de l'élément ayant l'id à supprimer
    const indexToRemove = array.findIndex(item => item._id === idToRemove);

    // Vérification si l'index a été trouvé
    if (indexToRemove !== -1) {
        // Suppression de l'élément du tableau
        array.splice(indexToRemove, 1);
    }

    // Retourner le tableau modifié
    return array;
}
  navigateTo(url: string, id1: string ,id2:string): void {
    // Construire l'URL avec l'ID en tant que paramètre
    const fullUrl = `${url}?idinv=${id1}&idplayer=${id2}`;
    
    // Naviguer vers l'URL construite
    this.router.navigateByUrl(fullUrl);
  } 
  sendInvitation(toUserId: string): void {
    this.invitationService.sendInvitation(toUserId, this.token).subscribe({
      next: response => {
        console.log('Invitation sent:', response);
        this.idrouter=response.data._id;
        this.idplayer=response.data.from;
        this.websocketService.sendMessage(response)

        // Gérer la réponse comme nécessaire
      },
      error: error => {
        console.error('Error sending invitation:', error);
        // Gérer l'erreur comme nécessaire
      }
    });
  }

  acceptInvitation(invitation: any): void {
    this.invitationService.acceptInvitation(invitation._id).subscribe({
      next: response => {
        console.log('Invitation accepted:', response);
        this.idrouter=invitation._id;
        this.idplayer=invitation.to;
        this.websocketService.sendMessage(response)
        // this.navigateTo('playwithfriends');
      },
      error: error => {
        console.error('Error accepting invitation:', error);
        // Gérer l'erreur comme nécessaire
      }
    });
  }

  loadInvitations(): void {
    this.invitationService.getInvitations(this.toUserId).subscribe({
      next: invitations => {
        this.invitations = invitations;
        console.log('Invitations:', this.invitations);
        this.inv = true;
      },
      error: error => {
        console.error('Error fetching invitations:', error);
      }
    });
  }

  declineInvitation(invitationId:string) {
    this.invitationService.declineInvitation(invitationId).subscribe(
      response => {
        console.log('Invitation declined successfully:', response);
        this.loadInvitations();
        // Gérer la réponse ou rediriger l'utilisateur après le refus de l'invitation
      },
      error => {
        console.error('Error declining invitation:', error);
        // Gérer l'erreur
      }
    );
  }
}