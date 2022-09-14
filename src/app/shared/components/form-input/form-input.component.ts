import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { InputData } from '../../models';

/**
 * Generic input for all inputs inside a form in INDIe
 */
@Component({
    selector: 'io-form-input',
    template: '',
})
export class FormInputComponent implements OnInit {
    /**
     * Input data
     */
    @Input()
    public data!: InputData;

    /**
     * Input change event
     */
    @Output()
    public inputChange = new EventEmitter<string>();

    constructor() {}

    ngOnInit(): void {}

    /**
     * Translate key
     *
     * @param key i18n key
     */
    public translateKey(key: string) {
        return this.data.component + '.form.' + this.data.name + '.' + key;
    }

    /**
     * Get form errors
     */
    public showError() {
        return this.data.control?.errors;
    }

    /**
     * Show form feedback
     */
    public showOkFeedback() {
        return this.data.control?.valid;
    }
}
