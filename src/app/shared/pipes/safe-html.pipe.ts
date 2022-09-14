import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to bypass the html sanitazion process of a string
 */
@Pipe({ name: 'safehtml' })
export class SafeHtmlPipe implements PipeTransform {
    constructor(private sanitized: DomSanitizer) {}

    /**
     * Bypass the html security for a text and returns it in a html string
     *
     * @param value Text to bypass
     */
    transform(value: string): SafeHtml {
        return this.sanitized.bypassSecurityTrustHtml(value);
    }
}
