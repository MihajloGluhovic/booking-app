import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ConfirmDialogComponent,

    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
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
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Form submitted successfully');
      this.authService.login(this.loginForm.value).subscribe(
        (user) => {
          if (user.isActive === true) {
            // User is active, proceed with login
            this.authService.storeUser(user);
            this.authService.isAuthenticatedSubject.next(true);
            this.router.navigate(['/home']);
          } else {
            // User is inactive, save data in storeUser
            console.log('Account is inactive', user);
            this.authService.storeUser(user);
            const dialogRef = this.dialog.open(ConfirmDialogComponent, {
              data: {
                title: 'Activate Account',
                message:
                  'This account is deactivated. Would you like to activate it?',
              },
            });

            dialogRef.afterClosed().subscribe((result) => {
              if (result === true) {
                this.authService.activateAccount();
              } else {
                console.log('User chose not to activate the account');
              }
            });
          }
        },
        (error) => {
          console.error('Login error:', error);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}
