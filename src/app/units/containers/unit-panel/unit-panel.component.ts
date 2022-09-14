import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
    ActionResultEvent,
    canHaveRatings,
    canShareUnit,
    hasOriginalUnit,
    Unit,
} from '@core/models';
import { UnitsService } from '@core/services';
import { AlertsService } from '@shared/components/alerts/alerts.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'io-unit-panel',
    templateUrl: './unit-panel.component.html',
    styleUrls: ['./unit-panel.component.scss'],
})
export class UnitPanelComponent implements OnInit {
    active = 'information';

    unit$!: Observable<Unit>;

    constructor(
        public route: ActivatedRoute,
        private unitService: UnitsService,
        private alertsService: AlertsService
    ) {}

    ngOnInit(): void {
        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
            // tslint:disable-next-line: radix
            this.loadUnit(parseInt(idParam));
        }
    }

    private loadUnit(id: number) {
        this.unit$ = this.unitService.getUnitInfo(id);
    }

    onActionResult(result: ActionResultEvent) {
        window.scroll(0, 0);
        this.alertsService.showAlert(result);
        if (result.data) this.loadUnit(result.data);
    }

    canShareUnit(u: Unit): boolean {
        return canShareUnit(u);
    }

    canHaveRatings(u: Unit): boolean {
        return canHaveRatings(u);
    }

    hasOriginalUnit(u: Unit): boolean {
        return hasOriginalUnit(u);
    }
}
