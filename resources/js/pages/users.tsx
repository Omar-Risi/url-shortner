import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, User, Mail, Calendar } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    role?: string;
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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

export default function Users() {
    const { users, query } = usePage<UsersPageProps>().props;
    const [searchQuery, setSearchQuery] = useState(query || '');

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
                {user.email_verified_at ? 'Verified' : 'Unverified'}
            </Badge>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Search Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Users Management
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4 items-center">
                            <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/50" />
                                    <Input
                                        placeholder="Search users by name, email, or phone number..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
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
                                        Clear
                                    </Button>
                                )}
                            </form>
                        </div>
                        {query && (
                            <div className="mt-4 text-sm text-foreground/70">
                                Showing results for: <span className="font-semibold">"{query}"</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            All Users ({users.total.toLocaleString()})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Joined</TableHead>
                                        <TableHead>Last Updated</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-foreground/60">
                                                {query ? `No users found matching "${query}".` : 'No users found.'}
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
                                                    <Badge variant="outline">
                                                        {user.role || 'User'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-foreground/50" />
                                                        <span className="text-sm">
                                                            {formatDate(user.created_at)}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm text-foreground/60">
                                                        {formatDate(user.updated_at)}
                                                    </span>
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
                            Showing {users.from || 0} to {users.to || 0} of {users.total.toLocaleString()} users
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
                                Page {users.current_page} of {users.last_page}
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
