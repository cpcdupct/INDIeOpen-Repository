import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthorResource } from '@core/models';
import { FilterEvent } from '@shared/models';
import { GenericFilter } from 'app/search/models';
import { SearchService } from 'app/search/services';
import { Observable, of } from 'rxjs';

/**
 * Author search filter
 */
@Component({
    selector: 'io-author-filter',
    templateUrl: './author-filter.component.html',
    styleUrls: ['./author-filter.component.scss'],
})
export class AuthorFilterComponent implements OnInit {
    /** Filter definition */
    filter: GenericFilter;

    /** Filter selected event */
    @Output()
    filterSelected = new EventEmitter<FilterEvent>();

    /** Author search results */
    results$!: Observable<AuthorResource[]>;

    /** Author selected */
    itemSelected: AuthorResource | undefined;

    /** Searchbar text */
    name: string = '';

    constructor(
        private route: ActivatedRoute,
        private eRef: ElementRef,
        private searchService: SearchService
    ) {
        this.filter = {
            key: 'author',
            label: 'search.filters.title.author',
            selected: undefined,
        };
    }

    /**
     * @inheritdoc
     *
     * Select an author based on the query parameter
     */
    ngOnInit(): void {
        this.route.queryParamMap.subscribe(params => {
            if (params.has('author')) {
                this.setItemSelected(params.get('author'));
            } else {
                this.itemSelected = undefined;
            }
        });
    }

    /**
     * Set the author selected
     *
     * @param selected selected value
     */
    private setItemSelected(selected: string | null) {
        if (selected === null) return;

        this.searchService.findAuthor(selected).subscribe(author => {
            this.itemSelected = author;
        });
    }

    /**
     * Author changed event
     *
     * @param event Event instance
     */
    dataChanged(event: Event) {
        if (this.name.length >= 3) {
            this.results$ = this.searchService.findAuthorsByName(this.name);
        } else {
            this.results$ = of([]);
        }
    }

    /**
     * Mark the author item as selected
     *
     * @param event Event with the selected option
     */
    authorSelected(event: any) {
        this.results$ = of([]);
        this.name = '';
        this.emitEvent([event.option.id]);
        this.setItemSelected(event.option.id);
    }


    /**
     * Clear the search results when the user clicks outside the filter
     *
     * @param event Clickout event
     */
    @HostListener('document:click', ['$event'])
    @HostListener('touchend', ['$event'])
    clickout(event: Event) {
        if (!this.eRef.nativeElement.contains(event.target)) {
            this.results$ = of([]);
            this.name = '';
        }
    }

    /**
     * Clear the selected value
     */
    clearSelected() {
        this.emitEvent([]);
        this.itemSelected = undefined;
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
