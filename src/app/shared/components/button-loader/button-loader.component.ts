import { Component, Input, OnInit } from '@angular/core';

/**
 * Button loader component to be used within a button
 */
@Component({
    selector: 'io-button-loader',
    templateUrl: './button-loader.component.html',
    styleUrls: ['./button-loader.component.scss'],
})
export class ButtonLoaderComponent implements OnInit {
    /** Boolean to control the loader */
    @Input()
    show!: boolean;

    constructor() {}

    ngOnInit(): void {}
}
