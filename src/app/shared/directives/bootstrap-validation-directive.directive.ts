import { Directive, HostBinding, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

/**
 * Validation directive needed for form validation in Bootstrap and showing css classes in form-groups
 */
@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[formControlName],[formControl]',
})
export class BootstrapValidationCssDirective {
    constructor(@Self() private cd: NgControl) {}

    /**
     * Return wether the form control is invalid
     */
    @HostBinding('class.is-invalid')
    get isInvalid(): boolean {
        const control = this.cd.control;
        return control ? control.invalid && control.touched : false;
    }

    /**
     * Return wether the form control is valid
     */
    @HostBinding('class.is-valid')
    get isValid(): boolean {
        const control = this.cd.control;
        return control ? control.valid && control.touched : false;
    }
}
