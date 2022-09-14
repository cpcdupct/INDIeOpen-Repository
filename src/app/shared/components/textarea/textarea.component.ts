import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';

import { FormInputComponent } from '../form-input/form-input.component';

/**
 * Input text area component for forms
 */
@Component({
    selector: 'io-textarea',
    templateUrl: './textarea.component.html',
    styleUrls: ['./textarea.component.scss'],
    viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class TextareaComponent extends FormInputComponent implements OnInit {
    /** Default input rows */
    private defaultRows = 3;

    /** User provided rows */
    @Input()
    rows!: number;

    constructor() {
        super();
        if (!this.rows) this.rows = this.defaultRows;
    }

    ngOnInit(): void {}
}
