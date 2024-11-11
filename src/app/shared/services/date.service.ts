import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DateService {
  formatDate(dateString: string): string {
    const date = new Date(dateString); // Convert the string into a Date object
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get month (add 1 since months are 0-indexed)
    const day = date.getDate().toString().padStart(2, '0'); // Ensure two digits for day

    return `${year}-${month}-${day}`; // Return in YYYY MM DD format
  }
}
