import { Component, Input, OnInit } from '@angular/core';

/**
 * Gif loader component
 */
@Component({
    selector: 'io-loader-gif',
    templateUrl: './loader-gif.component.html',
    styleUrls: ['./loader-gif.component.scss'],
})
export class LoaderGifComponent implements OnInit {
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

    /** Boolean for controlling the loader */
    @Input()
    show!: boolean;

    constructor() {}

    ngOnInit(): void {}

    /** Get the gif source based on the data provided */
    src(): string {
        const color: string = !this.color ? this.DEFAULT_COLOR : this.color;
        const style: string = !this.style ? this.DEFAULT_STYLE : this.style;

        return this.LOADER_FOLDER + style + '-' + color + '.gif';
    }
}
