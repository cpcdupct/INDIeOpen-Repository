import { FormControl } from '@angular/forms';

export function maxLengthGroups(ctr: FormControl) {
    const groups = ctr.value;
    let valid = true;
    if (groups.length > 250) {
        valid = false;
    }
    return valid
        ? null
        : {
              maxLengthGroups: {
                  valid: false,
              },
          };
}
