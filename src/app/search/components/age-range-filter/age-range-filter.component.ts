import { Options } from '@angular-slider/ngx-slider';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterEvent, RANGE_MAX_DEFAULT, RANGE_MIN_DEFAULT } from '@shared/models';
import { Filter, SliderFilter } from 'app/search/models';

/**
 * Age range filter
 */
@Component({
    selector: 'io-age-range-filter',
    templateUrl: './age-range-filter.component.html',
    styleUrls: ['./age-range-filter.component.scss'],
})
export class AgeRangeFilterComponent implements OnInit {
    /** Filter definition */
    @Input()
    filter!: SliderFilter;

    /** Filter name */
    @Input()
    name!: string;

    /** Filter selected event */
    @Output()
    filterSelected = new EventEmitter<FilterEvent>();

    /** Min value */
    minValue = RANGE_MIN_DEFAULT;
    /** Max value */
    maxValue = RANGE_MAX_DEFAULT;

    /** Input options */
    options: Options = {
        floor: RANGE_MIN_DEFAULT,
        ceil: RANGE_MAX_DEFAULT,
    };

    constructor() {}

    ngOnInit(): void {
        this.options.floor = this.filter.floor;
        this.options.ceil = this.filter.ceil;
        this.minValue = this.filter.selectedMinimum;
        this.maxValue = this.filter.selectedMaximum;
    }

    /**
     * Filter change event
     *
     * @param value selected item or value
     */
    change(value: any) {
        const values: string[] = [];
        values.push(this.minValue.toString());
        values.push(this.maxValue.toString());
        this.emitEvent(values);
    }

    /**
     * Emit filter value
     *
     * @param keys Selected items
     */
    private emitEvent(keys: string[]) {
        this.filterSelected.emit({
            filterKey: this.filter.key,
            filterItemKeys: keys,
        });
    }
}
