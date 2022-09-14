import { Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ResizeService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { ScreenSize } from '@shared/models';
import { Utils } from '@shared/utils';
import { TopRatedUnit } from 'app/explore/models';
import { ExploreService } from 'app/explore/services';

/**
 * Carousel of TopRated units
 */
@Component({
    selector: 'io-carousel-top-rated',
    templateUrl: './carousel-top-rated.component.html',
    styleUrls: ['./carousel-top-rated.component.scss'],
})
export class CarouselTopRatedComponent implements OnInit {
    /** Carousel slides */
    slides!: any;
    /** Top rated unitss */
    units!: TopRatedUnit[];
    /** Active slide index */
    activeSlide = 0;

    @ViewChild('liveRegion', { read: ElementRef }) liveRegion!: ElementRef;
    @ViewChild('prevButton', { read: ElementRef }) prevButton!: ElementRef;
    @ViewChild('nextButton', { read: ElementRef }) nextButton!: ElementRef;

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
     * Load the carousel lof top rated units and binds the sizechange event
     */
    private loadCarousel() {
        this.exploreService.getTopRatedUnits().subscribe(
            (units: TopRatedUnit[]) => {
                this.units = units;

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
        switch (size) {
            case ScreenSize.XS:
            case ScreenSize.SM:
            case ScreenSize.MD:
                this.slides = Utils.chunk(this.units, 1);
                break;
            case ScreenSize.LG:
            case ScreenSize.XL:
                this.slides = Utils.chunk(this.units, 2);
                break;
        }
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
