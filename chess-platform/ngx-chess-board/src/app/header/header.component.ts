// import { Component } from '@angular/core';
// <<<<<<< HEAD
// import { Router, RouterLink } from '@angular/router';
// =======
// >>>>>>> origin/master

// @Component({
//   selector: 'app-header',
//   standalone: true,
//   imports: [],
//   templateUrl: './header.component.html',
//   styleUrl: './header.component.scss'
// })
// export class HeaderComponent {
// <<<<<<< HEAD
//   constructor(private router: Router) { }
 
//   navigateToSignUp(event: Event) {
//     event.preventDefault(); // Prevent the default behavior of the anchor element
//     this.router.navigateByUrl('/sign-up');
//   }
//   navigateToLogIn(event: Event) {
//     event.preventDefault(); // Prevent the default behavior of the anchor element
//     this.router.navigateByUrl('/login');
//   }
// =======

// >>>>>>> origin/master
// }
import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Adjusted import statement

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'] // Adjusted styleUrl to styleUrls
})
export class HeaderComponent {
  constructor(private router: Router) { }

  navigateToSignUp(event: Event) {
    event.preventDefault(); // Prevent the default behavior of the anchor element
    this.router.navigateByUrl('/sign-up');
  }

  navigateToLogIn(event: Event) {
    event.preventDefault(); // Prevent the default behavior of the anchor element
    this.router.navigateByUrl('/login');
  }
}
