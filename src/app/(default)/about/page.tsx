import { redirect } from 'next/navigation';
import { i18n } from '@/assets/i18config';

export default function About() {
    // Redirect to the default locale
    redirect(`/${i18n.defaultLocale}/about`);
}
