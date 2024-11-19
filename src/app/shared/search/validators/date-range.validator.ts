import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateRangeValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const startDate = group.get('startDate')?.value;
    const endDate = group.get('endDate')?.value;
    const today = new Date().setHours(0, 0, 0, 0); // Current date as a number

    if (startDate) {
      const start = new Date(startDate).getTime(); // Convert startDate to a number
      if (start < today) {
        return { startDateInvalid: true }; // Start date is before today
      }
    }

    if (startDate && endDate) {
      const start = new Date(startDate).getTime(); // Convert startDate to a number
      const end = new Date(endDate).getTime(); // Convert endDate to a number
      if (start >= end) {
        return { dateRangeInvalid: true }; // Start date is after end date
      }
    }

    return null; // No errors
  };
}

// export function dateRangeValidator(): ValidatorFn {
//   return (control: AbstractControl): ValidationErrors | null => {
//     const startDate = control.get('startDate')?.value;
//     const endDate = control.get('endDate')?.value;

//     if (startDate && endDate && startDate >= endDate) {
//       return { dateRangeInvalid: true };
//     }
//     return null;
//   };
// }
