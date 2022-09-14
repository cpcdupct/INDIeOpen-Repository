import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ActionResultEvent } from '@core/models';
import { Video } from '@core/models/video';
import { AlertsService } from '@shared/components/alerts/alerts.service';
import { LoaderService } from '@shared/components/loader/loader.service';
import { FilterEvent, OrderFilter, PAGE_DEFAULT_PAGE, PAGE_DEFAULT_SIZE } from '@shared/models';
import { Observable } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';

import { VideosService } from '../../services';

interface RequestParams {
    type?: string;
    order?: string;
}

@Component({
    selector: 'io-videos',
    templateUrl: './videos.component.html',
    styleUrls: ['./videos.component.scss'],
})
export class VideosComponent implements OnInit, AfterViewInit {
    /** Page element containing the VideoItem instances for pagination */
    videos$!: Observable<Video[]>;

    /** Page Request */
    page: number = PAGE_DEFAULT_PAGE;
    size: number = PAGE_DEFAULT_SIZE;
    total!: number;

    /** Request param */
    requestParams: RequestParams = {};

    /** Filters */
    orderFilter!: OrderFilter;

    lastState!: any;
    numberOfElements = 0;
    /** Last page */
    lastPage: number = 0;

    constructor(
        private videosService: VideosService,
        private router: Router,
        private route: ActivatedRoute,
        private loaderService: LoaderService,
        private alertsService: AlertsService
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
            this.loadVideos(1);
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

    loadVideos(page: number) {
        this.loaderService.loadingOn();
        // Fix incorrect page numbers
        if (page * this.size > this.total) page = this.lastPage;
        this.videos$ = this.videosService.findVideos(page, this.getSearchParams()).pipe(
            tap(res => {
                this.total = res.length;
                this.page = page;
                this.numberOfElements = res.numberOfElements;
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
        }

        return params;
    }

    private loadFilters() {
        this.loadOrderFilter(this.requestParams.order);
    }

    private loadOrderFilter(order: string | undefined) {
        this.orderFilter = {
            key: 'order',
            label: 'videos.order-by',
            selected: order !== undefined ? order : 'RECENT',
            items: [
                {
                    label: 'videos.orders.recent',
                    key: 'RECENT',
                    sort: {
                        name: 'createdAt',
                        order: 'desc',
                    },
                },
                {
                    label: 'videos.orders.latest',
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

    onTypeSelected(filter: FilterEvent) {
        const params: any = {};

        params[filter.filterKey] = filter.filterItemKeys[0];

        this.router.navigate(['/videos'], {
            queryParamsHandling: 'merge',
            queryParams: params,
        });
    }

    onDeletedVideo(event: ActionResultEvent) {
        this.loadVideos(1);
        this.alertsService.showAlert(event);
    }

    getElements(): number {
        return this.numberOfElements + (this.page - 1) * 5;
    }
}
