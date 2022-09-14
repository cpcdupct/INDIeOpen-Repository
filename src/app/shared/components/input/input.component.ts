import { Component, OnInit } from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';

import { FormInputComponent } from '../form-input/form-input.component';

/**
 * Input component for forms
 */
@Component({
    selector: 'io-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss'],
    viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class InputComponent extends FormInputComponent implements OnInit {
    constructor() {
        super();
    }

    ngOnInit(): void {}

    /**
     * Input change event listener
     *
     * @param event Event instance
     */
    onChange(event: any) {
        this.inputChange.emit(event.target.value);
    }
}
