/** File that contains common models for managing the theme information.*/

/** Theme interface. Any custom theme must apply this interface */
export interface Theme {
    /** Array of origin domains where the theme has to be applied */
    alllowedOrigins: string[];
    /** Theme name */
    name: string;
    /** Theme css filename */
    cssFileName: string;
    /** Favicon URL */
    faviconUrl: string;
    /** Set of theme colors */
    colors: {
        /** Main color */
        indie_blue: string;
        /** Secondary color */
        indie_pink: string;
    };
    /** Image URLs */
    resources: {
        mainImage: string;
        mainLogo: string;
        loginLogo: string;
    };
    /** Social links */
    social: {
        /** Twitter */
        twitter: {
            url: string;
        };
        web: {
            url: string;
        };
    };
    /** Available unit themes for the theme */
    unitThemes: string[];
    /** Unit Themes information url */
    unitThemesUrl: string;
}
