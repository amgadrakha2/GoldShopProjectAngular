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
    // Reset error and success messages
    this.errorMessage = '';
    this.message = '';

    // Validate general inputs
    if (!this.validateInputs()) {
      this.errorMessage = 'يرجى ملء جميع الحقول المطلوبة بشكل صحيح.';
      return;
    }

    // Validate phone number
    if (!this.validatePhoneNumber()) {
      this.errorMessage = 'يجب إدخال 11 رقمًا.'; // Arabic message for 11 digits
      return;
    }

    this.isLoading = true; // Start loading

    this.userService.register(this.user).subscribe({
      next: (response) => {
        this.message = 'تم التسجيل بنجاح! يتم التوجيه إلى صفحة تسجيل الدخول...';
        console.log(response.message);
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000); // Delay navigation to show the success message
      },
      error: (err) => {
        console.error('Error:', err);
        this.errorMessage = err?.error?.message || 'حدث خطأ غير متوقع.';
      },
      complete: () => {
        this.isLoading = false; // Stop loading
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
