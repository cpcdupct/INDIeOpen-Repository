import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionResultEventType } from '@core/models';
import { Video } from '@core/models/video';
import { FormErrorHandlerService, ToastrWrapperService } from '@core/services';
import { RouterExtService } from '@core/services/router-ext/router-ext.service';
import { InputData } from '@shared/models';

import { CreateVideoModel } from '../../models';
import { validateURL } from '../../models/validators';
import { VideosService } from '../../services';

@Component({
    selector: 'io-create-video',
    templateUrl: './create-video.component.html',
    styleUrls: ['./create-video.component.scss'],
})
export class CreateVideoComponent implements OnInit {
    /** FORM */
    videoForm!: FormGroup;
    isSubmitted = false;
    allowSubmit = true;
    component = 'videos.create';

    nameInput: InputData = {
        component: this.component,
        name: 'name',
        type: 'text',
        label: true,
        required: true,
        minLength: 1,
        maxLength: 250,
        control: new FormControl('', [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(250),
        ]),
    };

    urlInput: InputData = {
        component: this.component,
        name: 'url',
        type: 'url',
        label: true,
        required: true,
        control: new FormControl('', [Validators.required, validateURL]),
    };

    /** VIDEO */
    existingVideo!: Video;
    mode = 'CREATE';

    /** DATA */
    private lastUrl!: string;

    constructor(
        private formBuilder: FormBuilder,
        private videoService: VideosService,
        private toastrWrapper: ToastrWrapperService,
        private router: Router,
        private route: ActivatedRoute,
        private urlService: RouterExtService,
        private formErrorService: FormErrorHandlerService
    ) {}

    ngOnInit(): void {
        const videoId = this.route.snapshot.paramMap.get('id');
        if (videoId) {
            this.mode = 'UPDATE';

            this.videoService.findVideo(parseInt(videoId)).subscribe((video: Video) => {
                this.existingVideo = video;
                this.nameInput.control.setValue(this.existingVideo.name);
                this.urlInput.control.setValue(this.existingVideo.videoURL);
                this.urlInput.control.disable({ onlySelf: true });
            });
        }

        this.initForm();

        this.urlService.previousUrl$.subscribe((previousUrl: string) => {
            this.lastUrl = previousUrl;
        });
    }

    private initForm() {
        this.videoForm = this.formBuilder.group({
            name: this.nameInput.control,
            url: this.urlInput.control,
        });
    }

    submit() {
        this.isSubmitted = true;

        if (this.videoForm.invalid) {
            this.toastrWrapper.error('messages.form_error.message', 'messages.form_error.title');

            this.videoForm.markAllAsTouched();
            window.scroll(0, 0);
            return;
        } else {
            this.allowSubmit = false;
            const videoBean: CreateVideoModel = this.videoForm.value as CreateVideoModel;

            if (this.mode === 'UPDATE') {
                this.videoService.updateVideo(this.existingVideo.id, videoBean.name).subscribe(
                    (res: Video) => {
                        this.onRequestSuccess();
                    },
                    (errorResponse: HttpErrorResponse) => {
                        this.formErrorService.handleError(errorResponse);
                        this.allowSubmit = true;
                    }
                );
            } else {
                this.videoService.createVideo(videoBean).subscribe(
                    (res: Video) => {
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

    private onRequestSuccess() {
        this.router.navigateByUrl(this.lastUrl !== '/' ? this.lastUrl : '/videos', {
            state: {
                type: ActionResultEventType.SUCCESS,
                key: 'videos.create.messages.created_video.ok.message',
            },
        });
    }

    get formControls() {
        return this.videoForm.controls;
    }

    isUpdate() {
        return this.mode === 'UPDATE';
    }
}
