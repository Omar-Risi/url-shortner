import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useTranslation } from '@/hooks/use-translation';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const { t } = useTranslation();
    
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>{t('nav.links')}</SidebarGroupLabel>
            <SidebarMenu>

                {/* Render non admin items */}
                {items.map((item) =>
                    !item.admin ? (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={page.url.startsWith(typeof item.href === 'string' ? item.href : item.href.url)}
                                tooltip={{ children: item.title }}
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ) : null
                )}
            </SidebarMenu>

            {/* Admin panel */}
            {page.props.user.is_admin ? <SidebarGroupLabel className='mt-4'>{t('nav.admin_management')}</SidebarGroupLabel> : null}
            <SidebarMenu>
                {items.map((item) =>
                    item.admin && page.props.user.is_admin ? (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={page.url.startsWith(typeof item.href === 'string' ? item.href : item.href.url)}
                                tooltip={{ children: item.title }}
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ) : null)}
            </SidebarMenu>

        </SidebarGroup>
    );
}
