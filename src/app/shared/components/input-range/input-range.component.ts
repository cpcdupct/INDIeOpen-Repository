import { Options } from '@angular-slider/ngx-slider';
import { Component, OnInit } from '@angular/core';
import { RANGE_MAX_DEFAULT, RANGE_MIN_DEFAULT } from '@shared/models';

import { FormInputComponent } from '../form-input/form-input.component';

/**
 * Input age range
 */
@Component({
    selector: 'io-input-range',
    templateUrl: './input-range.component.html',
    styleUrls: ['./input-range.component.scss'],
})
export class InputRangeComponent extends FormInputComponent implements OnInit {
    /** Select tags input */
    options: Options = {
        floor: RANGE_MIN_DEFAULT,
        ceil: RANGE_MAX_DEFAULT,
    };

    constructor() {
        super();
    }

    ngOnInit(): void {
        this.options.ariaLabelledBy = this.data.name;
        this.options.ariaLabelledByHigh = this.data.name;
    }
}
