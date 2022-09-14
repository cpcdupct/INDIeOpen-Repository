import { FormControl } from '@angular/forms';

const validUrl = 'https://MYDOMAIN.es';

export function validateURL(ctr: FormControl) {
    const url = ctr.value;

    const valid = isMediaUrl(url);

    return valid
        ? null
        : {
              validateURL: {
                  valid: false,
              },
          };
}

function isMediaUrl(urlToTest: string) {
    try {
        const url = new URL(urlToTest);
        const filename = url.pathname.split('?')[0];
        return validUrl.indexOf(filename) >= 0;
    } catch (TypeError) {
        return false;
    }
}

export function maxLengthTitle(ctr: FormControl) {
    const title = ctr.value;
    let valid = true;
    if (title.length > 255) {
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
