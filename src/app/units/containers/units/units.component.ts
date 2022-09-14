import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ActionResultEvent, Unit } from '@core/models';
import { UnitsService } from '@core/services';
import { AlertsService } from '@shared/components/alerts/alerts.service';
import { LoaderService } from '@shared/components/loader/loader.service';
import {
    FilterEvent,
    OrderFilter,
    PAGE_DEFAULT_PAGE,
    PAGE_DEFAULT_SIZE,
    TypeFilter,
} from '@shared/models';
import { Observable } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';

interface RequestParams {
    type?: string;
    order?: string;
}

@Component({
    selector: 'io-units',
    templateUrl: './units.component.html',
    styleUrls: ['./units.component.scss'],
})
export class UnitsComponent implements OnInit, AfterViewInit {
    /** Page element containing the UnitItem instances for pagination */
    units$!: Observable<Unit[]>;

    /** Page Request */
    page: number = PAGE_DEFAULT_PAGE;
    size: number = PAGE_DEFAULT_SIZE;
    total!: number;

    /** Request param */
    requestParams: RequestParams = {};

    /** Filters */
    orderFilter!: OrderFilter;
    typeFilter!: TypeFilter;

    lastState!: any;
    numberOfElements = 0;
    /** Last page */
    lastPage: number = 0;

    constructor(
        private unitsService: UnitsService,
        private router: Router,
        private route: ActivatedRoute,
        private alertsService: AlertsService,
        private loaderService: LoaderService
    ) {
        this.lastState = this.router.getCurrentNavigation()?.extras.state;
    }

    ngAfterViewInit(): void {
        if (this.lastState) this.notifyState();
    }

    ngOnInit(): void {
        this.route.queryParamMap.subscribe(params => {
            this.loadRequestParameters(params);
            this.loadFilters();
            this.loadUnits(1);
        });
    }

    private notifyState() {
        const event: ActionResultEvent = {
            messageKey: this.lastState.key,
            type: this.lastState.type,
        };

        this.alertsService.showAlert(event);
    }

    loadRequestParameters(params: ParamMap) {
        if (params.has('type')) this.requestParams.type = params.get('type') || undefined;
        else delete this.requestParams.type;

        if (params.has('order')) this.requestParams.order = params.get('order') || undefined;
        else delete this.requestParams.order;
    }

    loadUnits(page: number) {
        this.loaderService.loadingOn();
        // Fix incorrect page numbers
        if (page * this.size > this.total) page = this.lastPage;
        else if (page < 1) page = 1;
        this.units$ = this.unitsService.findUnits(page, this.getSearchParams()).pipe(
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

    private getSearchParams() {
        let params: any = {};

        params = { ...params, ...this.requestParams };

        delete params.order;

        if (this.requestParams.order) {
            const order = this.orderFilter.items.find(o => o.key === this.requestParams.order);
            params.sort = order?.sort?.name + ',' + order?.sort?.order;
        } else {
            // Default
            params.sort = 'createdAt,DESC';
        }

        return params;
    }

    private loadFilters() {
        this.loadOrderFilter(this.requestParams.order);
        this.loadTypeFilter(this.requestParams.type);
    }

    private loadOrderFilter(order: string | undefined) {
        this.orderFilter = {
            key: 'order',
            label: 'units.order-by',
            selected: order !== undefined ? order : 'RECENT',
            items: [
                {
                    label: 'search.orders.recent',
                    key: 'RECENT',
                    sort: {
                        name: 'createdAt',
                        order: 'desc',
                    },
                },
                {
                    label: 'search.orders.latest',
                    key: 'LATEST',
                    sort: {
                        name: 'createdAt',
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

    private loadTypeFilter(type: string | undefined) {
        this.typeFilter = {
            key: 'type',
            label: 'units.type',
            selected: type !== undefined ? type : 'ALL_TYPES',
            items: [
                {
                    key: 'ALL_TYPES',
                    label: 'units.types.all_types',
                },
                {
                    key: 'EVALUATION',
                    label: 'units.types.evaluation',
                },
                {
                    key: 'CONTENT',
                    label: 'units.types.content',
                },
            ],
        };
    }

    onFilterSelected(filter: FilterEvent) {
        const params: any = {};

        params[filter.filterKey] = filter.filterItemKeys[0];

        this.router.navigate(['/units'], {
            queryParamsHandling: 'merge',
            queryParams: params,
        });
    }

    goToCreate() {
        this.router.navigateByUrl('/units/create');
    }

    getElements(): number {
        return this.numberOfElements + (this.page - 1) * 5;
    }
}
