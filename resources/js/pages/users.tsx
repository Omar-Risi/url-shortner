import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Link, Head, usePage, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, User, Mail, Calendar } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    is_admin?: boolean;
    status?: 'active' | 'inactive';
}

interface UsersPageProps {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        from: number | null;
        to: number | null;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    query: string;
}

export default function Users() {
    const { users, query } = usePage<UsersPageProps>().props;
    const [searchQuery, setSearchQuery] = useState(query || '');
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('users.title'),
            href: '/users',
        },
    ];

    // Form for search
    const {
        get,
        processing: searchProcessing
    } = useForm();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const searchUrl = searchQuery.trim()
            ? `/users?search=${encodeURIComponent(searchQuery.trim())}`
            : '/users';

        get(searchUrl, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearSearch = () => {
        setSearchQuery('');
        get('/users', {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (user: User) => {
        if (user.status) {
            return (
                <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                    {user.status}
                </Badge>
            );
        }
        return (
            <Badge variant={user.email_verified_at ? 'default' : 'secondary'}>
                {user.email_verified_at ? t('users.status_verified') : t('users.status_unverified')}
            </Badge>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('users.title')} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Search Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            {t('users.management')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4 items-center">
                            <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                                <div className="relative flex-1">
                                    <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/50" />
                                    <Input
                                        placeholder={t('users.search_placeholder')}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="ltr:pl-10 rtl:pr-10"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    variant="outline"
                                    size="default"
                                    disabled={searchProcessing}
                                    className="whitespace-nowrap"
                                >
                                    {searchProcessing ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Search className="h-4 w-4" />
                                    )}
                                </Button>
                                {query && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="default"
                                        onClick={clearSearch}
                                        className="whitespace-nowrap"
                                    >
                                        {t('users.button_clear')}
                                    </Button>
                                )}
                            </form>
                        </div>
                        {query && (
                            <div className="mt-4 text-sm text-foreground/70">
                                {t('users.showing_results')} <span className="font-semibold">"{query}"</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {t('users.all_users')} ({users.total.toLocaleString()})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t('users.table_user')}</TableHead>
                                        <TableHead>{t('users.table_email')}</TableHead>
                                        <TableHead>{t('users.table_status')}</TableHead>
                                        <TableHead>{t('users.table_role')}</TableHead>
                                        <TableHead>{t('users.table_joined')}</TableHead>
                                        <TableHead>{t('users.table_actions')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-foreground/60">
                                                {query ? `${t('users.no_results')} "${query}".` : t('users.no_users')}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        users.data.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                            <User className="h-4 w-4 text-primary" />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium">{user.name}</div>
                                                            <div className="text-sm text-foreground/60">ID: {user.id}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-4 w-4 text-foreground/50" />
                                                        <span>{user.email}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(user)}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={user.is_admin ? `destructive` : 'outline'}>
                                                        {user.is_admin ? t('users.role_admin') : t('users.role_user')}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 rtl:flex-row-reverse">
                                                        <Calendar className="h-4 w-4 text-foreground/50" />
                                                        <span className="text-sm">
                                                            {formatDate(user.created_at)}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Button>
                                                        <Link href={`/users/edit/${user.id}`}>{t('users.button_edit')}</Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Pagination Controls */}
                {users && users.last_page > 1 && (
                    <div className="flex items-center justify-between mt-6">
                        <div className="text-sm text-foreground/70">
                            {t('users.showing_pagination')
                                .replace('{from}', String(users.from || 0))
                                .replace('{to}', String(users.to || 0))
                                .replace('{total}', users.total.toLocaleString())}
                        </div>
                        <div className="flex items-center space-x-2">
                            {/* First Page */}
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={users.current_page === 1 || searchProcessing}
                                onClick={() => {
                                    const url = searchQuery.trim()
                                        ? `/users?search=${encodeURIComponent(searchQuery.trim())}&page=1`
                                        : '/users?page=1';
                                    get(url, { preserveState: true, preserveScroll: true });
                                }}
                                className="w-8 h-8 p-0"
                            >
                                <ChevronsLeft className="w-4 h-4" />
                            </Button>

                            {/* Previous Page */}
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={users.current_page === 1 || searchProcessing}
                                onClick={() => {
                                    const prevPage = users.current_page - 1;
                                    const url = searchQuery.trim()
                                        ? `/users?search=${encodeURIComponent(searchQuery.trim())}&page=${prevPage}`
                                        : `/users?page=${prevPage}`;
                                    get(url, { preserveState: true, preserveScroll: true });
                                }}
                                className="w-8 h-8 p-0"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>

                            {/* Current Page Info */}
                            <span className="text-sm text-foreground/70 px-2">
                                {t('users.page_of')
                                    .replace('{current}', String(users.current_page))
                                    .replace('{last}', String(users.last_page))}
                            </span>

                            {/* Next Page */}
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={users.current_page === users.last_page || searchProcessing}
                                onClick={() => {
                                    const nextPage = users.current_page + 1;
                                    const url = searchQuery.trim()
                                        ? `/users?search=${encodeURIComponent(searchQuery.trim())}&page=${nextPage}`
                                        : `/users?page=${nextPage}`;
                                    get(url, { preserveState: true, preserveScroll: true });
                                }}
                                className="w-8 h-8 p-0"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>

                            {/* Last Page */}
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={users.current_page === users.last_page || searchProcessing}
                                onClick={() => {
                                    const url = searchQuery.trim()
                                        ? `/users?search=${encodeURIComponent(searchQuery.trim())}&page=${users.last_page}`
                                        : `/users?page=${users.last_page}`;
                                    get(url, { preserveState: true, preserveScroll: true });
                                }}
                                className="w-8 h-8 p-0"
                            >
                                <ChevronsRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
