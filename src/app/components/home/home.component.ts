import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(private router: Router) {}

  logout(): void {
    // Clear any stored authentication tokens (if applicable)
    localStorage.clear();
    // Navigate back to the login page
    this.router.navigate(['/login']);
  }
}
