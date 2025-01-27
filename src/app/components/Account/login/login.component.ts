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
    // Listen for input changes in the form fields
    this.form.valueChanges.subscribe(() => {
      if (this.isLoading) {
        this.isLoading = false; // Stop loading if user starts typing
      }
    });
  }

  login(): void {
    console.log('Login method called'); // Debugging
    this.message = '';

    if (this.form.invalid) {
      console.log('Form is invalid'); // Debugging
      this.message = 'يرجى ملء جميع الحقول المطلوبة.';
      return;
    }

    this.isLoading = true; // Start loading
    console.log('Loading started'); // Debugging

    const { username, password } = this.form.value;

    this.userService.login(username, password).subscribe({
      next: (response) => {
        console.log('Login successful', response); // Debugging
        localStorage.setItem('authToken', response.token);
        this.message = 'تم تسجيل الدخول بنجاح.';
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Login error', err); // Debugging
        if (err.error?.message === 'اسم المستخدم غير موجود.') {
          this.message = 'اسم المستخدم غير موجود.';
        } else if (err.error?.message === 'كلمة المرور غير صحيحة.') {
          this.message = 'كلمة المرور غير صحيحة.';
        } else {
          this.message = 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';
        }
      },
      complete: () => {
        console.log('Login complete'); // Debugging
        this.isLoading = false; // Stop loading
      },
    });
  }
}
