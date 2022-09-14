import {
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { UnitType } from '@core/models';
import { ResizeService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { ScreenSize } from '@shared/models';
import { Utils } from '@shared/utils';

import { RecentAddedUnit } from '../../models';
import { ExploreService } from '../../services';

/**
 * Carousel recent added component
 */
@Component({
    selector: 'io-carousel-recent-added',
    templateUrl: './carousel-recent-added.component.html',
    styleUrls: ['./carousel-recent-added.component.scss'],
})
export class CarouselRecentAddedComponent implements OnInit, OnChanges {
    /** Most recent added units array */
    units!: RecentAddedUnit[];
    /** Slides */
    slides!: any;
    /** Active slide index */
    activeSlide = 0;

    @ViewChild('liveRegion', { read: ElementRef }) liveRegion!: ElementRef;
    @ViewChild('prevButton', { read: ElementRef }) prevButton!: ElementRef;
    @ViewChild('nextButton', { read: ElementRef }) nextButton!: ElementRef;

    @Input()
    type!: UnitType;

    constructor(
        private resizeService: ResizeService,
        private exploreService: ExploreService,
        private translateService: TranslateService
    ) {}

    /**
     * @inheritdoc
     *
     * Event that calls the load of the carousel
     */
    ngOnInit(): void {
        this.loadCarousel();
    }

    /**
     * Load the carousel lof top recent units and binds the sizechange event
     */
    private loadCarousel() {
        this.exploreService.getRecentAddedUnits(this.type).subscribe(
            (recentAddedUnits: RecentAddedUnit[]) => {
                this.units = recentAddedUnits;

                this.resizeService.onSizeChanged$.subscribe(size => {
                    this.onSizeChange(size);
                    this.updateControls();
                });

                this.onSizeChange(Utils.getScreenSize(window.innerWidth));

                setTimeout(() => {
                    this.updateLiveRegion();
                    this.updateControls();
                }, 1);
            },
            err => {}
        );
    }

    /**
     * Chanage the number of items per slide based on the current screen size.
     *
     * @param size Screen size
     */
    private onSizeChange(size: ScreenSize) {
        let chunkSize: number;
        if (size === ScreenSize.XS) chunkSize = 1;
        else if (size === ScreenSize.SM) chunkSize = 2;
        else if (size === ScreenSize.MD) chunkSize = 3;
        else chunkSize = 4;
        this.slides = Utils.chunk(this.units, chunkSize);
    }

    /**
     * Disable prev & next buttons if there are not enough elements
     */
    private updateControls() {
        if (this.slides.length === 1) {
            this.prevButton.nativeElement.setAttribute('disabled', '');
            this.nextButton.nativeElement.setAttribute('disabled', '');
        } else {
            this.prevButton.nativeElement.removeAttribute('disabled');
            this.nextButton.nativeElement.removeAttribute('disabled');
        }
    }

    /**
     * Notify the user of the current elements shown
     */
    private updateLiveRegion() {
        if (this.units && this.liveRegion) {
            this.liveRegion.nativeElement.setAttribute('aria-live', 'polite');
            let start = this.activeSlide * this.slides[this.activeSlide].length;
            let end = Math.min(
                (this.activeSlide + 1) * this.slides[this.activeSlide].length,
                this.units.length
            );
            let total = this.units.length;
            this.liveRegion.nativeElement.innerHTML = this.translateService.instant(
                'explore.accesibility.carousel-current',
                {
                    start,
                    end,
                    total,
                }
            );
            setTimeout(() => this.liveRegion.nativeElement.setAttribute('aria-live', 'off'), 150);
        }
    }

    /** Load the previous carousel slide */
    prev() {
        if (this.activeSlide > 0) this.activeSlide--;
        else this.activeSlide = this.slides.length - 1;
        this.updateLiveRegion();
    }

    /** Load the next carousel slide */
    next() {
        if (this.activeSlide + 1 < this.slides.length) this.activeSlide++;
        else this.activeSlide = 0;
        this.updateLiveRegion();
    }

    /** Set the active slide if the web request finishes */
    ngOnChanges(changes: SimpleChanges): void {
        this.activeSlide = 0;
    }
}
