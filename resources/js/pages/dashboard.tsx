import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, useForm, Link } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Plus, Edit, ExternalLink, Loader2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Trash2, QrCode, Download, Upload, X, Check } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { Slider } from '@/components/ui/slider';

export default function Dashboard() {
    const { urls, query } = usePage().props;
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('dashboard.title'),
            href: dashboard().url,
        },
    ];
    const [searchQuery, setSearchQuery] = useState(query || '');
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [qrDialogOpen, setQrDialogOpen] = useState(false);
    const [editingUrl, setEditingUrl] = useState(null);
    const [deletingUrl, setDeletingUrl] = useState(null);
    const [qrUrl, setQrUrl] = useState(null);
    const [copiedUrlId, setCopiedUrlId] = useState<number | null>(null);

    // QR Code customization state
    const [qrSize, setQrSize] = useState(300);
    const [qrFgColor, setQrFgColor] = useState('#000000');
    const [qrBgColor, setQrBgColor] = useState('#ffffff');
    const [qrLogo, setQrLogo] = useState<string | null>(null);
    const [qrLogoSize, setQrLogoSize] = useState(60);

    const qrCanvasRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    // Form for deleting URLs
    const {
        delete: deleteRequest,
        processing: deleteProcessing,
    } = useForm();

    // Form for search
    const {
        get,
        processing: searchProcessing
    } = useForm();

    const handleCreateUrl = () => {
        setCreateDialogOpen(true);
    };

    const handleEditUrl = (url) => {
        setEditingUrl(url);
        setEditData('original_url', url.original_url);
        setEditDialogOpen(true);
    };

    const handleDeleteUrl = (url) => {
        setDeletingUrl(url);
        setDeleteDialogOpen(true);
    };

    const handleShowQrCode = (url) => {
        setQrUrl(url);
        setQrDialogOpen(true);
        // Reset QR customization to defaults
        setQrSize(300);
        setQrFgColor('#000000');
        setQrBgColor('#ffffff');
        setQrLogo(null);
        setQrLogoSize(60);
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setQrLogo(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveLogo = () => {
        setQrLogo(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    const handleDownloadQr = () => {
        if (!qrCanvasRef.current) return;
        const canvas = qrCanvasRef.current.querySelector('canvas');
        if (!canvas) return;

        // Create a new canvas to add the logo and padding
        const finalCanvas = document.createElement('canvas');
        const ctx = finalCanvas.getContext('2d');
        if (!ctx) return;

        const padding = 5;

        // Add padding to canvas dimensions
        finalCanvas.width = canvas.width + (padding * 2);
        finalCanvas.height = canvas.height + (padding * 2);

        // Fill with white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

        // Draw QR code with padding offset
        ctx.drawImage(canvas, padding, padding);

        // Draw logo if exists
        if (qrLogo) {
            const img = new Image();
            img.onload = () => {
                // Calculate logo position based on actual canvas size (with padding)
                const logoX = (finalCanvas.width - qrLogoSize) / 2;
                const logoY = (finalCanvas.height - qrLogoSize) / 2;

                // Draw white background for logo
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(logoX - 5, logoY - 5, qrLogoSize + 10, qrLogoSize + 10);

                // Draw logo
                ctx.drawImage(img, logoX, logoY, qrLogoSize, qrLogoSize);

                // Download
                finalCanvas.toBlob((blob) => {
                    if (blob) {
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `qr-code-${qrUrl?.short_code || 'download'}.png`;
                        a.click();
                        URL.revokeObjectURL(url);
                    }
                });
            };
            img.src = qrLogo;
        } else {
            // Download without logo
            finalCanvas.toBlob((blob) => {
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `qr-code-${qrUrl?.short_code || 'download'}.png`;
                    a.click();
                    URL.revokeObjectURL(url);
                }
            });
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const searchUrl = searchQuery.trim()
            ? `/dashboard?search=${encodeURIComponent(searchQuery.trim())}`
            : '/dashboard';

        get(searchUrl, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearSearch = () => {
        setSearchQuery('');
        get('/dashboard', {
            preserveState: true,
            preserveScroll: true,
        });
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

    const submitDeleteForm = (e: React.FormEvent) => {
        e.preventDefault();
        if (!deletingUrl) return;

        deleteRequest(`/api/url/delete/${deletingUrl.id}`, {
            onSuccess: () => {
                setDeleteDialogOpen(false);
                setDeletingUrl(null);
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

    const handleDeleteDialogOpenChange = (open: boolean) => {
        setDeleteDialogOpen(open);
        if (!open) {
            setDeletingUrl(null);
        }
    };

    const handleQrDialogOpenChange = (open: boolean) => {
        setQrDialogOpen(open);
        if (!open) {
            setQrUrl(null);
            setQrLogo(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const copyToClipboard = async (url) => {
        try {
            const shortUrl = `${window.location.origin}/${url.short_code}`
            await window.navigator.clipboard.writeText(shortUrl);

            setCopiedUrlId(url.id);
            setTimeout(() => setCopiedUrlId(null), 3000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('dashboard.title')} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Search and Create Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('dashboard.url_management')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4 items-center flex-wrap">
                            <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                                <div className="relative flex-1">
                                    <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/50" />
                                    <Input
                                        placeholder={t('dashboard.search_placeholder')}
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
                                        variant="ghost"
                                        size="default"
                                        onClick={clearSearch}
                                        className="whitespace-nowrap"
                                    >
                                        {t('dashboard.button_clear')}
                                    </Button>
                                )}
                            </form>
                            <Button onClick={handleCreateUrl} className="whitespace-nowrap w-full lg:w-auto">
                                <Plus className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                                {t('dashboard.button_create')}
                            </Button>
                        </div>
                        {query && (
                            <div className="mt-4 text-sm text-foreground/70">
                                {t('dashboard.showing_results')} <span className="font-semibold">"{query}"</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* URLs Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('dashboard.your_urls')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Desktop Table View */}
                        <div className="rounded-md border hidden lg:block">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t('dashboard.original_url')}</TableHead>
                                        <TableHead>{t('dashboard.shortened_url')}</TableHead>
                                        <TableHead className="text-right">{t('dashboard.clicks')}</TableHead>
                                        <TableHead className="text-right">{t('dashboard.actions')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {urls.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-8 text-foreground/60">
                                                {query ? `${t('dashboard.no_results')} "${query}".` : t('dashboard.no_urls')}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        urls.data.map((url) => (
                                            <TableRow key={url.id}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2 rtl:flex-row-reverse">
                                                        <ExternalLink className="h-4 w-4 text-foreground/50 rtl:ml-2" />
                                                        <span className="truncate max-w-md text-foreground" title={url.originalUrl}>
                                                            {url.original_url}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <a
                                                        href={`/${url.short_code}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary hover:underline"
                                                    >
                                                        {`${window.location.origin}/${url.short_code}`}
                                                    </a>
                                                </TableCell>
                                                <TableCell className="text-right font-mono">
                                                    {url.clicks.toLocaleString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex gap-2 justify-end">

                                                        {copiedUrlId !== url.id && <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => copyToClipboard(url)}
                                                            className="rounded border border-[#19140035] px-3 py-2 text-sm text-[#1b1b18] hover:border-[#1915014a] hover:bg-[#f3f3f2] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b] dark:hover:bg-[#2a2a2a]"
                                                        >
                                                            {t('dashboard.button_copy_url')}
                                                        </Button>}
                                                        {copiedUrlId === url.id && <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => copyToClipboard(url)}
                                                            className="flex gap-2 items-center rounded border border-green-600 bg-green-300/20 px-3 py-2 text-sm text-green-600  hover:bg-green-300/30" >
                                                            <Check />
                                                            <span>{t('dashboard.button_copied')}</span>
                                                        </Button>}

                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleShowQrCode(url)}
                                                        >
                                                            <QrCode className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                                                            {t('dashboard.button_qr')}
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleEditUrl(url)}
                                                        >
                                                            <Edit className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                                                            {t('dashboard.button_edit')}
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleDeleteUrl(url)}
                                                        >
                                                            <Trash2 className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                                                            {t('dashboard.button_delete')}
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="lg:hidden space-y-4">
                            {urls.data.length === 0 ? (
                                <div className="text-center py-8 text-foreground/60">
                                    {query ? `${t('dashboard.no_results')} "${query}".` : t('dashboard.no_urls')}
                                </div>
                            ) : (
                                urls.data.map((url) => (
                                    <Card key={url.id}>
                                        <CardContent className="p-4">
                                            <div className="space-y-3">
                                                {/* Original URL */}
                                                <div>
                                                    <div className="text-xs text-foreground/50 mb-1">{t('dashboard.original_url')}</div>
                                                    <div className="flex items-start gap-2 rtl:flex-row-reverse">
                                                        <ExternalLink className="h-4 w-4 text-foreground/50 mt-0.5 flex-shrink-0" />
                                                        <span className="text-sm break-all">{url.original_url}</span>
                                                    </div>
                                                </div>

                                                {/* Shortened URL */}
                                                <div>
                                                    <div className="text-xs text-foreground/50 mb-1">{t('dashboard.shortened_url')}</div>
                                                    <a
                                                        href={`/${url.short_code}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-primary hover:underline break-all"
                                                    >
                                                        {`${window.location.origin}/${url.short_code}`}
                                                    </a>
                                                </div>

                                                {/* Clicks */}
                                                <div>
                                                    <div className="text-xs text-foreground/50 mb-1">{t('dashboard.clicks')}</div>
                                                    <div className="text-sm font-mono">{url.clicks.toLocaleString()}</div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex flex-col gap-2 pt-2">

                                                    {copiedUrlId !== url.id && <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => copyToClipboard(url)}
                                                        className="rounded border border-[#19140035] px-3 py-2 text-sm text-[#1b1b18] hover:border-[#1915014a] hover:bg-[#f3f3f2] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b] dark:hover:bg-[#2a2a2a]"
                                                    >
                                                        {t('dashboard.button_copy_url')}
                                                    </Button>}
                                                    {copiedUrlId === url.id && <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => copyToClipboard(url)}
                                                        className="flex gap-2 items-center rounded border border-green-600 bg-green-300/20 px-3 py-2 text-sm text-green-600  hover:bg-green-300/30" >
                                                        <Check />
                                                        <span>{t('dashboard.button_copied')}</span>
                                                    </Button>}


                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleShowQrCode(url)}
                                                        className="w-full"
                                                    >
                                                        <QrCode className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                                                        {t('dashboard.button_qr')}
                                                    </Button>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleEditUrl(url)}
                                                            className="flex-1"
                                                        >
                                                            <Edit className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                                                            {t('dashboard.button_edit')}
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleDeleteUrl(url)}
                                                            className="flex-1"
                                                        >
                                                            <Trash2 className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                                                            {t('dashboard.button_delete')}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Pagination Controls */}
                {urls && urls.last_page > 1 && (
                    <div className="flex items-center justify-between mt-6">
                        <div className="text-sm text-foreground/70">
                            {t('dashboard.showing_pagination')
                                .replace('{from}', String(urls.from || 0))
                                .replace('{to}', String(urls.to || 0))
                                .replace('{total}', String(urls.total))}
                        </div>
                        <div className="flex items-center space-x-2">
                            {/* First Page */}
                            <Link
                                href={urls.links?.[0]?.url || '#'}
                                preserveState
                                className={`inline-flex items-center justify-center w-8 h-8 text-sm border rounded transition-colors ${urls.current_page === 1
                                    ? 'border-border text-foreground/30 cursor-not-allowed'
                                    : 'border-border text-foreground/80 hover:bg-accent hover:text-accent-foreground'
                                    }`}
                                tabIndex={urls.current_page === 1 ? -1 : undefined}
                            >
                                <ChevronsLeft className="w-4 h-4" />
                            </Link>
                            {/* Previous Page */}
                            <Link
                                href={urls.links?.find(link => link.label === '&laquo; Previous')?.url || '#'}
                                preserveState
                                className={`inline-flex items-center justify-center w-8 h-8 text-sm border rounded transition-colors ${urls.current_page === 1
                                    ? 'border-border text-foreground/30 cursor-not-allowed'
                                    : 'border-border text-foreground/80 hover:bg-accent hover:text-accent-foreground'
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
                                        className={`inline-flex items-center justify-center w-8 h-8 text-sm border rounded transition-colors ${link.active
                                            ? 'border-primary bg-primary text-primary-foreground'
                                            : 'border-border text-foreground/80 hover:bg-accent hover:text-accent-foreground'
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            {/* Next Page */}
                            <Link
                                href={urls.links?.find(link => link.label === 'Next &raquo;')?.url || '#'}
                                preserveState
                                className={`inline-flex items-center justify-center w-8 h-8 text-sm border rounded transition-colors ${urls.current_page === urls.last_page
                                    ? 'border-border text-foreground/30 cursor-not-allowed'
                                    : 'border-border text-foreground/80 hover:bg-accent hover:text-accent-foreground'
                                    }`}
                                tabIndex={urls.current_page === urls.last_page ? -1 : undefined}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                            {/* Last Page */}
                            <Link
                                href={urls.links?.[urls.links.length - 1]?.url || '#'}
                                preserveState
                                className={`inline-flex items-center justify-center w-8 h-8 text-sm border rounded transition-colors ${urls.current_page === urls.last_page
                                    ? 'border-border text-foreground/30 cursor-not-allowed'
                                    : 'border-border text-foreground/80 hover:bg-accent hover:text-accent-foreground'
                                    }`}
                                tabIndex={urls.current_page === urls.last_page ? -1 : undefined}
                            >
                                <ChevronsRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                )}

                {/* Create URL Dialog */}
                <Dialog open={createDialogOpen} onOpenChange={handleCreateDialogOpenChange}>
                    <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={submitCreateForm}>
                            <DialogHeader>
                                <DialogTitle>{t('dashboard.create_dialog_title')}</DialogTitle>
                                <DialogDescription>
                                    {t('dashboard.create_dialog_desc')}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="original_url">{t('dashboard.label_original_url')}</Label>
                                    <Input
                                        id="original_url"
                                        type="url"
                                        placeholder={t('dashboard.placeholder_url')}
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
                                    {t('dashboard.button_cancel')}
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing && (
                                        <Loader2 className="ltr:mr-2 rtl:ml-2 h-4 w-4 animate-spin" />
                                    )}
                                    {t('dashboard.button_create_url')}
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
                                <DialogTitle>{t('dashboard.edit_dialog_title')}</DialogTitle>
                                <DialogDescription>
                                    {t('dashboard.edit_dialog_desc')}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit_original_url">{t('dashboard.label_original_url')}</Label>
                                    <Input
                                        id="edit_original_url"
                                        type="url"
                                        placeholder={t('dashboard.placeholder_url')}
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
                                        <Label>{t('dashboard.label_shortened_url')}</Label>
                                        <div className="text-sm text-foreground/70 bg-muted p-2 rounded">
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
                                    {t('dashboard.button_cancel')}
                                </Button>
                                <Button type="submit" disabled={editProcessing}>
                                    {editProcessing && (
                                        <Loader2 className="ltr:mr-2 rtl:ml-2 h-4 w-4 animate-spin" />
                                    )}
                                    {t('dashboard.button_update')}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete URL Dialog */}
                <Dialog open={deleteDialogOpen} onOpenChange={handleDeleteDialogOpenChange}>
                    <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={submitDeleteForm}>
                            <DialogHeader>
                                <DialogTitle>{t('dashboard.delete_dialog_title')}</DialogTitle>
                                <DialogDescription>
                                    {t('dashboard.delete_dialog_desc')}
                                </DialogDescription>
                            </DialogHeader>
                            {deletingUrl && (
                                <div className="grid gap-4 py-4">
                                    <div className="p-4 bg-muted rounded-lg">
                                        <div className="grid gap-2">
                                            <div className="text-sm font-medium text-foreground">{t('dashboard.original_url')}:</div>
                                            <div className="text-sm text-foreground/80 break-all">
                                                {deletingUrl.original_url}
                                            </div>
                                        </div>
                                        <div className="grid gap-2 mt-3">
                                            <div className="text-sm font-medium text-foreground">{t('dashboard.shortened_url')}:</div>
                                            <div className="text-sm text-foreground/80">
                                                {`${window.location.origin}/short/${deletingUrl.short_code}`}
                                            </div>
                                        </div>
                                        <div className="grid gap-2 mt-3">
                                            <div className="text-sm font-medium text-foreground">{t('dashboard.delete_total_clicks')}</div>
                                            <div className="text-sm text-foreground/80">
                                                {deletingUrl.clicks.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => handleDeleteDialogOpenChange(false)}
                                    disabled={deleteProcessing}
                                >
                                    {t('dashboard.button_cancel')}
                                </Button>
                                <Button
                                    type="submit"
                                    variant="destructive"
                                    disabled={deleteProcessing}
                                >
                                    {deleteProcessing && (
                                        <Loader2 className="ltr:mr-2 rtl:ml-2 h-4 w-4 animate-spin" />
                                    )}
                                    {t('dashboard.button_delete_confirm')}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* QR Code Dialog */}
                <Dialog open={qrDialogOpen} onOpenChange={handleQrDialogOpenChange}>
                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{t('dashboard.qr_dialog_title')}</DialogTitle>
                            <DialogDescription>
                                {t('dashboard.qr_dialog_desc')}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                            {/* QR Code Preview */}
                            <div className="flex justify-center overflow-x-auto">
                                <div
                                    ref={qrCanvasRef}
                                    className="relative inline-block p-2 sm:p-4 bg-white rounded-lg shadow-sm"
                                    style={{ backgroundColor: qrBgColor }}
                                >
                                    <QRCodeCanvas
                                        value={qrUrl ? `${window.location.origin}/${qrUrl.short_code}` : ''}
                                        size={qrSize}
                                        level="H"
                                        fgColor={qrFgColor}
                                        bgColor={qrBgColor}
                                        includeMargin={false}
                                    />
                                    {qrLogo && (
                                        <img
                                            src={qrLogo}
                                            alt="Logo"
                                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded"
                                            style={{
                                                width: `${qrLogoSize}px`,
                                                height: `${qrLogoSize}px`,
                                                objectFit: 'contain'
                                            }}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Customization Options */}
                            <div className="grid gap-4">
                                {/* QR Code Size */}
                                <div className="grid gap-2">
                                    <div className="flex justify-between">
                                        <Label className="text-sm">{t('dashboard.qr_size')}</Label>
                                        <span className="text-sm text-foreground/70">{qrSize}px</span>
                                    </div>
                                    <Slider
                                        value={[qrSize]}
                                        onValueChange={(value) => setQrSize(value[0])}
                                        min={200}
                                        max={500}
                                        step={10}
                                        className="w-full"
                                    />
                                </div>

                                {/* Foreground Color */}
                                <div className="grid gap-2">
                                    <Label htmlFor="fg-color" className="text-sm">{t('dashboard.qr_color')}</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="fg-color"
                                            type="color"
                                            value={qrFgColor}
                                            onChange={(e) => setQrFgColor(e.target.value)}
                                            className="w-16 sm:w-20 h-10 p-1 cursor-pointer"
                                        />
                                        <Input
                                            type="text"
                                            value={qrFgColor}
                                            onChange={(e) => setQrFgColor(e.target.value)}
                                            className="flex-1 text-sm"
                                            placeholder="#000000"
                                        />
                                    </div>
                                </div>

                                {/* Background Color */}
                                <div className="grid gap-2">
                                    <Label htmlFor="bg-color" className="text-sm">{t('dashboard.qr_bg_color')}</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="bg-color"
                                            type="color"
                                            value={qrBgColor}
                                            onChange={(e) => setQrBgColor(e.target.value)}
                                            className="w-16 sm:w-20 h-10 p-1 cursor-pointer"
                                        />
                                        <Input
                                            type="text"
                                            value={qrBgColor}
                                            onChange={(e) => setQrBgColor(e.target.value)}
                                            className="flex-1 text-sm"
                                            placeholder="#ffffff"
                                        />
                                    </div>
                                </div>

                                {/* Logo Upload */}
                                <div className="grid gap-2">
                                    <Label className="text-sm">{t('dashboard.qr_logo')}</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoUpload}
                                            className="flex-1 text-sm"
                                        />
                                        {qrLogo && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={handleRemoveLogo}
                                                className="flex-shrink-0"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                    <p className="text-xs text-foreground/60">
                                        {t('dashboard.qr_logo_desc')}
                                    </p>
                                </div>

                                {/* Logo Size */}
                                {qrLogo && (
                                    <div className="grid gap-2">
                                        <div className="flex justify-between">
                                            <Label className="text-sm">{t('dashboard.qr_logo_size')}</Label>
                                            <span className="text-sm text-foreground/70">{qrLogoSize}px</span>
                                        </div>
                                        <Slider
                                            value={[qrLogoSize]}
                                            onValueChange={(value) => setQrLogoSize(value[0])}
                                            min={40}
                                            max={Math.floor(qrSize * 0.3)}
                                            step={5}
                                            className="w-full"
                                        />
                                        <p className="text-xs text-foreground/60">
                                            {t('dashboard.qr_logo_warning')}
                                        </p>
                                    </div>
                                )}

                                {/* URL Info */}
                                {qrUrl && (
                                    <div className="p-3 bg-muted rounded-lg">
                                        <div className="text-xs text-foreground/50 mb-1">{t('dashboard.shortened_url')}</div>
                                        <div className="text-sm font-medium break-all">
                                            {`${window.location.origin}/${qrUrl.short_code}`}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleQrDialogOpenChange(false)}
                                className="w-full sm:w-auto"
                            >
                                {t('dashboard.button_close')}
                            </Button>
                            <Button
                                type="button"
                                onClick={handleDownloadQr}
                                className="w-full sm:w-auto"
                            >
                                <Download className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
                                {t('dashboard.button_download')}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
