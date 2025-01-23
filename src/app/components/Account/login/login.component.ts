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
      this.message = 'يرجى ملء جميع الحقول المطلوبة.';
      return;
    }

    const { username, password } = this.form.value;

    this.userService.login(username, password).subscribe({
      next: (response) => {
        // Store token in localStorage
        localStorage.setItem('authToken', response.token);

        // Display success message
        this.message = 'تم تسجيل الدخول بنجاح.';

        // Navigate to the home page
        this.router.navigate(['/home']);
      },
      error: (err) => {
        // Handle different error messages based on the server response
        if (err.error?.message === 'Username not found') {
          this.message = 'اسم المستخدم غير موجود.';
        } else if (err.error?.message === 'Incorrect password') {
          this.message = 'كلمة المرور غير صحيحة.';
        } else {
          this.message = 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';
        }
      },
    });
  }
}
