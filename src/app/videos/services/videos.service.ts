import { Injectable } from '@angular/core';
import { TokenResource } from '@core/models';
import { Video } from '@core/models/video';
import { ApiService, AuthService } from '@core/services';
import { createPageResponse, Page, PAGE_DEFAULT_SIZE } from '@shared/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CreateVideoModel } from '../models';

@Injectable({
    providedIn: 'root',
})
export class VideosService {
    constructor(private api: ApiService, private authService: AuthService) {}

    findVideos(page: number, requestParams?: any): Observable<Page<Video>> {
        let params: any = {
            page: page - 1,
            size: PAGE_DEFAULT_SIZE,
        };

        if (requestParams.sort) params.sort = requestParams.sort;

        if (requestParams) params = { ...params, ...requestParams };

        return this.api
            .get<Page<Video>>('/indieopen/videos', this.auth(), params)
            .pipe(map(res => createPageResponse(res)));
    }

    createVideo(createVideoBean: CreateVideoModel): Observable<Video> {
        return this.api.post<Video>('/indieopen/videos/', createVideoBean, this.auth());
    }

    findVideo(videoId: number): Observable<Video> {
        return this.api.get<Video>('/indieopen/videos/' + videoId + '/details', this.auth());
    }

    updateVideo(id: number, name: string) {
        return this.api.put<Video>('/indieopen/videos/' + id + '/info', { name }, this.auth());
    }

    generateEditToken(videoId: number): Observable<TokenResource> {
        return this.api.get<TokenResource>('/indieopen/videos/' + videoId + '/edit', this.auth());
    }

    deleteVideo(id: number) {
        return this.api.delete('/indieopen/videos/' + id, this.auth());
    }

    publishVideo(id: number) {
        return this.api.post('/indieopen/videos/' + id + '/publish', {}, this.auth());
    }

    private auth() {
        return this.authService.getCurrentUser().access_token;
    }
}
