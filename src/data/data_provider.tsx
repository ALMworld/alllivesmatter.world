import { AboutData, AdvocacyData, CommonData, DataTypes, HowData, MenuData, WhyData } from './data_types';
import { Locale } from '@/assets/i18config';

// Import locale data — each locale's index.ts aggregates all JSON files
import { localeData as en } from '@/assets/i18n/en';
import { localeData as zh } from '@/assets/i18n/zh';
import { localeData as zhTW } from '@/assets/i18n/zh-TW';

// To add a new locale: 1) add import above, 2) add entry below
const localizedData: Record<Locale, DataTypes> = {
  en,
  zh,
  'zh-TW': zhTW,
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