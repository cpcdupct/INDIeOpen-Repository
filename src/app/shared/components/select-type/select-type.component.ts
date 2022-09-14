import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterEvent, TypeFilter } from '@shared/models';

/**
 * Input select for selecting unit type
 */
@Component({
    selector: 'io-select-type',
    templateUrl: './select-type.component.html',
    styleUrls: ['./select-type.component.scss'],
})
export class SelectTypeComponent implements OnInit {
    /** Filter definition */
    @Input()
    filter!: TypeFilter;

    /** Type select output event */
    @Output()
    typeSelected = new EventEmitter<FilterEvent>();

    constructor() {}

    ngOnInit(): void {}

    /**
     * Data changed
     *
     * @param ev Event instance
     */
    onChange(ev: any) {
        this.typeSelected.emit({
            filterKey: this.filter.key,
            filterItemKeys: [this.filter.selected],
        });
    }
}
