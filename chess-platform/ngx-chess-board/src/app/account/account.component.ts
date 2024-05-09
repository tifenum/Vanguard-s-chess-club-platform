import { Component, OnInit,ViewChild} from '@angular/core';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { Chess } from 'chess.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  imports: [CommonModule],
  standalone : true,
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  chess: Chess;
  public chesscom: string = '';
  user: any = {
    name: '',
    lastname: '',
    phone: '',
    email: '',
    password: '',
    chess: '',
    c_password: '',
    image: '',
    role: 'user' // Set default role to 'user'
  };
  public userData: any; // Define the userData property
  selectedImage: string | ArrayBuffer | null = null;
  userId: string | null;

image: any; 
selectImage(e:any){
  this.image=e.targer.files[0];
  console.log(this.image);
}

  // Method triggered when an image is selected
  onImageSelected(event: any): void {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Store the selected image data
        this.selectedImage = e.target?.result;
        // Send the image data to the backend for saving
        this.userService.saveUserImage(file).subscribe(
          (response: any) => {
            // Update the user data with the image URL received from the backend
            this.user.image = response.imageURL;
          },
          (error) => {
            console.error('Error saving user image:', error);
          }
        );
      };
      reader.readAsDataURL(file); // Read the selected file as a data URL
    }
  }
  constructor(private userService: UsersService, private router: Router,private http: HttpClient) { }
//   ngOnInit(): void {
//     // You can retrieve user data from an API or any other source here
//     // For demonstration purposes, let's assume user data is stored in local storage
//     const userDataString = localStorage.getItem('userData');
//     if (userDataString) {
//       this.user = JSON.parse(userDataString);
//     } else {
//       // Handle case where user data is not available
//     }
//   }

logoutUser() {
  this.userService.logout(this.userId).subscribe(
    () => {
      // Gérer le succès de la déconnexion
      console.log('Logged out successfully');
      // Rediriger l'utilisateur vers la page de connexion ou autre page appropriée
    },
    (error) => {
      // Gérer les erreurs de déconnexion
      console.error('Logout failed:', error);
    }
  );
}
  logout() {
    // Clear JWT token from local storage
    this.logoutUser();
    localStorage.removeItem('token');
 
    // Redirect to login page
    this.router.navigate(['/login']);
  }

      navigateTo(route: string) {
  this.router.navigateByUrl(route);
}


ngOnInit(): void {
  // Fetch user data from the backend when the component initializes
  this.userService.getUserData().subscribe(
    (userData1: any) => {
      this.userData = userData1; // Assign the fetched user data to userData
      this.user = userData1;
      this.chesscom = userData1.chess;
      console.log(this.userData.attachments);
      this.userId = this.userService.getUserIdFromToken();

    },  
    (error) => {
      console.error('Error fetching user data:', error);
    }
    
  );
}
    analysefromchesscom() {
        this.http.post<any>('http://localhost:3000/api/chessusername', { chessusername : this.chesscom}).subscribe(
          response => {
            console.log('PGN parsing response:', response);
            // Handle response from the server as needed
            window.location.href = 'http://localhost:4000/chessusername';
          },
          error => {
            console.error('Error parsing PGN:', error);
            // Handle error
          }
        );
      }

  // selectImage(): void {
  //   const fileInput = document.getElementById('accountImage') as HTMLInputElement;
  //   if (fileInput) {
  //     fileInput.click();
  //   }
  // }
  
}
  



