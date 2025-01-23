import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../../services/userservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  message = '';

  constructor(private userService: UserService, private router: Router) {}

  login(): void {
    if (this.form.invalid) {
      this.message = 'Please fill in all required fields.';
      return;
    }

    const { username, password } = this.form.value;

    this.userService.login(username, password).subscribe({
      next: (response) => {
        // Store token in localStorage
        localStorage.setItem('authToken', response.token);

        // Navigate to the home page
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.message = `Login failed: ${err.error?.message || 'An unexpected error occurred.'}`;
      },
    });
  }
}
