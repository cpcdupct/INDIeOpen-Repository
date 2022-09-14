import { ScreenSize } from './models';

export class Utils {
    public static URL_PATTERN =
        /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm;
    public static EMAIL_REGEX =
        /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    public static chunk(arr: any, chunkSize: any) {
        const R = [];
        for (let i = 0, len = arr.length; i < len; i += chunkSize) {
            R.push(arr.slice(i, i + chunkSize));
        }
        return R;
    }

    public static getScreenSize(width: number): ScreenSize {
        if (width <= 575) {
            return ScreenSize.XS;
        } else if (width >= 576 && width <= 767) {
            return ScreenSize.SM;
        } else if (width >= 768 && width <= 991) {
            return ScreenSize.MD;
        } else if (width >= 992 && width <= 1199) {
            return ScreenSize.LG;
        } else if (width >= 1200) {
            return ScreenSize.XL;
        } else return ScreenSize.MD;
    }

    public static arrayContains(array: any[], element: any) {
        return array.indexOf(element) >= 0;
    }

    public static removeObjectFromArray(arr: Array<any>, attr: any, value: any) {
        let i = arr.length;
        while (i--) {
            if (
                arr[i] &&
                arr[i].hasOwnProperty(attr) &&
                arguments.length > 2 &&
                arr[i][attr] === value
            )
                arr.splice(i, 1);
        }
        return arr;
    }

    public static findObjectFromArray(arr: Array<any>, attr: any, value: any): any {
        return arr.find(x => x[attr] === value);
    }

    public static dateBefore(date1: Date, date2: Date): boolean {
        return new Date(date1).getTime() < new Date(date2).getTime();
    }

    public static isStringValid(text: string): boolean {
        if (text === undefined || text === null) return false;
        return text.trim() !== '';
    }

    public static isStringEmail(term: string) {
        if (!this.isStringValid(term)) return false;
        return this.EMAIL_REGEX.test(term);
    }
}
