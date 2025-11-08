import { usePage } from '@inertiajs/react';

interface PageProps {
    translations: Record<string, string>;
    locale: string;
}

export function useTranslation() {
    const { translations, locale } = usePage<PageProps>().props;

    const t = (key: string, fallback?: string): string => {
        return translations[key] || fallback || key;
    };

    const isRTL = locale === 'ar';

    return { t, locale, isRTL };
}
