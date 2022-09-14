import { FormControl, FormGroup, ValidationErrors } from '@angular/forms';

const validFileExtensions = ['jpg', 'png', 'jpeg'];
const origins = ['MY_ORIGIN.domain'];

export function validateCoverURL(ctr: FormControl) {
    const url = ctr.value;

    const valid = isImageURL(url);

    return valid
        ? null
        : {
              validateCoverURL: {
                  valid: false,
              },
          };
}

function isImageURL(urlToTest: string) {
    try {
        const url = new URL(urlToTest);
        const filename = url.pathname.split('/').reverse()[0];
        const ext = filename.split('.')[1].toLowerCase();
        return validFileExtensions.indexOf(ext) >= 0;
    } catch (TypeError) {
        return false;
    }
}

export function validateINDIeMediaURL(ctr: FormControl) {
    const url = ctr.value;

    const valid = isINDIeMediaURL(url);

    return valid
        ? null
        : {
              validateINDIeMediaURL: {
                  valid: false,
              },
          };
}

export function safePassword(ctr: FormControl) {
    const password = ctr.value as string;

    let safe = true;
    const minlength = 8;
    const maxlength = 24;
    const lowerLetters = /[a-z]+/.test(password);
    const upperLetters = /[A-Z]+/.test(password);
    const numbers = /[0-9]+/.test(password);

    const flags = [lowerLetters, upperLetters, numbers];

    let passedMatches = 0;
    for (const flag of flags) {
        passedMatches += flag === true ? 1 : 0;
    }

    if (passedMatches !== flags.length) safe = false;

    if (password) {
        if (password.length < minlength || password.length > maxlength) safe = false;
    }

    return safe
        ? null
        : {
              safePassword: {
                  valid: false,
              },
          };
}

function isINDIeMediaURL(urlToTest: string) {
    try {
        const url = new URL(urlToTest);
        const domain = url.hostname;
        return origins.indexOf(domain) >= 0;
    } catch (TypeError) {
        return false;
    }
}

export function MustMatch(
    controlName: string,
    matchingControlName: string
): ValidationErrors | null {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return null;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
            return { mustMatch: true };
        } else {
            matchingControl.setErrors(null);
            return null;
        }
    };
}

export function maxLengthTitle(ctr: FormControl) {
    const title = ctr.value;
    let valid = true;
    if (title.length > 100) {
        valid = false;
    }
    return valid
        ? null
        : {
              maxLengthTitle: {
                  valid: false,
              },
          };
}

export function maxLengthDesc(ctr: FormControl) {
    const desc = ctr.value;
    let valid = true;
    if (desc.length > 200) {
        valid = false;
    }
    return valid
        ? null
        : {
              maxLengthDesc: {
                  valid: false,
              },
          };
}
