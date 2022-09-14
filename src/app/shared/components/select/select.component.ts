import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { OptionItem, OptionWrapper } from '../../models';
import { FormInputComponent } from '../form-input/form-input.component';

/**
 * Input select component for forms
 */
@Component({
    selector: 'io-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.scss'],
    viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class SelectComponent extends FormInputComponent implements OnInit {
    /** Select options */
    @Input()
    optionWrapper!: OptionWrapper;

    /** Translate or not the option */
    @Input()
    translateOption = true;

    constructor(private translateService: TranslateService) {
        super();
    }

    ngOnInit(): void {}

    /**
     * Get the translate label from the option
     *
     * @param option Option item
     */
    getLabel(option: OptionItem): string {
        if (this.translateOption) return this.translateService.instant(option.label);
        return option.label;
    }
}
