import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe that transform a linebreak into a HTML-compatible code
 */
@Pipe({
    name: 'prettyPrint',
})
export class PrettyPrintPipe implements PipeTransform {
    /**
     * Transform every linebreak in the string into html code
     *
     * @param str Text with line breaks
     */
    transform(str?: string) {
        if (str) return str.replace(/(?:\r\n|\r|\n)/g, '<br /> <br />');
        return str;
    }
}
