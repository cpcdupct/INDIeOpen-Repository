import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterEvent } from '@shared/models';

import { RadioFilter } from '../../models';

/**
 * Search filter radio type
 */
@Component({
    selector: 'io-search-filter-radio',
    templateUrl: './search-filter-radio.component.html',
    styleUrls: ['./search-filter-radio.component.scss'],
})
export class SearchFilterRadioComponent implements OnInit {
    /** Filter definition */
    @Input()
    filter!: RadioFilter;

    /** Filter name */
    @Input()
    name!: string;

    /** Section title ID */
    @Input()
    labelId!: string;

    /** Filter selected event */
    @Output()
    filterSelected = new EventEmitter<FilterEvent>();

    constructor() {}

    ngOnInit(): void {}

    /**
     * Filter change event
     *
     * @param value selected item or value
     */
    change(event: any) {
        this.emitEvent([event.value]);
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
