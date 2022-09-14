import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterEvent } from '@shared/models';
import { Filter, FilterItem } from 'app/search/models';

/**
 * Search filter checkbox type
 */
@Component({
    selector: 'io-search-filter-check',
    templateUrl: './search-filter-check.component.html',
    styleUrls: ['./search-filter-check.component.scss'],
})
export class SearchFilterCheckComponent implements OnInit {
    /** Filter definition */
    @Input()
    filter!: Filter;

    /** Filter name */
    @Input()
    name!: string;

    /** Filter selected event */
    @Output()
    filterSelected = new EventEmitter<FilterEvent>();

    allItem: FilterItem | undefined;
    otherItems!: FilterItem[];

    allComplete: boolean = false;

    constructor() {}

    ngOnInit(): void {
        this.allItem = this.filter.items.find(item => item.isAll);
        this.otherItems = this.filter.items.filter(item => !item.isAll);
        this.allComplete = this.otherItems.every(item => item.isSelected);
    }

    /**
     * Check / Uncheck all items
     *
     */
    setAll(completed: boolean) {
        this.allComplete = completed;
        this.otherItems.forEach(item => (item.isSelected = completed));
        let langs = this.otherItems.filter(i => i.isSelected).map(i => i.key);
        if (langs.length === 0)
            this.emitEvent(this.otherItems.map(i => i.key))
        else 
            this.emitEvent(langs);
    }
    /**
     * Check / Uncheck one item
     */
    setOne(item: FilterItem) {
        this.allComplete = this.otherItems.every(item => item.isSelected);
        let langs = this.otherItems.filter(i => i.isSelected).map(i => i.key);
        if (langs.length === 0) this.emitEvent(this.otherItems.map(i => i.key));
        else this.emitEvent(langs);
    }

    /**
     * Determines if neither all nor none options are checked
     * @returns true if some options are checked, false otherwise
     */
    someComplete(): boolean {
        return this.otherItems.filter(item => item.isSelected).length > 0 && !this.allComplete;
    }

    /**
     * Check item action. It must check all sub-items if it is needed
     *
     * @param item Filter item checked
     */
    check(item: FilterItem) {
        if (item.isSelected && item.isAll) {
            // Deseleccionar el resto
            this.filter.items.filter(i => i.key !== item.key).forEach(i => (i.isSelected = false));
            this.emitEvent([item.key]);
        } else if (!item.isSelected && item.isAll) {
            this.filter.items.filter(i => i.key !== item.key).forEach(i => (i.isSelected = true));
            this.emitEvent(this.filter.items.filter(i => i.key !== item.key).map(i => i.key));
        } else this.emitEvent(this.filter.items.filter(i => i.isSelected).map(i => i.key));
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
