import { Directive, ElementRef, HostListener, Input } from '@angular/core';

/**
 * Set the display property directive
 */
@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[setDisplayDirectives]',
})
export class SetDisplayDirective {
    @Input('setDisplayDirectives') setDisplay!: string;

    constructor(private _elementRef: ElementRef) {}

    @HostListener('click') click() {
        this.show(undefined);
    }

    private show(hide: string = 'none') {
        this._elementRef.nativeElement.style.display = hide;
    }
}
