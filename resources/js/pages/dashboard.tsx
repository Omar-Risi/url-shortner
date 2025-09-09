import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, useForm, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Plus, Edit, ExternalLink, Loader2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const { urls } = usePage().props;
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editingUrl, setEditingUrl] = useState(null);

    // Form for creating URLs
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        original_url: '',
    });

    // Form for editing URLs
    const {
        data: editData,
        setData: setEditData,
        put,
        processing: editProcessing,
        errors: editErrors,
        reset: resetEdit,
        clearErrors: clearEditErrors
    } = useForm({
        original_url: '',
    });

    // Debounce search functionality
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Filter URLs based on debounced search query
    const filteredUrls = urls.data.filter(url =>
        url.original_url.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        url.shortUrl.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );

    const handleCreateUrl = () => {
        setCreateDialogOpen(true);
    };

    const handleEditUrl = (url) => {
        setEditingUrl(url);
        setEditData('original_url', url.original_url);
        setEditDialogOpen(true);
    };

    const submitCreateForm = (e: React.FormEvent) => {
        e.preventDefault();
        post('/api/url/store', {
            onSuccess: () => {
                setCreateDialogOpen(false);
                reset();
            },
            onError: () => {
                // Errors will be handled automatically by Inertia
            },
        });
    };

    const submitEditForm = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUrl) return;

        put(`/api/url/update/${editingUrl.id}`, {
            onSuccess: () => {
                setEditDialogOpen(false);
                setEditingUrl(null);
                resetEdit();
            },
            onError: () => {
                // Errors will be handled automatically by Inertia
            },
        });
    };

    const handleCreateDialogOpenChange = (open: boolean) => {
        setCreateDialogOpen(open);
        if (!open) {
            reset();
            clearErrors();
        }
    };

    const handleEditDialogOpenChange = (open: boolean) => {
        setEditDialogOpen(open);
        if (!open) {
            setEditingUrl(null);
            resetEdit();
            clearEditErrors();
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Search and Create Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>URL Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4 items-center">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search URLs..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            {/* Pagination Controls */}
                            {urls && urls.last_page > 1 && !searchQuery && (
                                <div className="flex items-center justify-between mt-6">
                                    <div className="text-sm text-muted-foreground">
                                        Showing {urls.from || 0} to {urls.to || 0} of {urls.total} results
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {/* First Page */}
                                        <Link
                                            href={urls.links?.[0]?.url || '#'}
                                            preserveState
                                            className={`inline-flex items-center justify-center w-8 h-8 text-sm border rounded ${urls.current_page === 1
                                                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }`}
                                            tabIndex={urls.current_page === 1 ? -1 : undefined}
                                        >
                                            <ChevronsLeft className="w-4 h-4" />
                                        </Link>
                                        {/* Previous Page */}
                                        <Link
                                            href={urls.links?.find(link => link.label === '&laquo; Previous')?.url || '#'}
                                            preserveState
                                            className={`inline-flex items-center justify-center w-8 h-8 text-sm border rounded ${urls.current_page === 1
                                                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }`}
                                            tabIndex={urls.current_page === 1 ? -1 : undefined}
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </Link>
                                        {/* Page Numbers */}
                                        {urls.links
                                            ?.filter(link => !isNaN(Number(link.label)))
                                            ?.map((link, index) => (
                                                <Link
                                                    key={index}
                                                    href={link.url || '#'}
                                                    preserveState
                                                    className={`inline-flex items-center justify-center w-8 h-8 text-sm border rounded ${link.active
                                                        ? 'border-primary bg-primary text-primary-foreground'
                                                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {link.label}
                                                </Link>
                                            ))}
                                        {/* Next Page */}
                                        <Link
                                            href={urls.links?.find(link => link.label === 'Next &raquo;')?.url || '#'}
                                            preserveState
                                            className={`inline-flex items-center justify-center w-8 h-8 text-sm border rounded ${urls.current_page === urls.last_page
                                                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }`}
                                            tabIndex={urls.current_page === urls.last_page ? -1 : undefined}
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </Link>
                                        {/* Last Page */}
                                        <Link
                                            href={urls.links?.[urls.links.length - 1]?.url || '#'}
                                            preserveState
                                            className={`inline-flex items-center justify-center w-8 h-8 text-sm border rounded ${urls.current_page === urls.last_page
                                                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }`}
                                            tabIndex={urls.current_page === urls.last_page ? -1 : undefined}
                                        >
                                            <ChevronsRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            )}
                            <Button onClick={handleCreateUrl} className="whitespace-nowrap">
                                <Plus className="h-4 w-4 mr-2" />
                                Create URL
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* URLs Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Your URLs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Original URL</TableHead>
                                        <TableHead>Shortened URL</TableHead>
                                        <TableHead className="text-right">Clicks</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {urls.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                {searchQuery ? 'No URLs found matching your search.' : 'No URLs created yet. Create your first URL!'}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        urls.data.map((url) => (
                                            <TableRow key={url.id}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                                        <span className="truncate max-w-md" title={url.originalUrl}>
                                                            {url.original_url}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <a
                                                        href={url.short_code}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary hover:underline"
                                                    >
                                                        {url.short_code}
                                                    </a>
                                                </TableCell>
                                                <TableCell className="text-right font-mono">
                                                    {url.clicks.toLocaleString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEditUrl(url)}
                                                    >
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Edit
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

                {/* Create URL Dialog */}
                <Dialog open={createDialogOpen} onOpenChange={handleCreateDialogOpenChange}>
                    <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={submitCreateForm}>
                            <DialogHeader>
                                <DialogTitle>Create Short URL</DialogTitle>
                                <DialogDescription>
                                    Enter the original URL you want to shorten.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="original_url">Original URL</Label>
                                    <Input
                                        id="original_url"
                                        type="url"
                                        placeholder="https://example.com"
                                        value={data.original_url}
                                        onChange={(e) => setData('original_url', e.target.value)}
                                        required
                                    />
                                    {errors.original_url && (
                                        <p className="text-sm text-red-600">{errors.original_url}</p>
                                    )}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => handleCreateDialogOpenChange(false)}
                                    disabled={processing}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Create URL
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Edit URL Dialog */}
                <Dialog open={editDialogOpen} onOpenChange={handleEditDialogOpenChange}>
                    <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={submitEditForm}>
                            <DialogHeader>
                                <DialogTitle>Edit URL</DialogTitle>
                                <DialogDescription>
                                    Update the original URL for this shortened link.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit_original_url">Original URL</Label>
                                    <Input
                                        id="edit_original_url"
                                        type="url"
                                        placeholder="https://example.com"
                                        value={editData.original_url}
                                        onChange={(e) => setEditData('original_url', e.target.value)}
                                        required
                                    />
                                    {editErrors.original_url && (
                                        <p className="text-sm text-red-600">{editErrors.original_url}</p>
                                    )}
                                </div>
                                {editingUrl && (
                                    <div className="grid gap-2">
                                        <Label>Shortened URL</Label>
                                        <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
                                            {editingUrl.short_code}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => handleEditDialogOpenChange(false)}
                                    disabled={editProcessing}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={editProcessing}>
                                    {editProcessing && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Update URL
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
