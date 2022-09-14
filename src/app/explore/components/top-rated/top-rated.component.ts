import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewUnitComponent } from '@shared/modals';

import { TopRatedUnit } from '../../models';
import { ExploreService } from '../../services';

/**
 * Top rated unit component
 */
@Component({
    selector: 'io-top-rated',
    templateUrl: './top-rated.component.html',
    styleUrls: ['./top-rated.component.scss'],
})
export class TopRatedComponent implements OnInit {
    @Input()
    unit!: TopRatedUnit;

    constructor(private modalService: NgbModal, private exploreService: ExploreService) {}

    ngOnInit(): void {}

    /**
     * Gets the unit info and opens the view unit modal
     */
    viewUnit() {
        this.exploreService.getUnitInfo(this.unit.id).subscribe(res => {
            const modalRef = this.modalService.open(
                ViewUnitComponent,
                ViewUnitComponent.modalOptions
            );
            modalRef.componentInstance.unit = res;
        });
    }
}
