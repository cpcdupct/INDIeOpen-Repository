import { FormControl } from '@angular/forms';

export function maxLengthName(ctr: FormControl) {
    const name = ctr.value;
    let valid = true;
    if (name.length > 80) {
        valid = false;
    }
    return valid
        ? null
        : {
              maxLengthName: {
                  valid: false,
              },
          };
}
