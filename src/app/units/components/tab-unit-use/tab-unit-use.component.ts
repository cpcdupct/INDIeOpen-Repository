import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
    canPublishUnit,
    isOpenPublished,
    isUnitOutdated,
    isUnitPublished,
    Unit,
    URLResource,
} from '@core/models';
import { FormErrorHandlerService, ToastrWrapperService, UnitsService } from '@core/services';
import { URLResourceService } from '@core/services/resources/resources.service';
import { TranslateService } from '@ngx-translate/core';
import { LTIUser } from 'app/units/models';
import { LTIUsersService } from 'app/units/services/ltiusers.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
    selector: 'io-tab-unit-use',
    templateUrl: './tab-unit-use.component.html',
    styleUrls: ['./tab-unit-use.component.scss'],
})
export class TabUnitUseComponent implements OnInit {
    @Input()
    unit!: Unit;

    loading = false;

    initialUsers: LTIUser[] = [];
    selectedUsers: LTIUser[] = [];

    availableUsers$!: Observable<LTIUser[]>;
    filteredUsers$!: Observable<LTIUser[]>;
    userCtrl = new FormControl('');

    learningLoader = false;

    @ViewChild('userInput')
    userInput!: ElementRef<HTMLInputElement>;

    @ViewChild('lti')
    lti!: ElementRef<HTMLInputElement>;

    constructor(
        private toastrWrapper: ToastrWrapperService,
        private clipboard: Clipboard,
        private unitService: UnitsService,
        private formErrorService: FormErrorHandlerService,
        private resourceService: URLResourceService,
        private ltiusers: LTIUsersService,
        private translateService: TranslateService
    ) {}

    ngOnInit(): void {
        this.availableUsers$ = this.ltiusers.findAvailableUsers().pipe(
            map(res => {
                res.map(user => (user.name = `${user.name} (${user.email})`));
                return res;
            })
        );

        this.ltiusers.findUnitAccesesForUnit(this.unit.id).subscribe(res => {
            res.map(user => (user.name = `${user.name} (${user.email})`));
            this.selectedUsers = [...res];
            this.initialUsers = [...res];
        });

        this.userCtrl.valueChanges.subscribe(value => {
            const search =
                typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase();
            this.filteredUsers$ = this.availableUsers$.pipe(
                map(users =>
                    users.filter(
                        u =>
                            u.name.toLowerCase().includes(search || '') &&
                            !this.selectedUsers.map(usr => usr.name).includes(u.name)
                    )
                )
            );
        });
    }

    getResourceUrl(): string {
        if (this.unit.published.resource)
            return this.resourceService.buildPublishedURL(this.unit.published.resource);
        return '';
    }

    getOpenResourceUrl(): string {
        if (this.unit.published.resource)
            return this.resourceService.buildOpenPublishedURL(this.unit.published.resource);
        return '';
    }

    copyResource() {
        this.toastrWrapper.info(
            'units.tab-unit-use.messages.copied_to_clipboard.message',
            'units.tab-unit-use.messages.copied_to_clipboard.title'
        );

        this.clipboard.copy(this.getResourceUrl());
    }

    copyOpenResource() {
        this.toastrWrapper.info(
            'units.tab-unit-use.messages.copied_to_clipboard.message',
            'units.tab-unit-use.messages.copied_to_clipboard.title'
        );

        this.clipboard.copy(this.getOpenResourceUrl());
    }

    canPublish(): boolean {
        return canPublishUnit(this.unit);
    }

    isPublished(): boolean {
        return isUnitPublished(this.unit);
    }

    isOpenPublished(): boolean {
        return isOpenPublished(this.unit);
    }

    isUpToDate(): boolean {
        return !isUnitOutdated(this.unit);
    }

    updateUnit() {
        this.loading = true;

        this.unitService.publishUnit(this.unit.id).subscribe(
            (resource: URLResource) => {
                this.unit.published.publishedDate = new Date();
                this.unit.published.resource = resource.url;
                this.unit.information.draft = false;

                this.toastrWrapper.info(
                    'units.tab-unit-use.messages.unit_published.message',
                    'units.tab-unit-use.messages.unit_published.title'
                );

                this.loading = false;
            },
            (errorResponse: HttpErrorResponse) => {
                this.formErrorService.handleError(errorResponse);
                this.loading = false;
            }
        );
    }

    getLearningBadgeClass() {
        return this.unit.published.analytics ? 'badge-success' : 'badge-warning';
    }

    getLearningBadgeText() {
        const key = this.unit.published.analytics
            ? 'units.tab-unit-use.activated'
            : 'units.tab-unit-use.deactivated';

        return this.translateService.instant(key);
    }

    toggleLearningAnalytics() {
        this.learningLoader = true;

        this.unitService
            .toggleLearningAnalytics(this.unit.id, !this.unit.published.analytics)
            .subscribe(
                res => {
                    this.unit.published.analytics = !this.unit.published.analytics;
                    this.learningLoader = false;
                },
                err => {
                    this.learningLoader = false;
                }
            );
    }

    usersChanged() {
        return !(
            this.selectedUsers.every(user => this.initialUsers.includes(user)) &&
            this.initialUsers.every(user => this.selectedUsers.includes(user))
        );
    }

    authorizeUsers() {
        // Do not send a request if the list has not changed
        if (this.usersChanged()) {
            this.ltiusers
                .updateUintAccess(
                    this.unit.id,
                    this.selectedUsers.map(user => (typeof user === 'string' ? user : user.email))
                )
                .subscribe(
                    res => {
                        this.toastrWrapper.success(
                            'units.tab-unit-use.authorized.updated',
                            'common.success'
                        );
                        this.initialUsers = [...this.selectedUsers];
                    },
                    err => {
                        console.error(err);
                    }
                );
        }
    }

    selected(event: MatAutocompleteSelectedEvent) {
        this.selectedUsers.push(event.option.value);
        this.userInput.nativeElement.value = '';
        this.lti.nativeElement.innerHTML = this.translateService.instant(
            'units.tab-unit-use.authorized.added'
        );
        setTimeout(() => {
            this.lti.nativeElement.innerHTML = '';
        }, 150);
    }

    remove(user: { email: string; name: string }) {
        const idx = this.selectedUsers.indexOf(user);
        if (idx >= 0) {
            this.selectedUsers.splice(idx, 1);
            this.lti.nativeElement.innerHTML = this.translateService.instant(
                'units.tab-unit-use.authorized.deleted'
            );
            setTimeout(() => {
                this.lti.nativeElement.innerHTML = '';
            }, 150);
        }
    }
}
