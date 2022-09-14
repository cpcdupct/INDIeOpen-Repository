import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActionResultEvent, ActionResultEventType, TokenResource } from '@core/models';
import { getSharedVideoURL, isVideoPublished, Video } from '@core/models/video';
import { URLResourceService, ToastrWrapperService, TenantService } from '@core/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmActionComponent } from '@shared/modals';
import { ModalData } from '@shared/models';
import { Clipboard } from '@angular/cdk/clipboard';

import { VideosService } from '../../services';

@Component({
    selector: 'io-list-video',
    templateUrl: './list-video.component.html',
    styleUrls: ['./list-video.component.scss'],
})
export class ListVideoComponent implements OnInit {
    @Input()
    video!: Video;

    @Output()
    deletedVideo = new EventEmitter<ActionResultEvent>();

    publishing = false;

    constructor(
        private videoService: VideosService,
        private resourceService: URLResourceService,
        private modalService: NgbModal,
        private toastrWrapper: ToastrWrapperService,
        private clipboard: Clipboard,
        private tenantService: TenantService
    ) {}

    ngOnInit(): void {}

    isVideoPublished() {
        return isVideoPublished(this.video);
    }

    goToEditor() {
        this.videoService.generateEditToken(this.video.id).subscribe((resource: TokenResource) => {
            const editorLink = this.resourceService.buildIndieEditorURL(resource.token);
            window.open(editorLink, '_blank');
        });
    }

    deleteVideo() {
        const modal = this.modalService.open(
            ConfirmActionComponent,
            ConfirmActionComponent.options
        );

        const data: ModalData = {
            message: 'videos.messages.confirm_delete_video',
        };

        modal.componentInstance.data = data;

        modal.result.then(result => {
            if (result) {
                this.videoService.deleteVideo(this.video.id).subscribe(res => {
                    this.deletedVideo.emit({
                        messageKey: 'videos.messages.video_deleted',
                        type: ActionResultEventType.SUCCESS,
                    });
                });
            }
        });
    }

    publishVideo() {
        this.publishing = true;

        this.videoService.publishVideo(this.video.id).subscribe(
            res => {
                this.publishing = false;
                this.video.draft = false;
                this.video.publishedAt = new Date(Date.now());
                this.toastrWrapper.success('videos.messages.video_published', 'common.success');
            },
            err => {
                this.publishing = false;
            }
        );
    }

    copyShareURL() {
        const tenant = this.tenantService.getCurrentTenant();
        this.clipboard.copy(getSharedVideoURL(this.video, tenant.id));
        this.toastrWrapper.info(
            'videos.messages.copied_to_clipboard.message',
            'videos.messages.copied_to_clipboard.title'
        );
    }
}
