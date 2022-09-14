export interface LegalText {
    language: string;
    text: string;
}

export const notices: LegalText[] = [];
export const cookies: LegalText[] = [];
export const policies: LegalText[] = [];

// NOTICES
notices.push({
    language: 'es',
    text: `<section aria-labelledby="conditions"><h2 id="conditions">CONDITIONS</h2><p>YOUR TEXT</p></section>`,
});

notices.push({
    language: 'en',
    text: `<section aria-labelledby="conditions"><h2 id="conditions">CONDITIONS</h2><p>YOUR TEXT</p></section>`,
});

// COOKIES
cookies.push({
    language: 'es',
    text: `<section aria-labelledby="cookies-definition"><h2 id="cookies-definition">COOKIES</h2><p> YOUR TEXT</p></section>`,
});

cookies.push({
    language: 'en',
    text: `<section aria-labelledby="cookies-definition"><h2 id="cookies-definition">COOKIES</h2><p> YOUR TEXT</p></section>`,
});

policies.push({
    language: 'es',
    text: `<section aria-labelledby="privacy"><h1 id="privacy">PRIVACY</h1><p>YOUR TEXT</p></section>`,
});

policies.push({
    language: 'en',
    text: `<section aria-labelledby="privacy"><h1 id="privacy">PRIVACY</h1><p>YOUR TEXT</p></section>`,
});
