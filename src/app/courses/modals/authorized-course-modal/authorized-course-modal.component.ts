import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Course } from '@core/models';
import { NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { LTIUser } from 'app/units/models';
import { LTIUsersService } from 'app/units/services/ltiusers.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'io-authorized-course-modal',
    templateUrl: './authorized-course-modal.component.html',
    styleUrls: ['./authorized-course-modal.component.scss'],
})
export class AuthorizedCourseModalComponent implements OnInit {
    @ViewChild('userInput')
    userInput!: ElementRef<HTMLInputElement>;

    @ViewChild('lti')
    lti!: ElementRef<HTMLInputElement>;

    @Input()
    course!: Course;

    public static options: NgbModalOptions = {
        keyboard: true,
        windowClass: 'modal-holder',
        size: 'xl',
    };

    initialUsers: LTIUser[] = [];
    selectedUsers: LTIUser[] = [];

    userFilter = new FormControl('');
    availableUsers$!: Observable<LTIUser[]>;
    filteredUsers$!: Observable<LTIUser[]>;
    userCtrl = new FormControl('');

    constructor(
        private activeModal: NgbActiveModal,
        private ltiusers: LTIUsersService,
        private translateService: TranslateService
    ) {}

    private usersChanged() {
        return !(
            this.selectedUsers.every(user => this.initialUsers.includes(user)) &&
            this.initialUsers.every(user => this.selectedUsers.includes(user))
        );
    }

    ngOnInit(): void {
        this.availableUsers$ = this.ltiusers.findAvailableUsers().pipe(
            map(res => {
                res.map(user => (user.name = `${user.name} (${user.email})`));
                return res;
            })
        );

        this.ltiusers.findAccessesByCourse(this.course.id).subscribe(res => {
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

    selected(event: MatAutocompleteSelectedEvent) {
        this.selectedUsers.push(event.option.value);
        this.userInput.nativeElement.value = '';
        this.lti.nativeElement.innerHTML = this.translateService.instant(
            'courses.authorized.added'
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
                'courses.authorized.deleted'
            );
            setTimeout(() => {
                this.lti.nativeElement.innerHTML = '';
            }, 150);
        }
    }

    close() {
        this.activeModal.close(this.initialUsers);
    }

    save() {
        // Do not send a request if the list has not changed
        if (this.usersChanged()) {
            this.ltiusers
                .updateCourseAccess(
                    this.course.id,
                    this.selectedUsers.map(user => (typeof user === 'string' ? user : user.email))
                )
                .subscribe(
                    res => {},
                    err => {
                        console.error(err);
                    }
                );
        }
        this.activeModal.close(this.selectedUsers);
    }
}
