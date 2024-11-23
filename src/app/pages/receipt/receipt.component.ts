import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { RoomService } from '../../shared/services/rooms.service';
import { Receipt } from '../../shared/interfaces/receipt.interface';
import { MatSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-receipt',
  standalone: true,
  imports: [
    CommonModule,

    MatSpinner,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    DatePipe,
    CurrencyPipe,
  ],
  templateUrl: './receipt.component.html',
  styleUrl: './receipt.component.css',
})
export class ReceiptComponent implements OnInit {
  receipt!: Receipt | null;
  features: { name: string; price: string }[] = [];

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService
  ) {}

  ngOnInit(): void {
    const bookingId = this.route.snapshot.paramMap.get('bookingId');
    if (bookingId) {
      this.roomService.getReceiptByBookingId(bookingId).subscribe({
        next: (data) => {
          this.receipt = data;
          this.parseFeatures();
        },
        error: (error) => {
          console.error('Error fetching receipt:', error);
          this.receipt = null;
        },
      });
    }
  }

  parseFeatures(): void {
    if (this.receipt) {
      const names = this.receipt.featureNames.split(',');
      const prices = this.receipt.featurePrices.split(',');

      this.features = names.map((name, index) => ({
        name: name.trim(),
        price: prices[index]?.trim() || '0.00',
      }));
    }
  }
}
