import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { TenantService } from '../tenant/tenant.service';

/**
 * Service that creates every URL that is generated in the INDIe Ecosystem. Editor URLs and content server URLs.
 */
@Injectable({
    providedIn: 'root',
})
export class URLResourceService {
    /** INDIe Editor baseurl */
    private INDIE_EDITOR_URL = environment.indieEditorURL;

    /** Content server baseurl */
    private PUBLIC_CONTENT = environment.indiePublicContentUrl;

    /** Open content baseurl */
    private PRIVATE_CONTENT = environment.indiePrivateContentUrl;

    /** Course URL */
    private COURSE_BASE = environment.courseBaseUrl;

    constructor(private tenantService: TenantService) {}

    /**
     * Builds and returns a INDIe editor URL with a token
     *
     * @param token Editor token
     */
    buildIndieEditorURL(token: string) {
        return this.INDIE_EDITOR_URL + '/entry/' + token;
    }

    /**
     * Builds and returns a Open content URL with a unit resource
     *
     * @param resource Unit resource (teacher id + unit resource id)
     */
    buildOpenPublishedURL(resource: string) {
        return this.PUBLIC_CONTENT + '/' + resource + '/';
    }

    /**
     * Builds and returns a Content server URL with a unit resource
     *
     * @param resource Unit resource (teacher id + unit resource id)
     */
    buildPublishedURL(resource: string): string {
        return `${this.PRIVATE_CONTENT}/${resource}/?origin=${
            this.tenantService.getCurrentTenant().id
        }`;
    }

    buildCourseUrl(courseId: string, tenant: string) {
        return `${this.COURSE_BASE}course=${courseId}&origin=${tenant}`;
    }
}
