// admin-auth.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(): boolean {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }
    // Perform additional checks if needed
    return true;
  }
}
