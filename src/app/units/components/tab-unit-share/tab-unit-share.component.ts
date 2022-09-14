import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
    ActionResultEvent,
    ActionResultEventType,
    CreativeCommons,
    getLicenseFromCreativeCommons,
    Unit,
} from '@core/models';
import { FormErrorHandlerService, ToastrWrapperService, UnitsService } from '@core/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmActionComponent, LoadingModalComponent } from '@shared/modals';
import { ModalData, OptionItem, OptionWrapper } from '@shared/models';

import { HelpLicensesComponent } from '../../modals';

@Component({
    selector: 'io-tab-unit-share',
    templateUrl: './tab-unit-share.component.html',
    styleUrls: ['./tab-unit-share.component.scss'],
})
export class TabUnitShareComponent implements OnInit {
    @Input()
    unit!: Unit;

    @Output()
    actionResult = new EventEmitter<ActionResultEvent>();

    licenseOptions: OptionWrapper = {
        selected: '',
        options: [
            {
                label: 'creative-commons.PRIVATE',
                value: CreativeCommons.PRIVATE,
                group: 'private',
            },
            {
                label: 'creative-commons.BY',
                value: CreativeCommons.BY,
                group: 'reuse',
            },
            {
                label: 'creative-commons.BYSA',
                value: CreativeCommons.BYSA,
                group: 'reuse',
            },
            {
                label: 'creative-commons.BYND',
                value: CreativeCommons.BYND,
                group: 'readonly',
            },
            {
                label: 'creative-commons.BYNC',
                value: CreativeCommons.BYNC,
                group: 'reuse',
            },
            {
                label: 'creative-commons.BYNCND',
                value: CreativeCommons.BYNCND,
                group: 'readonly',
            },
            {
                label: 'creative-commons.BYNCSA',
                value: CreativeCommons.BYNCSA,
                group: 'reuse',
            },
        ],
    };

    constructor(
        private toastrWrapper: ToastrWrapperService,
        private modalService: NgbModal,
        private unitsService: UnitsService,
        private formErrorService: FormErrorHandlerService
    ) {}

    ngOnInit(): void {
        this.licenseOptions.selected = this.unit.creativeCommons;
    }

    changeLicense() {
        if (this.unit.license !== this.licenseOptions.selected) {
            const modal = this.modalService.open(
                ConfirmActionComponent,
                ConfirmActionComponent.options
            );

            const data: ModalData = {
                message: 'units.tab-unit-share.messages.confirm_license_change',
            };

            modal.componentInstance.data = data;

            modal.result.then(result => {
                if (result) {
                    const loadingModal = this.modalService.open(
                        LoadingModalComponent,
                        LoadingModalComponent.options
                    );

                    const ccSelected = this.licenseOptions.selected as CreativeCommons;

                    loadingModal.componentInstance.data = {
                        message: 'units.tab-unit-share.messages.changing_license',
                    } as ModalData;

                    this.unitsService.changeLicense(this.unit.id, ccSelected).subscribe(
                        res => {
                            loadingModal.dismiss();
                            this.toastrWrapper.success(
                                'units.tab-unit-share.messages.license_changed',
                                'common.success'
                            );
                            this.unit.license = getLicenseFromCreativeCommons(ccSelected);
                            this.unit.creativeCommons = ccSelected;
                            this.licenseOptions.selected = this.unit.creativeCommons;

                            this.actionResult.emit({
                                messageKey: 'units.tab_unit_info.messages.update_unit.ok.message',
                                type: ActionResultEventType.SUCCESS,
                                data: this.unit.id,
                            });
                        },
                        (error: HttpErrorResponse) => {
                            this.formErrorService.handleError(error);
                            this.licenseOptions.selected = this.unit.creativeCommons;
                            loadingModal.dismiss();
                            this.toastrWrapper.success('common.error', 'common.error');
                        }
                    );
                }
            });
        } else {
            this.toastrWrapper.warning(
                'units.tab-unit-share.messages.same_license.message',
                'units.tab-unit-share.messages.same_license.title'
            );
        }
    }

    showLicensesModal() {
        this.modalService.open(HelpLicensesComponent, HelpLicensesComponent.options);
    }

    getOptionsByGroup(group: string): OptionItem[] {
        return this.licenseOptions.options.filter(o => o.group === group);
    }
}
