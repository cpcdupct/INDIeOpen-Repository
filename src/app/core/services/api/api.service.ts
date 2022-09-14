import { HttpClient, HttpHeaders, HttpParameterCodec, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { TenantService } from '../tenant/tenant.service';

/**
 * Class that encode key and values from a URI
 */
class ParameterCodec implements HttpParameterCodec {
    encodeKey(key: string): string {
        return encodeURIComponent(key);
    }

    encodeValue(value: string): string {
        return encodeURIComponent(value);
    }

    decodeKey(key: string): string {
        return decodeURIComponent(key);
    }

    decodeValue(value: string): string {
        return decodeURIComponent(value);
    }
}

const PARAMETER_CODEC = new ParameterCodec();

/**
 * Class that offers web API calls (GET, POST, PUT, DELETE) to a backend.
 */
@Injectable({
    providedIn: 'root',
})
export class ApiService {
    /** API URL Base */
    private readonly API_URL = environment.apiUrl;

    constructor(private http: HttpClient, private tenantService: TenantService) {}

    /**
     * Sends a POST request to the API with the headers and params set by default in the class
     *
     * @param url Partial URL that will be appended to the URL base
     * @param data Key-Value object that contains POST request parameters
     * @param auth Token that the auth process requires
     */
    public post<T>(url: string, data: any, auth: string | undefined): Observable<T> {
        return this.http.post<T>(this.API_URL + url, data, {
            headers: this.headers(auth),
            params: this.params(),
        });
    }

    /**
     * Sends a POST request to the requested URL with custom headers
     *
     * @param url Full URL that will be used in the request
     * @param data Key-Value object that contains POST request parameters
     * @param headers Custom HttpHeaders that will be used in the request
     * @param sendCredentials Boolean that indicates wether credentials must be sent to the server
     */
    public postWithHeadersAndFullURL<T>(
        url: string,
        data: any,
        headers: HttpHeaders,
        sendCredentials: boolean
    ): Observable<T> {
        return this.http.post<T>(url, data, {
            headers,
            params: this.params(),
            withCredentials: sendCredentials,
        });
    }

    /**
     *  Sends a POST request to the API with custom headers and params set by default in the class
     *
     * @param url Partial URL that will be appended to the URL base
     * @param data Key-Value object that contains POST request parameters
     * @param headers Custom HttpHeaders that will be used in the request
     */
    public postWithHeaders<T>(url: string, data: any, headers: HttpHeaders): Observable<T> {
        return this.http.post<T>(this.API_URL + url, data, {
            headers,
            params: this.params(),
        });
    }

    /**
     * Sends a PUT request to the API with the headers and params set by default in the class
     *
     * @param url Partial URL that will be appended to the URL base
     * @param data Key-Value object that contains POST request parameters
     * @param auth Token that the auth process requires
     */
    public put<T>(url: string, data: any, auth: string | undefined): Observable<T> {
        return this.http.put<T>(this.API_URL + url, data, {
            headers: this.headers(auth),
            params: this.params(),
        });
    }

    /**
     * Sends a GET request to API with the headers
     *
     * @param url Partial URL that will be appended to the URL base
     * @param auth Token that the auth process requires
     */
    public get<T>(url: string, auth: string | undefined, params?: any): Observable<T> {
        return this.http.get<T>(this.API_URL + url, {
            headers: this.headers(auth),
            params: this.params(params),
        });
    }

    /**
     * Sends a GET request to the URL with custom headers
     *
     * @param url Full URL that will be used in the request
     * @param headers Custom HttpHeaders that will be used in the request
     */
    public getWithHeadersAndFullURL<T>(url: string, headers: HttpHeaders) {
        return this.http.get<T>(url, {
            headers,
            params: this.params(),
        });
    }

    /**
     * Sends a DELETE request to the API
     *
     * @param url Partial URL that will be appended to the URL base
     * @param auth Token that the auth process requires
     * @param params Key-value query params object
     */
    public delete<T>(url: string, auth: string | undefined, params?: any): Observable<T> {
        return this.http.delete<T>(this.API_URL + url, {
            headers: this.headers(auth),
            params: this.params(params),
        });
    }

    /**
     * Creates a HttpHeaders object for API requests. It can include authentication headers if set.
     *
     * @param auth Authentication token
     */
    private headers(auth: string | undefined): HttpHeaders {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');

        if (auth) headers = headers.set('Authorization', 'Bearer ' + auth);

        headers = headers.set('X-TenantID', this.tenantService.getCurrentTenant().id);

        return headers;
    }

    /**
     * Creates a HttpParams object for API requests with custom params if they are set
     *
     * @param customParams Key-value quer params
     */
    private params(customParams?: any): HttpParams {
        let params = new HttpParams({
            encoder: PARAMETER_CODEC,
        });

        if (customParams) {
            for (const key of Object.keys(customParams)) {
                params = params.set(key, customParams[key]);
            }
        }

        return params;
    }
}
