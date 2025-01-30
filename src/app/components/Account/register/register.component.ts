import { Component } from '@angular/core';
import { UserService } from '../../../services/userservice.service';
import { User } from '../../../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  user: User = { id: 0, phoneNumber: '', userName: '', password: '' };
  errorMessage: string = '';
  message: string = '';
  isLoading: boolean = false;

  constructor(private userService: UserService, private router: Router) {}

  registerUser(): void {
    this.errorMessage = '';
    this.message = '';

    if (!this.validateInputs()) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    if (!this.validatePhoneNumber()) {
      this.errorMessage = 'Please enter 11 digits.';
      return;
    }

    this.isLoading = true;

    this.userService.register(this.user).subscribe({
      next: (response) => {
        this.message = 'Registration successful! Redirecting to login page...';
        console.log(response.message);
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        console.error('Error:', err);
        this.errorMessage = err?.error?.message || 'An unexpected error occurred.';
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  private validateInputs(): boolean {
    return (
      this.user.userName.trim() !== '' &&
      this.user.password.trim() !== '' &&
      this.user.phoneNumber.trim() !== ''
    );
  }

  private validatePhoneNumber(): boolean {
    const phoneNumber = this.user.phoneNumber.trim();
    return phoneNumber.length === 11 && /^\d+$/.test(phoneNumber);
  }
}
