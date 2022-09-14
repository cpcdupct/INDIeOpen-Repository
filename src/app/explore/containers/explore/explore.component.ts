import { Component, OnInit } from '@angular/core';

import { PredefinedItem } from '../../models';

import predefinedItemsData from './predefined-items.json';

/**
 * Explore page component
 */
@Component({
    selector: 'io-explore',
    templateUrl: './explore.component.html',
    styleUrls: ['./explore.component.scss'],
})
export class ExploreComponent implements OnInit {
    predefinedItems: PredefinedItem[] = predefinedItemsData;

    constructor() {}

    ngOnInit(): void {}
}
