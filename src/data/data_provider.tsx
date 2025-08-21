import { AboutData, AdvocacyData, CommonData, DataTypes, HowData, MenuData, WhyData } from './data_types';
import enLocale from '@/assets/i18n/en.json';
// import zhLocale from '@/assets/i18n/zh.json';
import { Locale } from '@/assets/i18config';

// const translations = en as unknown as DataTypes;
const localizedData: Record<Locale, DataTypes> = {
  en: enLocale as unknown as DataTypes,
  // zh: zhLocale as unknown as DataTypes
  // de: enLocale as unknown as DataTypes,
  // fr: enLocale as unknown as DataTypes,
}

export const useCommonData = (lang: Locale = 'en'): CommonData => localizedData[lang].common_data;

export function useAdvocacyData(lang: Locale = 'en'): AdvocacyData {
  return localizedData[lang].advocacy_data;
}

export const useWhyData = (lang: Locale = 'en'): WhyData => localizedData[lang].why_data;

export const useHowData = (lang: Locale = 'en'): HowData => localizedData[lang].how_data;

export const useMenuData = (lang: Locale = 'en'): MenuData => localizedData[lang].menu_data;

export const useAboutData = (lang: Locale = 'en'): AboutData => localizedData[lang].about_data;

export const useData = (lang: Locale = 'en'): DataTypes => localizedData[lang];

// export default DataProvider;