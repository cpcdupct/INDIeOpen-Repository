import { Injectable } from '@angular/core';
import { Course, TokenResource } from '@core/models';
import { createPageResponse, Page, PAGE_DEFAULT_SIZE } from '@shared/models';
import { LTIUser } from 'app/units/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';

/**
 * Services that handles the Course entity comunication between the webapp and the API.
 */
@Injectable({
    providedIn: 'root',
})
export class CoursesService {
    constructor(private api: ApiService, private authService: AuthService) {}

    /**
     * Finds a Page of Course items
     *
     * @param page Page number
     */
    findCourses(page: number): Observable<Page<Course>> {
        let params: any = {
            page: page - 1,
            size: PAGE_DEFAULT_SIZE,
        };

        return this.api
            .get<Page<Course>>('/indieopen/courses/', this.auth(), params)
            .pipe(map(res => createPageResponse(res)));
    }

    /**
     * Generates a token for accessing the editor. The token is associated with a Course with given id
     *
     * @param id Course id
     */
    generateEditToken(id: number): Observable<TokenResource> {
        return this.api.get<TokenResource>('/indieopen/courses/' + id + '/edit', this.auth());
    }

    /**
     * Find a Course information given its id
     *
     * @param id Course id
     */
    findCourse(id: number): Observable<Course> {
        return this.api.get<Course>('/indieopen/course/' + id, this.auth());
    }

    /**
     * Create a Course
     *
     * @param courseBean Course creation bean
     */
    createCourse(courseBean: { name: string }) {
        return this.api.post<Course>('/indieopen/courses/', { name: courseBean.name }, this.auth());
    }

    /**
     * Updates a course
     *
     * @param id Course id
     * @param name Course name
     */
    updateCourse(id: number, name: string) {
        return this.api.put<Course>('/indieopen/courses/' + id + '/info', { name }, this.auth());
    }

    /**
     * Publish a course
     * @param id Course id
     *
     * @returns
     */
    publishCourse(id: number) {
        return this.api.post('/indieopen/courses/' + id + '/publish', {}, this.auth());
    }

    /**
     * Delete a course by id
     *
     * @param id Course id
     */
    deleteCourse(id: number) {
        return this.api.delete('/indieopen/courses/' + id, this.auth());
    }

    /**
     * Get access token
     */
    private auth() {
        return this.authService.getCurrentUser().access_token;
    }
}
