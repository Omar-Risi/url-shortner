import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Mail, Phone, Shield, Save, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { useTranslation } from '@/hooks/use-translation';

interface User {
    id: number;
    name: string;
    email: string;
    phone_number: string;
    is_admin: boolean;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

interface EditUserPageProps {
    user: User;
}

export default function EditUser() {
    const { user } = usePage<EditUserPageProps>().props;
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('users.title'),
            href: '/users',
        },
        {
            title: t('users.edit_title'),
            href: `/users/${user.id}/edit`,
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        phone_number: user.phone_number || '',
        is_admin: user.is_admin,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/users/${user.id}`, {
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit User - ${user.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Header Section */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                {t('users.edit_title')}
                            </CardTitle>
                            <Link href="/users">
                                <Button variant="outline" size="sm">
                                    <ArrowLeft className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                                    {t('users.edit_back')}
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg">{user.name}</h3>
                                <p className="text-sm text-foreground/60">ID: {user.id}</p>
                            </div>
                            <div className="flex gap-2">
                                <Badge variant={user.email_verified_at ? 'default' : 'secondary'}>
                                    {user.email_verified_at ? t('users.status_verified') : t('users.status_unverified')}
                                </Badge>
                                <Badge variant={user.is_admin ? 'destructive' : 'outline'}>
                                    {user.is_admin ? t('users.role_admin') : t('users.role_user')}
                                </Badge>
                            </div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-foreground/60">
                            <div>
                                <span className="font-medium">{t('users.edit_created')}</span> {formatDate(user.created_at)}
                            </div>
                            <div>
                                <span className="font-medium">{t('users.edit_updated')}</span> {formatDate(user.updated_at)}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Edit Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('users.edit_details')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        {t('users.edit_label_name')}
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className={errors.name ? 'border-red-500' : ''}
                                        placeholder={t('users.edit_placeholder_name')}
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">{errors.name}</p>
                                    )}
                                </div>

                                {/* Email Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        {t('users.edit_label_email')}
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className={errors.email ? 'border-red-500' : ''}
                                        placeholder={t('users.edit_placeholder_email')}
                                        required
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-500">{errors.email}</p>
                                    )}
                                </div>

                                {/* Phone Number Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="phone_number" className="flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        {t('users.edit_label_phone')}
                                    </Label>
                                    <Input
                                        id="phone_number"
                                        type="tel"
                                        value={data.phone_number}
                                        onChange={(e) => setData('phone_number', e.target.value)}
                                        className={errors.phone_number ? 'border-red-500' : ''}
                                        placeholder={t('users.edit_placeholder_phone')}
                                    />
                                    {errors.phone_number && (
                                        <p className="text-sm text-red-500">{errors.phone_number}</p>
                                    )}
                                </div>

                                {/* Admin Status */}
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Shield className="h-4 w-4" />
                                        {t('users.edit_label_admin')}
                                    </Label>
                                    <div className="flex items-center space-x-2 p-3 border rounded-md">
                                        <Checkbox
                                            id="is_admin"
                                            checked={data.is_admin}
                                            onCheckedChange={(checked) => setData('is_admin', checked as boolean)}
                                        />
                                        <Label
                                            htmlFor="is_admin"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {t('users.edit_admin_grant')}
                                        </Label>
                                    </div>
                                    <p className="text-sm text-foreground/60">
                                        {t('users.edit_admin_desc')}
                                    </p>
                                    {errors.is_admin && (
                                        <p className="text-sm text-red-500">{errors.is_admin}</p>
                                    )}
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center justify-between pt-6 border-t">
                                <div className="text-sm text-foreground/60">
                                    {t('users.edit_required')}
                                </div>
                                <div className="flex items-center gap-3">
                                    <Link href="/users">
                                        <Button type="button" variant="outline">
                                            {t('users.edit_button_cancel')}
                                        </Button>
                                    </Link>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="min-w-[120px]"
                                    >
                                        {processing ? (
                                            <>
                                                <Loader2 className="h-4 w-4 ltr:mr-2 rtl:ml-2 animate-spin" />
                                                {t('users.edit_button_saving')}
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                                                {t('users.edit_button_save')}
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}


