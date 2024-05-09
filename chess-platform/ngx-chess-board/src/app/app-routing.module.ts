import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { PlaywithfriendsComponent } from './playwithfriends/playwithfriends.component';
import { PlaywithbotComponent } from './playwithbot/playwithbot.component';
import { HomeComponent } from './home/home.component';
import { PuzzlesComponent } from './puzzles/puzzles.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AccountComponent } from './account/account.component';
import { AuthGuard } from './auth.guard'; // Import the AuthGuard
import { AdmindashboardComponent } from './admindashboard/admindashboard.component';
import { AdminAuthGuard } from './admin-auth.guard';
import { AllUserConnectedComponent } from './all-user-connected/all-user-connected.component';

const routes: Routes = [
  { 
    path: 'account', 
    component: AccountComponent, 
    canActivate: [AuthGuard] // Apply the AuthGuard to the AccountComponent route
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirect to home page on root path
  { path: 'home', component: HomeComponent }, // Define the path as 'home', without a leading slash
  { path: 'login', component: LoginComponent },
  { path: 'playwithfriends', component: PlaywithfriendsComponent }, // Define other paths similarly
  { path: 'playwithbot', component: PlaywithbotComponent },
  { path: 'puzzles', component: PuzzlesComponent},
  { path: 'sign-up', component: SignUpComponent},
  { path: 'admindashboard', component: AdmindashboardComponent, canActivate: [AdminAuthGuard] },
  { path: 'alluserconnected',component: AllUserConnectedComponent}
];

@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    CommonModule,
    FormsModule, // Import FormsModule here
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
