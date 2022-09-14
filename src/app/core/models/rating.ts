import { UnitInformation } from './unit';
import { AuthorResource } from './user';

/** File that contains common models for managing the domain concpet: Rating*/

/** Unit rating */
export interface Rating {
    /** Rating id */
    id: number;
    /** Rating value (1-5) */
    rating: number;
    /** Rating author */
    author: AuthorResource;
    /** Unit of this rating */
    unit: UnitInformation;
}
