import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Custom validator function

export function dateRangeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const startDate = control.get('startDate')?.value;
    const endDate = control.get('endDate')?.value;

    if (startDate && endDate && startDate > endDate) {
      return { dateRangeInvalid: true };
    }
    return null;
  };
}
