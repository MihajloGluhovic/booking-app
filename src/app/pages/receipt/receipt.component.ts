import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-receipt',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    DatePipe,
    CurrencyPipe,
  ],
  templateUrl: './receipt.component.html',
  styleUrl: './receipt.component.css',
})
export class ReceiptComponent {
  reservation = {
    description: 'Ocean View Room',
    startDate: new Date('2024-12-01'),
    endDate: new Date('2024-12-10'),
    roomNum: '101A',
    totalPrice: 1200,
  };
}
