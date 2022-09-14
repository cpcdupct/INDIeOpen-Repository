import { Component, Input, OnInit } from '@angular/core';

import { LoaderService } from './loader.service';

/**
 * Loader component
 */
@Component({
    selector: 'io-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {
    /** Base folder for gifs */
    private readonly LOADER_FOLDER = '/assets/img/loaders/';
    /** Default gif color */
    private readonly DEFAULT_COLOR = 'blue';
    /** Defualt gif style */
    private readonly DEFAULT_STYLE = 'book';

    /** Gif color */
    @Input()
    color!: string;

    /** Gif style */
    @Input()
    style!: string;

    constructor(public loaderService: LoaderService) {}

    ngOnInit(): void {}

    /** Get the gif source based on the data provided */
    src(): string {
        const color: string = !this.color ? this.DEFAULT_COLOR : this.color;
        const style: string = !this.style ? this.DEFAULT_STYLE : this.style;

        return this.LOADER_FOLDER + style + '-' + color + '.gif';
    }
}
