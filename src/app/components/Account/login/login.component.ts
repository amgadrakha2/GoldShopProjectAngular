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
  isLoading: boolean = false;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.form.valueChanges.subscribe(() => {
      if (this.isLoading) {
        this.isLoading = false;
      }
    });
  }

  login(): void {
    this.message = '';

    if (this.form.invalid) {
      this.message = 'Please fill in all required fields.';
      return;
    }

    this.isLoading = true;

    const { username, password } = this.form.value;

    this.userService.login(username, password).subscribe({
      next: (response) => {
        localStorage.setItem('authToken', response.token);
        this.message = 'Login successful.';
        this.router.navigate(['/home']);
      },
      error: (err) => {
        if (err.error?.message === 'Username not found.') {
          this.message = 'Username not found.';
        } else if (err.error?.message === 'Incorrect password.') {
          this.message = 'Incorrect password.';
        } else {
          this.message = 'An unexpected error occurred. Please try again.';
        }
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
