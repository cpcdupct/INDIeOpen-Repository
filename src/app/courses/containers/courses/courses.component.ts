import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionResultEvent, Course } from '@core/models';
import { CoursesService } from '@core/services';
import { AlertsService } from '@shared/components/alerts/alerts.service';
import { LoaderService } from '@shared/components/loader/loader.service';
import { PAGE_DEFAULT_PAGE, PAGE_DEFAULT_SIZE } from '@shared/models';
import { Observable } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';

/**
 * Component that represents the /course page
 */
@Component({
    selector: 'io-courses',
    templateUrl: './courses.component.html',
    styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit {
    courses$!: Observable<Course[]>;

    /** Page Request */
    page: number = PAGE_DEFAULT_PAGE;
    /**  Page size */
    size: number = PAGE_DEFAULT_SIZE;
    /** Total number of elements */
    total!: number;
    /** Action result event state */
    lastState!: any;
    /** Last page */
    lastPage: number = 0;

    constructor(
        private coursServices: CoursesService,
        private loaderService: LoaderService,
        private alertsService: AlertsService,
        private router: Router
    ) {
        this.lastState = this.router.getCurrentNavigation()?.extras.state;
    }

    ngOnInit(): void {
        this.loadCourses(1);
    }

    ngAfterViewInit(): void {
        if (this.lastState) this.notifyState();
    }

    /**
     * Notify the action result and show an alert
     */
    private notifyState() {
        const event: ActionResultEvent = {
            messageKey: this.lastState.key,
            type: this.lastState.type,
        };

        this.alertsService.showAlert(event);
    }

    /**
     * Load the page of courses of the current user
     *
     * @param page Page number
     */
    loadCourses(page: number) {
        this.loaderService.loadingOn();
        // Fix incorrect page numbers
        if (page * this.size > this.total) page = this.lastPage;
        else if (page < 1) page = 1;

        this.courses$ = this.coursServices.findCourses(page).pipe(
            tap(res => {
                this.total = res.length;
                this.page = page;
                this.lastPage =
                    Math.floor(this.total / this.size) + (this.total % this.size === 0 ? 0 : 1);
            }),
            map(res => res.items),
            finalize(() => this.loaderService.loadingOff())
        );
    }

    onDeletedCourse(event: ActionResultEvent) {
        this.loadCourses(1);
        this.alertsService.showAlert(event);
    }
}
