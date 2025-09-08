import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Plus, Edit, ExternalLink } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

// Mock data for the table - you can replace this with your actual data
const mockUrls = [
    {
        id: 1,
        originalUrl: 'https://www.example.com/very/long/url/that/needs/shortening',
        shortUrl: 'https://short.ly/abc123',
        clicks: 1247,
    },
    {
        id: 2,
        originalUrl: 'https://docs.example.com/documentation/getting-started',
        shortUrl: 'https://short.ly/def456',
        clicks: 892,
    },
    {
        id: 3,
        originalUrl: 'https://blog.example.com/how-to-build-amazing-applications',
        shortUrl: 'https://short.ly/ghi789',
        clicks: 634,
    },
    {
        id: 4,
        originalUrl: 'https://api.example.com/v1/users/profile/settings',
        shortUrl: 'https://short.ly/jkl012',
        clicks: 421,
    },
];

export default function Dashboard() {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

    // Debounce search functionality
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Filter URLs based on debounced search query
    const filteredUrls = mockUrls.filter(url =>
        url.originalUrl.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        url.shortUrl.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );

    const handleCreateUrl = () => {
        // Navigate to create URL page - you can implement this with Inertia
        console.log('Navigate to create URL page');
    };

    const handleEditUrl = (id: number) => {
        // Navigate to edit URL page - you can implement this with Inertia
        console.log('Edit URL with ID:', id);
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
                                    {filteredUrls.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                {searchQuery ? 'No URLs found matching your search.' : 'No URLs created yet. Create your first URL!'}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredUrls.map((url) => (
                                            <TableRow key={url.id}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                                        <span className="truncate max-w-md" title={url.originalUrl}>
                                                            {url.originalUrl}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <a
                                                        href={url.shortUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary hover:underline"
                                                    >
                                                        {url.shortUrl}
                                                    </a>
                                                </TableCell>
                                                <TableCell className="text-right font-mono">
                                                    {url.clicks.toLocaleString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEditUrl(url.id)}
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
            </div>
        </AppLayout>
    );
}
