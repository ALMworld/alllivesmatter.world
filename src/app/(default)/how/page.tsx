import { redirect } from 'next/navigation';
import { i18n } from '@/assets/i18config';

export default function How() {
    // Redirect to the default locale
    redirect(`/${i18n.defaultLocale}/how`);
}
