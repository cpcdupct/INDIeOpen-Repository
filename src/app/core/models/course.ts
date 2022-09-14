/** File that contains common models for managing the domain concept: Course*/

/**
 * Course
 */
export interface Course {
    /** Course id */
    id: number;
    /** Course name */
    name: string;
    /** Created at date */
    createdAt: Date;
    /** Model draft */
    draft: boolean;
    /** Publised at date */
    publishedAt?: Date;
    /** Course external identifier */
    externalID: string;
}

/**
 * Returns wether a course has been published.
 *
 * @param course Course instance
 *
 * @returns true if it's published, false otherwise
 */
export function isCoursePublished(course: Course): boolean {
    return course.publishedAt !== undefined && course.publishedAt !== null;
}
