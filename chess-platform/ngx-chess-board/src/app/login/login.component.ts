import { Component, OnInit } from "@angular/core";
import { UsersService } from '../users.service';
import { Router } from '@angular/router';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  userData: { email: string, password: string };

  constructor(private userService: UsersService, private router: Router) {}
  navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }
     login() {
    this.userService.login(this.userData.email, this.userData.password)
      .subscribe(
        (response: any) => {
          localStorage.setItem('token', response.token);
          console.log('User role:', response.user.role);
          if (response.user && response.user.role === 'admin') {
            console.log('Redirecting admin to admin dashboard');
            this.router.navigate(['/admindashboard']);
          } else {
            console.log('Redirecting regular user to account page');
            this.router.navigate(['/account']);
          }
        },
        (error) => {
          console.error('Error logging in:', error);
          alert('Invalid email or password. Please try again.');
        }
      );
  }
  ngOnInit() {
    // Initialize userData object
    this.userData = { email: '', password: '' };
  }
}
