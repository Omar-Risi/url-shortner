import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { Languages } from 'lucide-react';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const { locale } = usePage().props as { locale: string };

    const toggleLocale = () => {
        const newLocale = locale === 'en' ? 'ar' : 'en';
        router.post('/locale/switch', { locale: newLocale }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="ltr:-ml-1 rtl:-mr-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <Button
                onClick={toggleLocale}
                variant="ghost"
                size="sm"
                className="inline-flex items-center justify-center gap-1.5"
                aria-label="Toggle language"
            >
                <Languages className="h-4 w-4" />
                <span className="font-medium text-sm">{locale === 'en' ? 'AR' : 'EN'}</span>
            </Button>
        </header>
    );
}
