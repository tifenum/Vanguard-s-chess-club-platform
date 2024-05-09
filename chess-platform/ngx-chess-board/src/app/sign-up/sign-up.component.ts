import { Component } from '@angular/core';
import { UsersService } from '../users.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule,FormsModule],
  providers: [DatePipe], // Add DatePipe to the providers array
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  constructor(private userService: UsersService,private router: Router,private http : HttpClient,private datePipe: DatePipe,
  ) { }
  dueDate: String = '';
  userData: any = {
    name: '',
    lastname: '',
    phone: '',
    email: '',
    password: '',
    c_password: '',
    chess: '',
    image: '',
    role: 'user', // Set default role to 'user'
    attachements: null // To store the selected file
  };
  submitSignUpForm() {
    // Process sign-up data here
    // Once sign-up is successful, redirect to the login page
    this.router.navigate(['/login']);
  }
  // Update your component class to handle the file input
  handleFileInput(event: any) {
    this.userData.attachments = event.target.files[0];
  console.log(this.userData.profilePhoto);
}


// onDueDateChange(event: any) {
//   const selectedDateStr: string = event.target.value;
//   const datePart: string = selectedDateStr.substring(0, 10);
//   this.dueDate = datePart;
//   console.log(this.dueDate);
// }
// handleFileInput(event: any) {
//   this.userData.attachments = event.target.files[0];
// }

signUp() {
  const formData = new FormData();
  formData.append('name', this.userData.name);
  formData.append('lastname', this.userData.lastname);
  formData.append('email', String(this.userData.email));
  formData.append('phone', this.userData.phone);
  formData.append('password', this.userData.password);
  formData.append('c_password', this.userData.c_password);
  formData.append('chess', this.userData.chess);
  formData.append('role', this.userData.role);
  // formData.append('creater', String(this.creater));
  console.log(this.userData.attachments);
  if (this.userData.attachments) {
    formData.append('attachments', this.userData.attachments);
  }


    this.userData.role = this.userData.role || 'user'; // Default to 'user' if role is not selected
    // this.userService.registerUser(formData)
    //   .subscribe(
    //     (response) => {
    //       console.log('User registered successfully:', response);
    //       this.submitSignUpForm();
    //       // Optionally, you can redirect the user to another page or show a success message
    //     },
    //     (error) => {
    //       console.error('Error registering user:', error);
    //       // Handle error response here, such as displaying an error message to the user
    //     }
    //   );
    this.userService.registerUser(formData)
      .subscribe(
        (response) => {
          console.log('User registered successfully:', response);
          this.submitSignUpForm();
          // Optionally, you can redirect the user to another page or show a success message
        },
        (error) => {
          console.error('Error registering user:', error);
          // Handle error response here, such as displaying an error message to the user
        }
      );
    // this.http.post('http://localhost:3000/api/register', formData).subscribe(
    //   (response: any) => {
    //     this.router.navigate(['/account']);
    //     console.log(formData.get('attachement'));
    //     console.log('Task created successfully:', response);
    //   },
    //   (error: any) => {
    //     console.error('Task creation failed:', error);
    //   }
    // );








    // this.http.post('http://localhost:3000/task/createtask', formData).subscribe(
    //   (response: any) => {
    //     this.router.navigate(['/home']);
    //     console.log('Task created successfully:', response);
    //   },
    //   (error: any) => {
    //     console.error('Task creation failed:', error);
    //   }
    // );
} 
  // signUp() {
  //   // Set the role based on the selected option
  //   this.userData.role = this.userData.role || 'user'; // Default to 'user' if role is not selected
  //   this.userService.registerUser(this.userData)
  //     .subscribe(
  //       (response) => {
  //         console.log('User registered successfully:', response);
  //         this.submitSignUpForm();
  //         // Optionally, you can redirect the user to another page or show a success message
  //       },
  //       (error) => {
  //         console.error('Error registering user:', error);
  //         // Handle error response here, such as displaying an error message to the user
  //       }
  //     );
  // }
  
}
