import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, convertToParamMap, ParamMap, Params, Router } from '@angular/router';
import { findEducationalContextsLanguage, Language, Unit, valuesOfLanguages } from '@core/models';
import { TranslateService } from '@ngx-translate/core';
import { LoaderService } from '@shared/components/loader/loader.service';
import {
    FilterEvent,
    PAGE_DEFAULT_PAGE,
    PAGE_DEFAULT_SIZE,
    RANGE_MAX_DEFAULT,
    RANGE_MIN_DEFAULT,
    TypeFilter,
} from '@shared/models';
import { SearchNavService } from 'app/navigation/services';
import { Observable } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';

import { Filter, FilterItem, RadioFilter, RadioFilterItem, SliderFilter } from '../../models';
import { SearchService } from '../../services/search.service';

/**
 * Search request parameters
 */
interface RequestParams {
    [index: string]: string | undefined;
}

@Component({
    selector: 'io-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
    allowedParams: string[] = [
        'language',
        'text',
        'category',
        'usemode',
        'type',
        'order',
        'context',
        'ageRange',
        'author',
    ];

    /** Filter for categories */
    useModeFilter!: RadioFilter;
    /** Filter for unit type */
    typeFilter!: RadioFilter;
    /** Filter for unit list orders */
    orderFilter!: TypeFilter;
    /** Filter for educational context */
    educationalContextFilter!: RadioFilter;
    /** Filter for unit age range */
    ageRangeFilter!: SliderFilter;
    /** Filter for unit language */
    languageFilter!: Filter;

    /** Search text */
    text!: string;

    /** Pages number */
    page: number = PAGE_DEFAULT_PAGE;
    /** Page size */
    size: number = PAGE_DEFAULT_SIZE;
    /** Number of element in page */
    numberOfElements = 0;
    /** Number of total elements in the search */
    total!: number;

    /** Search items */
    units$!: Observable<Unit[]>;

    /** Request params */
    requestParams: RequestParams = {};

    /** Last page */
    lastPage: number = 0;

    /** Filter */
    filterOpen = true;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private searchService: SearchService,
        private translateService: TranslateService,
        private loaderService: LoaderService,
        private location: Location,
        private searchNav: SearchNavService
    ) {}

    /**
     * @inheritdoc Load the url parameters and filters and makes the unit search
     */
    ngOnInit(): void {
        this.route.queryParamMap.subscribe(params => {
            this.loadRequestParameters(params);
            this.loadFilters();
            this.makeUnitsSearch(1);
        });
    }

    /**
     * Load the request parameters from the parameters map in the URL
     *
     * @param params Parameters map
     */
    loadRequestParameters(params: ParamMap) {
        this.allowedParams.forEach(param => {
            if (params.has(param) && params.get(param))
                this.requestParams[param] = params.get(param) || undefined;
            else {
                if (param === 'text') this.requestParams[param] = '';
                else delete this.requestParams[param];
            }
        });
    }

    /** Make the units search with search parameters
     *
     * @param page Page number
     */
    makeUnitsSearch(page: number) {
        this.loaderService.loadingOn();
        // Fix incorrect page numbers
        if (page * this.size > this.total) page = this.lastPage;
        else if (page < 1) page = 1;

        this.units$ = this.searchService.searchUnits(page, this.getSearchParams()).pipe(
            tap(res => {
                this.total = res.length;
                this.numberOfElements = res.numberOfElements;
                this.page = page;
                this.lastPage =
                    Math.floor(this.total / this.size) + (this.total % this.size === 0 ? 0 : 1);
            }),
            map(res => res.items),
            finalize(() => this.loaderService.loadingOff())
        );
    }

    /**
     * Toggle the filters bar. Applied only in mobile screen sizes
     */
    toggleFilters() {
        const elements = document.getElementsByClassName('filter');
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            element.classList.toggle('filter-hide');
        }

        this.filterOpen = !this.filterOpen;
    }

    /**
     * Return an object with the search parameters
     */
    private getSearchParams() {
        let params: any = {};

        params = { ...params, ...this.requestParams };

        delete params.order;

        if (this.requestParams.order) {
            const order = this.orderFilter.items.find(o => o.key === this.requestParams.order);
            params.sort = order?.sort.name + ',' + order?.sort.order;
        }

        return params;
    }

    /**
     * Load the search filter needed
     */
    private loadFilters() {
        // Use mode filter
        this.loadUsemodeFilter(this.requestParams.usemode);

        // Type filter
        this.loadTypeFilter(this.requestParams.type);

        // Order filter
        this.loadOrderFilter(this.requestParams.order);

        // Educational context
        this.loadEducationalContext(this.requestParams.context);

        // Age Range
        this.loadAgeRangeFilter(this.requestParams.ageRange);

        // Language filter
        this.loadLanguageFilter(this.requestParams.language);
    }

    /**
     * Load the age range filter. If a value is present the filter is set
     *
     * @param ageRange filter value
     */
    private loadAgeRangeFilter(ageRange: string | undefined) {
        let selectedMinimum = ageRange ? parseInt(ageRange.split(',')[0]) : RANGE_MIN_DEFAULT;
        let selectedMaximum = ageRange?.includes(',')
            ? parseInt(ageRange.split(',')[1])
            : RANGE_MAX_DEFAULT;
        this.ageRangeFilter = {
            key: 'ageRange',
            label: 'search.filters.title.ageRange',
            floor: RANGE_MIN_DEFAULT,
            ceil: RANGE_MAX_DEFAULT,
            selectedMinimum: selectedMinimum,
            selectedMaximum: selectedMaximum,
        };
    }

    /**
     * Load the language filter. If a value is present the filter is set
     *
     * @param language filter value
     */
    private loadLanguageFilter(language: string | undefined) {
        const arrayOfLanguages: string[] = language !== undefined ? language.split(',') : [];
        let languageFilter: Filter;

        const items: FilterItem[] = [];

        items.push({
            key: 'all',
            label: 'languages.all',
            isSelected: language === undefined || language === 'all',
            subItems: [],
            isAll: true,
        });

        valuesOfLanguages().forEach(languageValue => {
            items.push({
                key: languageValue,
                label: 'languages.' + languageValue,
                isSelected: arrayOfLanguages.includes(languageValue),
                subItems: [],
            });
        });

        languageFilter = {
            key: 'language',
            label: 'search.filters.title.language',
            items,
        };

        this.languageFilter = languageFilter;
    }

    /**
     * Load the educational context filter. If a value is present the filter is set
     *
     * @param context filter value
     */
    private loadEducationalContext(context: string | undefined) {
        let educationalContextFilter: RadioFilter;

        const items: RadioFilterItem[] = [];

        items.push({
            key: '0',
            label: 'search.filters.context.all-context',
        });

        items.push(
            ...findEducationalContextsLanguage(
                this.translateService.getBrowserLang() as Language
            ).map(educationalContext => {
                return { key: educationalContext.key.toString(), label: educationalContext.name };
            })
        );

        educationalContextFilter = {
            key: 'context',
            label: 'search.filters.title.educationalContext',
            selected: context !== undefined ? context : '0',
            items,
        };

        this.educationalContextFilter = educationalContextFilter;
    }

    /**
     * Load use mode filter. If a value is present the filter is set
     *
     * @param useMode filter value
     */
    private loadUsemodeFilter(useMode: string | undefined) {
        let useModeFilter: RadioFilter;

        useModeFilter = {
            key: 'usemode',
            label: 'search.filters.title.useMode',
            selected: useMode !== undefined ? useMode : 'ALL_MODES',
            items: [
                {
                    key: 'ALL_MODES',
                    label: 'search.filters.useMode.all-modes',
                },
                {
                    key: 'ALLOW_READ_ONLY',
                    label: 'search.filters.useMode.allow-use',
                },
                {
                    key: 'ALLOW_REUSE',
                    label: 'search.filters.useMode.allow-reuse',
                },
            ],
        };

        this.useModeFilter = useModeFilter;
    }

    /**
     * Load type filter. If a value is present the filter is set
     *
     * @param type filter value
     */
    private loadTypeFilter(type: string | undefined) {
        let typeFilter: RadioFilter;

        typeFilter = {
            key: 'type',
            label: 'search.filters.title.types',
            selected: type !== undefined ? type : 'ALL_TYPES',
            items: [
                {
                    key: 'ALL_TYPES',
                    label: 'search.filters.type.all-types',
                },
                {
                    key: 'CONTENT',
                    label: 'search.filters.type.content',
                },
                {
                    key: 'EVALUATION',
                    label: 'search.filters.type.evaluation',
                },
            ],
        };

        this.typeFilter = typeFilter;
    }

    /**
     * Load order filter. If a value is present the filter is set
     *
     * @param order filter value
     */
    private loadOrderFilter(order: string | undefined) {
        this.orderFilter = {
            key: 'order',
            label: 'search.order_by',
            selected: order !== undefined ? order : 'RECENT',
            items: [
                {
                    label: 'search.orders.recent',
                    key: 'RECENT',
                    sort: {
                        name: 'publishedDate',
                        order: 'desc',
                    },
                },
                {
                    label: 'search.orders.latest',
                    key: 'LATEST',
                    sort: {
                        name: 'publishedDate',
                        order: 'asc',
                    },
                },
                {
                    label: 'search.orders.top_rated',
                    key: 'TOP_RATED',
                    sort: {
                        name: 'ratingAverage',
                        order: 'desc',
                    },
                },
                {
                    label: 'search.orders.least_rated',
                    key: 'LEAST_RATED',
                    sort: {
                        name: 'ratingAverage',
                        order: 'asc',
                    },
                },
                {
                    label: 'search.orders.a_z',
                    key: 'A_Z',
                    sort: {
                        name: 'name',
                        order: 'asc',
                    },
                },
                {
                    label: 'search.orders.z_a',
                    key: 'Z_A',
                    sort: {
                        name: 'name',
                        order: 'desc',
                    },
                },
            ],
        };
    }

    /**
     * Filter selection event listener. It is common for all search filters applied.
     *
     * @param filter Filter event instance
     */
    onFilterSelected(filter: FilterEvent) {
        const params: Params = { ...this.requestParams };

        if (filter.filterItemKeys.length > 0)
            params[filter.filterKey] = filter.filterItemKeys.toString();
        else params[filter.filterKey] = null;
        // Add new parameters
        this.loadRequestParameters(convertToParamMap(params));
        // Build query string from parameters
        let httpParams = new HttpParams();
        for (let param in this.requestParams) {
            let value = this.requestParams[param];
            if (value) httpParams = httpParams.set(param, value);
        }
        // Change URL
        this.location.replaceState('/search', httpParams.toString());
        // Filter units
        this.makeUnitsSearch(this.page);
    }

    /**
     * Order selection event listener. It is common for all order filters applied
     *
     * @param order order event instance
     */
    onOrderSelected(order: FilterEvent) {
        const params: Params = { ...this.requestParams };
        params.order = order.filterItemKeys[0];
        let httpParams = new HttpParams();
        for (let param in this.requestParams) {
            let value = this.requestParams[param];
            if (value) httpParams = httpParams.set(param, value);
        }
        // Change URL
        this.location.replaceState('/search', httpParams.toString());
        this.loadRequestParameters(convertToParamMap(params));
        this.loadFilters();
        this.makeUnitsSearch(this.page);

        // this.router.navigate(['/search'], {
        //     queryParamsHandling: 'merge',
        //     queryParams: params,
        // });
    }

    /**
     * Clear applied search and reset parameters
     */
    clearSearch() {
        //this.router.navigate(['/search']);
        this.location.replaceState('/search');
        this.loadRequestParameters(convertToParamMap({}));
        this.loadFilters();
        this.makeUnitsSearch(this.page);
        this.searchNav.setSearchQuery('');
    }

    /**
     * Get number of elements in page relative to  total number of elements
     */
    getElements(): number {
        return this.numberOfElements + (this.page - 1) * 5;
    }
}
