import { AfterViewInit, Component, HostListener } from '@angular/core';
import { ResizeService } from '@core/services';
import { ScreenSize } from '@shared/models';

/**
 * Screen size detector component
 */
@Component({
    selector: 'io-size-detector',
    templateUrl: './size-detector.component.html',
    styleUrls: ['./size-detector.component.scss'],
})
export class SizeDetectorComponent implements AfterViewInit {
    constructor(private resizeService: ResizeService) {}

    /**
     * Window resize event listener
     *
     * @param event Event instance
     */
    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.detectScreenSize(event.target.innerWidth);
    }

    /**
     * Detect the screen size on start
     */
    ngAfterViewInit() {
        this.detectScreenSize(window.innerWidth);
    }

    /**
     * Use the resize service to provide the screen size from onResize function
     *
     * @param width Screen width in px
     */
    private detectScreenSize(width: number) {
        if (width <= 575) {
            this.resizeService.onResize(ScreenSize.XS);
        } else if (width >= 576 && width <= 767) {
            this.resizeService.onResize(ScreenSize.SM);
        } else if (width >= 768 && width <= 991) {
            this.resizeService.onResize(ScreenSize.MD);
        } else if (width >= 992 && width <= 1199) {
            this.resizeService.onResize(ScreenSize.LG);
        } else if (width >= 1200) {
            this.resizeService.onResize(ScreenSize.XL);
        }
    }
}
