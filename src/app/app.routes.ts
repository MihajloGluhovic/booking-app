import { Routes } from '@angular/router';
import { ContactComponent } from './pages/contact/contact.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RoomDetailsComponent } from './pages/room-details/room-details.component';
import { ReceiptComponent } from './pages/receipt/receipt.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'room/:slug', component: RoomDetailsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'receipt', component: ReceiptComponent },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
];
