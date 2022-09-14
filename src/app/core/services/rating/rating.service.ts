import { Injectable } from '@angular/core';
import { Rating } from '@core/models/rating';
import { createPageResponse, Page, PAGE_DEFAULT_SIZE } from '@shared/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';

/**
 * Services that handles the Rating entity comunication between the webapp and the API.
 */
@Injectable({
    providedIn: 'root',
})
export class RatingService {
    constructor(private api: ApiService, private authService: AuthService) {}

    /**
     * Finds a rating by id
     *
     * @param id Rating id
     */
    findRating(id: number): Observable<Rating> {
        return this.api.get<Rating>(
            '/indieopen/rating/find/' + id,
            this.authService.getCurrentUser().access_token
        );
    }

    /**
     * Rates a unit by id with a rating value
     *
     * @param id Unit id of the unit rated
     * @param rate Rating value
     */
    rateUnit(id: number, rate: number): Observable<Rating> {
        return this.api.post<Rating>(
            '/indieopen/rating/unit/' + id,
            { rating: rate },
            this.authService.getCurrentUser().access_token
        );
    }

    /**
     * Get a page of Rating with the ratings of a unit
     *
     * @param page Page number
     * @param id Unit id
     */
    getRatingsFromUnit(page: number, id: number): Observable<Page<Rating>> {
        const params: any = {
            page: page - 1,
            size: PAGE_DEFAULT_SIZE,
        };

        return this.api
            .get<Page<Rating>>(
                '/indieopen/rating/list/' + id,
                this.authService.getCurrentUser().access_token,
                params
            )
            .pipe(map(res => createPageResponse(res)));
    }

    /**
     * Get the average rating value and rating count from a unit
     *
     * @param id Unit id
     */
    findAverageRating(id: number): Observable<{ count: number; average: number }> {
        return this.api.get<{ count: number; average: number }>(
            '/indieopen/rating/average/' + id,
            this.authService.getCurrentUser().access_token
        );
    }
}
