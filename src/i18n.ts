import i18n from 'i18next';
// import i18nBackend from "i18next-http-backend";
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';

// const getCurrentHost = import.meta.env.MODE === 'development' ? window.location.origin : 'https://www.alllivesmatter.world';

i18n
    // .use(i18nBackend)
    .use(resourcesToBackend((language, namespace) => import(`./assets/i18n/${language}.json`)))
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        lng: 'en',
        interpolation: {
            escapeValue: false
        },
        // backend: {
        //     loadPath: `${getCurrentHost}/i18n/{{lng}}.json`,
        // }
    });

export default i18n;
