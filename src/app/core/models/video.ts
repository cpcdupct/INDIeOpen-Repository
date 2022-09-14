import { environment } from 'environments/environment';

/** Interactive video */
export interface Video {
    /** Video id */
    id: number;
    /** Created at date */
    createdAt: Date;
    /** Video name */
    name: string;
    /** INDIeMedia Video URL */
    videoURL: string;
    /** Published at date */
    publishedAt?: Date;
    /** Video draft */
    draft: boolean;
    /** Video public external ID */
    externalID?: string;
}

/**
 * Check wether a video has been published
 *
 * @param video Video instance
 */
export function isVideoPublished(video: Video) {
    return video.publishedAt !== undefined && video.publishedAt !== null;
}

/**
 * Get a public video url to be used within the INDIeEditor video
 *
 * @param video Video instance
 * @param origin Tenant origin name
 *
 * @returns A public URL
 */
export function getSharedVideoURL(video: Video, origin: string) {
    return `${environment.apiUrl}/indieopen/video/embed/${video.externalID}?origin=${origin}`;
}
