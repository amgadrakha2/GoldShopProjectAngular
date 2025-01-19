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
    if (!this.validateInputs()) {
      this.errorMessage = 'Please fill all required fields.';
      return;
    }

    this.isLoading = true; // Start loading

    this.userService.register(this.user).subscribe({
      next: (response) => {
        this.message = 'Registration successful! Redirecting to login...';
        console.log(response.message);
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000); // Delay navigation to show the success message
      },
      error: (err) => {
        console.error('Error:', err);
        this.errorMessage = err?.error?.message || 'An unexpected error occurred.';
      },
      complete: () => {
        this.isLoading = false; // Stop loading
      },
    });
  }

  private validateInputs(): boolean {
    return this.user.userName.trim() !== '' && this.user.password.trim() !== '' && this.user.phoneNumber.trim() !== '';
  }
}
