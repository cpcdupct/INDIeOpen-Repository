import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import {
    ActionResultEvent,
    ActionResultEventType,
    Course,
    isCoursePublished,
    TokenResource,
} from '@core/models';
import {
    CoursesService,
    TenantService,
    ToastrWrapperService,
    URLResourceService,
} from '@core/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmActionComponent } from '@shared/modals';
import { ModalData } from '@shared/models';
import { AuthorizedCourseModalComponent } from 'app/courses/modals';
import { Clipboard } from '@angular/cdk/clipboard';

/**
 * Component that represents a course item in the list of Courses
 */
@Component({
    selector: 'io-list-course',
    templateUrl: './list-course.component.html',
    styleUrls: ['./list-course.component.scss'],
})
export class ListCourseComponent implements OnInit {
    /** Course instance */
    @Input()
    course!: Course;

    /** Variable for publishing loader */
    publishing = false;

    deletedCourse = new EventEmitter<ActionResultEvent>();

    constructor(
        private courseService: CoursesService,
        private resourceService: URLResourceService,
        private clipboard: Clipboard,
        private toastrWrapper: ToastrWrapperService,
        private resources: URLResourceService,
        private tenantService: TenantService,
        private modalService: NgbModal
    ) {}

    ngOnInit(): void {}

    /**
     * Redirects the user to the editor for editing this course
     */
    goToEditor() {
        this.courseService
            .generateEditToken(this.course.id)
            .subscribe((resource: TokenResource) => {
                const editorLink = this.resourceService.buildIndieEditorURL(resource.token);
                window.open(editorLink, '_blank');
            });
    }

    /**
     * Return wether a course is published
     */
    isCoursePublished(): boolean {
        return isCoursePublished(this.course);
    }

    /**
     * Publish a course
     */
    publishCourse() {
        this.publishing = true;

        this.courseService.publishCourse(this.course.id).subscribe(
            res => {
                this.publishing = false;
                this.course.draft = false;
                this.course.publishedAt = new Date(Date.now());
                this.toastrWrapper.success('courses.messages.course_published', 'common.success');
            },
            err => {
                this.publishing = false;
            }
        );
    }

    /**
     * Copy the shared url to the clipboard
     */
    copyShareURL() {
        this.clipboard.copy(
            this.resources.buildCourseUrl(
                this.course.externalID,
                this.tenantService.getCurrentTenant().id
            )
        );

        this.toastrWrapper.info(
            'courses.messages.copied_to_clipboard.message',
            'courses.messages.copied_to_clipboard.title'
        );
    }

    showAuthorizedModal() {
        const modal = this.modalService.open(
            AuthorizedCourseModalComponent,
            AuthorizedCourseModalComponent.options
        );

        modal.componentInstance.course = this.course;

        modal.result.then(result => {}).catch(err => {});
    }

    deleteCourse() {
        const modal = this.modalService.open(
            ConfirmActionComponent,
            ConfirmActionComponent.options
        );

        const modalData: ModalData = {
            message: 'courses.messages.delete.message',
            title: 'courses.messages.delete.title',
            actionButton: 'courses.messages.delete.button',
            actionDanger: true,
        };

        modal.componentInstance.data = modalData;

        modal.result
            .then(result => {
                if (result) {
                    this.courseService.deleteCourse(this.course.id).subscribe(
                        res => {
                            this.deletedCourse.emit({
                                messageKey: 'courses.message.course-deleted',
                                type: ActionResultEventType.SUCCESS,
                            });
                        },
                        err => {}
                    );
                }
            })
            .catch(err => {});
    }
}
