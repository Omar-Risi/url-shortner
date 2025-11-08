import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { login } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { useTranslation } from '@/hooks/use-translation';

export default function Register() {
    const { t } = useTranslation();
    
    return (
        <AuthLayout title={t('register.title')} description={t('register.description')}>
            <Head title={t('register.page_title')} />
            <Form
                {...RegisteredUserController.store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">{t('register.label_name')}</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder={t('register.placeholder_name')}
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phone_number">{t('register.label_phone')}</Label>
                                <Input
                                    id="phone_number"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={2}
                                    autoComplete="phone_number"
                                    name="phone_number"
                                    placeholder={t('register.placeholder_phone')}
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>


                            <div className="grid gap-2">
                                <Label htmlFor="email">{t('register.label_email')}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={3}
                                    autoComplete="email"
                                    name="email"
                                    placeholder={t('register.placeholder_email')}
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">{t('register.label_password')}</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder={t('register.placeholder_password')}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">{t('register.label_confirm')}</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={5}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder={t('register.placeholder_confirm')}
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <Button type="submit" className="mt-2 w-full" tabIndex={6}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                {t('register.button_create')}
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            {t('register.have_account')}{' '}
                            <TextLink href={login()} tabIndex={7}>
                                {t('register.login')}
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
