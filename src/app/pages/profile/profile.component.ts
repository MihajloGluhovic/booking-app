import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

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

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    // Initialize the password form
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(5)]],
      confirmNewPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.authService.checkToken().subscribe((tokenStatus) => {
      if (tokenStatus === 'invalid' || tokenStatus === 'noToken') {
        this.router.navigate(['/login']); // Redirect for invalid or missing token
        console.log('Redirecting to login: Token expired or missing');
        return;
      }
      this.token = this.authService.getToken();
    });
  }

  // Change password function
  changePassword(): void {
    if (this.passwordForm.invalid) {
      console.error('Form is invalid');
      return;
    }

    const { currentPassword, newPassword, confirmNewPassword } =
      this.passwordForm.value;

    if (newPassword !== confirmNewPassword) {
      console.error('Passwords do not match');
      return;
    }

    // Call service to change the password
    this.authService
      .changePassword({ currentPassword, newPassword, confirmNewPassword })
      .subscribe({
        next: () => {
          console.log('Password changed successfully');
          this.passwordForm.reset();
        },
        error: (err) => {
          console.error('Failed to change password:', err);
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
}
