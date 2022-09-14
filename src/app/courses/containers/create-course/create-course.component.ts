import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionResultEventType, Course } from '@core/models';
import { CoursesService, FormErrorHandlerService, ToastrWrapperService } from '@core/services';
import { RouterExtService } from '@core/services/router-ext/router-ext.service';
import { InputData } from '@shared/models';

@Component({
    selector: 'io-create-course',
    templateUrl: './create-course.component.html',
    styleUrls: ['./create-course.component.scss'],
})
export class CreateCourseComponent implements OnInit {
    /** Course form */
    courseForm!: FormGroup;
    /** Form is submitted */
    isSubmitted = false;
    /** Allow submit the form */
    allowSubmit = true;
    /** Component translation key */
    component = 'courses.create';

    /** Course name */
    nameInput: InputData = {
        component: this.component,
        name: 'name',
        type: 'text',
        label: true,
        required: true,
        control: new FormControl('', [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(250),
        ]),
    };

    /** COURSE */
    existingCourse!: Course;
    /** Form mode */
    mode = 'CREATE';
    /** Last accessed url */
    private lastUrl!: string;

    constructor(
        private formBuilder: FormBuilder,
        private toastrWrapper: ToastrWrapperService,
        private route: ActivatedRoute,
        private router: Router,
        private courseSerivce: CoursesService,
        private urlService: RouterExtService,
        private formErrorService: FormErrorHandlerService
    ) {}

    /**
     * @inheritdoc
     *
     * Sets up the course form in the corresponding mode in case of a course id as a route param.
     */
    ngOnInit(): void {
        // Setup the form mode in case of existing course
        const courseId = this.route.snapshot.paramMap.get('id');
        if (courseId) {
            this.mode = 'UPDATE';

            this.courseSerivce.findCourse(parseInt(courseId)).subscribe((course: Course) => {
                this.existingCourse = course;
                this.nameInput.control.setValue(this.existingCourse.name);
            });
        }

        this.initForm();

        this.urlService.previousUrl$.subscribe((previousUrl: string) => {
            this.lastUrl = previousUrl;
        });
    }

    /**
     * On submit event fired from the Form
     */
    submit() {
        this.isSubmitted = true;

        if (this.courseForm.invalid) {
            this.toastrWrapper.error('messages.form_error.message', 'messages.form_error.title');

            this.courseForm.markAllAsTouched();
            window.scroll(0, 0);
            return;
        } else {
            this.allowSubmit = false;
            const courseBean = this.courseForm.value as { name: string };

            if (this.mode === 'UPDATE') {
                this.courseSerivce.updateCourse(this.existingCourse.id, courseBean.name).subscribe(
                    (res: Course) => {
                        this.onRequestSuccess();
                    },
                    (errorResponse: HttpErrorResponse) => {
                        this.formErrorService.handleError(errorResponse);
                        this.allowSubmit = true;
                    }
                );
            } else {
                this.courseSerivce.createCourse(courseBean).subscribe(
                    (res: Course) => {
                        this.onRequestSuccess();
                    },
                    (errorResponse: HttpErrorResponse) => {
                        this.formErrorService.handleError(errorResponse);
                        this.allowSubmit = true;
                    }
                );
            }
        }
    }

    /**
     * Return wether the form is in UPDATE mode
     */
    isUpdate() {
        return this.mode === 'UPDATE';
    }

    /**
     * Success event in the request response
     */
    private onRequestSuccess() {
        this.router.navigateByUrl(this.lastUrl !== '/' ? this.lastUrl : '/courses', {
            state: {
                type: ActionResultEventType.SUCCESS,
                key: 'courses.create.messages.created_course.ok.message',
            },
        });
    }

    /**
     * Init the form
     */
    private initForm() {
        this.courseForm = this.formBuilder.group({
            name: this.nameInput.control,
        });
    }
}
