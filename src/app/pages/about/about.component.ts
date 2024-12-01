import { Component } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AsyncPipe, CommonModule } from '@angular/common';
import { Observable, Observer } from 'rxjs';

export interface ExampleTab {
  label: string;
  content: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule,

    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatTabsModule,
    MatProgressSpinnerModule,

    AsyncPipe,
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent {
  asyncTabs: Observable<ExampleTab[]>;

  constructor() {
    this.asyncTabs = new Observable((observer: Observer<ExampleTab[]>) => {
      setTimeout(() => {
        observer.next([
          {
            label: 'I',
            content:
              'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?cs=srgb&dl=pexels-pixabay-261102.jpg&fm=jpg',
          },
          {
            label: 'II',
            content:
              'https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aG90ZWx8ZW58MHx8MHx8fDA%3D',
          },
          {
            label: 'III',
            content:
              'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?cs=srgb&dl=pexels-thorsten-technoman-109353-338504.jpg&fm=jpg',
          },
        ]);
      }, 1000);
    });
  }

  aboutUs = {
    title: 'Welcome to Hotel Rikebo',
    subtitle: 'Luxury at its Best',
    description:
      'Hotel Rikebo offers an exceptional stay with top-notch services. Our aim is to provide comfort and luxury for all our guests, whether for business or leisure.',
  };

  services = [
    '24/7 Room Service',
    'Complimentary Wi-Fi',
    'Outdoor Pool & Spa',
    'Conference Rooms',
    'Luxury Dining Options',
    'Airport Shuttle Service',
    'Event Planning Services',
  ];
}

export interface Soba {
  id: number;
  name: string;
  rating: number;
}
