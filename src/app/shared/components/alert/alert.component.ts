import { Component, Input, OnInit } from '@angular/core';

/**
 * Alert component
 */
@Component({
    selector: 'io-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit {
    /** Alert show */
    show!: boolean;

    /** Alert type */
    @Input()
    type!: string;
    constructor() {}

    /**
     * @inheritdoc
     *
     * Show the alert
     */
    ngOnInit(): void {
        this.show = true;
    }

    /** CLose the alert */
    onClose() {
        this.show = false;
    }
}
