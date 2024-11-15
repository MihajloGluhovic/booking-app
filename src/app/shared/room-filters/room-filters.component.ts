import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-room-filters',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,

    ReactiveFormsModule,

    MatButtonModule,
    MatPseudoCheckboxModule,
    MatCheckboxModule,
  ],
  templateUrl: './room-filters.component.html',
  styleUrl: './room-filters.component.css',
})
export class RoomFiltersComponent {
  private readonly _formBuilder = inject(FormBuilder);

  filters: string[] = ['Sea view', 'Single', 'Double', 'Suite', 'Deluxe'];

  readonly roomFilters = this._formBuilder.group({
    'Sea view': false,
    Single: false,
    Double: false,
    Suite: false,
    Deluxe: false,
  });
}
