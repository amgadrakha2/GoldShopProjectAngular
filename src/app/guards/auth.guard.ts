import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('authToken');

  if (token) {
    return true; // Allow navigation if the token exists
  } else {
    router.navigate(['/login']); // Redirect to login if not authenticated
    return false;
  }
}
