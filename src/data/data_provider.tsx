import { AboutData, AdvocacyData, CommonData, DataTypes, HowData, MenuData, WhyData } from './data_types';
// Import split English locale files
import enCommon from '@/assets/i18n/en/common.json';
import enAdvocacy from '@/assets/i18n/en/advocacy.json';
import enHow from '@/assets/i18n/en/how.json';
import enWhy from '@/assets/i18n/en/why.json';
import enAbout from '@/assets/i18n/en/about.json';
// Import split Chinese locale files
import zhCommon from '@/assets/i18n/zh/common.json';
import zhAdvocacy from '@/assets/i18n/zh/advocacy.json';
import zhHow from '@/assets/i18n/zh/how.json';
import zhWhy from '@/assets/i18n/zh/why.json';
import zhAbout from '@/assets/i18n/zh/about.json';
// Import shared (non-translated) data
import sharedData from '@/assets/i18n/shared_data.json';
import { Locale } from '@/assets/i18config';

const { poem_a_boy_in_the_universe, ...sharedAboutData } = sharedData;

// Combine split files into single locale object
const enLocale: DataTypes = {
  ...enCommon,
  common_data: { ...enCommon.common_data, poem_a_boy_in_the_universe },
  advocacy_data: enAdvocacy,
  how_data: enHow,
  why_data: enWhy,
  about_data: { ...enAbout, ...sharedAboutData } as AboutData,
} as DataTypes;

const zhLocale: DataTypes = {
  ...zhCommon,
  common_data: { ...zhCommon.common_data, poem_a_boy_in_the_universe },
  advocacy_data: zhAdvocacy,
  how_data: zhHow,
  why_data: zhWhy,
  about_data: { ...zhAbout, ...sharedAboutData } as AboutData,
} as DataTypes;

const localizedData: Record<Locale, DataTypes> = {
  en: enLocale,
  zh: zhLocale,
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