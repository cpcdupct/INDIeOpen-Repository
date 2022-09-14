import { Component, Input, OnInit } from '@angular/core';
import { canEditUnit, Unit, UnitMode, UnitType } from '@core/models';
import { UnitsService } from '@core/services';
import { URLResourceService } from '@core/services/';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ViewUrlModalComponent } from '@shared/modals';
import { ModalData } from '@shared/models';

@Component({
    selector: 'io-list-unit',
    templateUrl: './list-unit.component.html',
    styleUrls: ['./list-unit.component.scss'],
})
export class ListUnitComponent implements OnInit {
    static options: NgbModalOptions = {
        windowClass: 'modal-holder view-unit',
        keyboard: true,
    };

    constructor(
        private unitSerivce: UnitsService,
        private modalService: NgbModal,
        private resourceService: URLResourceService
    ) {}

    @Input()
    item!: Unit;

    /** Loaders */
    previewLoader = false;
    editLoader = false;

    ngOnInit(): void {}

    itemTypeClass(): string {
        if (this.item.type === UnitType.CONENT) return 'badge-primary';
        else return 'badge-secondary';
    }

    type(): string {
        if (this.item.type === UnitType.CONENT) return 'types.content';
        else return 'types.evaluation';
    }

    preview() {
        this.previewLoader = true;

        this.unitSerivce.previewUnit(this.item.id).subscribe(
            res => {
                const data: ModalData = {
                    title: 'units.list-unit.preview-title',
                    message: 'units.list-unit.preview-message',
                    link: res.url,
                };

                this.previewLoader = false;

                const modalRef = this.modalService.open(
                    ViewUrlModalComponent,
                    ViewUrlModalComponent.options
                );

                modalRef.componentInstance.data = data;

                window.open(res.url, '_blank');
            },
            err => {
                this.previewLoader = false;
            }
        );
    }

    isOriginalUnit(): boolean {
        return this.item.mode === UnitMode.ORIGINAL;
    }

    canEdit(): boolean {
        return (
            canEditUnit(this.item) &&
            (this.item.mode === UnitMode.ORIGINAL || this.item.mode === UnitMode.REUSED)
        );
    }

    goToEditor() {
        this.unitSerivce.generateEditToken(this.item.id).subscribe(
            res => {
                const editorLink: string = this.resourceService.buildIndieEditorURL(res.token);
                window.open(editorLink, '_blank');
            },
            err => {
                this.editLoader = false;
            }
        );
    }

    getBadgeLicenseClass(): string {
        return this.item.mode === UnitMode.COPIED ? 'badge badge-read-only' : 'badge badge-reuse';
    }
}
