import { Component, Input, OnInit } from '@angular/core';
import { Unit } from '@core/models';
import { Rating } from '@core/models/rating';
import { RatingService, ToastrWrapperService } from '@core/services';
import { Page } from '@shared/models';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'io-tab-unit-rating',
    templateUrl: './tab-unit-rating.component.html',
    styleUrls: ['./tab-unit-rating.component.scss'],
})
export class TabUnitRatingComponent implements OnInit {
    @Input()
    unit!: Unit;

    ratingRequest = {
        page: 1,
        loading: false,
        loading_more: false,
    };

    ratings: Rating[] = [];

    constructor(
        private ratingService: RatingService,
        private toastrWrapper: ToastrWrapperService
    ) {}

    ngOnInit(): void {
        this.loadRatings(1);
    }

    private loadRatings(page: number) {
        const unitId: number = this.unit.id;

        this.ratings = [];
        this.ratingRequest.page = page;
        this.ratingRequest.loading = true;

        this.ratingService
            .getRatingsFromUnit(page, unitId)
            .pipe(
                finalize(() => {
                    this.ratingRequest.loading = false;
                })
            )
            .subscribe((pageRating: Page<Rating>) => {
                this.ratings.push(...pageRating.items);
            });
    }

    loadMoreRatings() {
        const unitId: number = this.unit.id;

        this.ratingRequest.loading_more = true;
        this.ratingService
            .getRatingsFromUnit(this.ratingRequest.page + 1, unitId)
            .pipe(
                finalize(() => {
                    this.ratingRequest.loading_more = false;
                })
            )
            .subscribe((pageItem: Page<Rating>) => {
                if (pageItem.items.length === 0) {
                    this.toastrWrapper.warning(
                        'units.tab-unit-rating.messages.no-more-ratings',
                        'common.warning'
                    );
                } else {
                    this.ratingRequest.page++;
                    this.ratings.push(...pageItem.items);
                }
            });
    }

    loaderSrc() {
        return '/assets/img/loaders/book-blue.gif';
    }
}
