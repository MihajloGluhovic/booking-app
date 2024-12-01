import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserInterface } from '../../auth/interfaces/user.interface';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,

    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  user: UserInterface | undefined | null;
  token: string | undefined | null;
  passwordForm: FormGroup;
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // Initialize the password form with matching validation
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(5)]],
        confirmNewPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator() }
    );
  }

  ngOnInit(): void {
    this.authService.checkToken().subscribe((tokenStatus) => {
      if (tokenStatus === 'invalid' || tokenStatus === 'noToken') {
        this.router.navigate(['/login']); // Redirect for invalid or missing token
        console.log('Redirecting to login: Token expired or missing');
        return;
      }

      // Retrieve the token
      this.token = this.authService.getToken();

      // Load user details
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.user = JSON.parse(storedUser) as UserInterface;
      } else {
        console.error('User data not found in localStorage');
      }
    });
  }

  // Custom validator for password matching
  private passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const newPassword = control.get('newPassword');
      const confirmPassword = control.get('confirmNewPassword');

      if (newPassword?.value && confirmPassword?.value) {
        const match = newPassword.value === confirmPassword.value;
        return match ? null : { passwordMismatch: true };
      }
      return null;
    };
  }

  // Show error snackbar
  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar'],
    });
  }

  // Show success snackbar
  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar'],
    });
  }

  // Change password function
  changePassword(): void {
    if (this.passwordForm.invalid) {
      if (this.passwordForm.errors?.['passwordMismatch']) {
        this.showError('New passwords do not match');
      }
      return;
    }

    const { currentPassword, newPassword, confirmNewPassword } =
      this.passwordForm.value;

    this.authService
      .changePassword({ currentPassword, newPassword, confirmNewPassword })
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
          this.showSuccess('Password changed successfully!');
          this.passwordForm.reset();
        },
        error: (err) => {
          let errorMessage = 'An error occurred while changing the password';

          // Handle specific error messages from backend
          if (err.error?.message) {
            switch (err.error.message) {
              case 'Current password is incorrect':
                errorMessage = 'The current password you entered is incorrect';
                break;
              case 'New password cannot be the same as current password':
                errorMessage =
                  'Your new password must be different from your current password';
                break;
              default:
                errorMessage = err.error.message;
            }
          }

          this.showError(errorMessage);
        },
      });
  }

  // Deactivate account function

  deactivateAccount() {
    if (confirm('Are you sure you want to deactivate your account?')) {
      this.authService.deactivateAccount().subscribe({
        next: (message) => {
          console.log('Account deactivated:', message); // The message will be plain text like "Account deactivated successfully"

          // Log out the user
          this.authService.logout();

          // Navigate to the home page
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Failed to deactivate account:', err);
        },
      });
    }
  }

  togglePassword(field: 'current' | 'new' | 'confirm'): void {
    switch (field) {
      case 'current':
        this.hideCurrentPassword = !this.hideCurrentPassword;
        break;
      case 'new':
        this.hideNewPassword = !this.hideNewPassword;
        break;
      case 'confirm':
        this.hideConfirmPassword = !this.hideConfirmPassword;
        break;
    }
  }
}
