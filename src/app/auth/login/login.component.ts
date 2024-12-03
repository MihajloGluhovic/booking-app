import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../services/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,

    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSnackBarModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (user) => {
          if (user.isActive) {
            this.authService.storeUser(user);
            this.authService.isAuthenticatedSubject.next(true);
            this.router.navigate(['/home']);
            this.snackBar.open('Welcome back!', 'Close', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['success-snackbar'],
            });
          } else {
            console.log('Account is inactive', user);
            this.authService.storeUser(user); // Store inactive user

            const dialogRef = this.dialog.open(ConfirmDialogComponent, {
              data: {
                title: 'Activate Account',
                message:
                  'This account is deactivated. Would you like to activate it and log in?',
              },
            });

            dialogRef.afterClosed().subscribe((result) => {
              if (result === true) {
                // Trigger account activation
                this.authService.activateAccount(this.loginForm.value);
              } else {
                console.log('User chose not to activate the account');
              }
            });
          }
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Invalid email or password', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['error-snackbar'],
          });
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
