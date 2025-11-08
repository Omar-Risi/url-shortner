import { logout } from '@/routes';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEvent, useRef, useState } from 'react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AuthLayout from '@/layouts/auth-layout';

export default function VerifyOtp({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        otp: '',
    });

    const [resending, setResending] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('verify-otp');
    };

    const handleResend = () => {
        setResending(true);
        post('resend-otp', {
            preserveScroll: true,
            onFinish: () => setResending(false),
        });
    };

    const handleOtpChange = (index: number, value: string) => {
        // Only allow digits
        if (value && !/^\d$/.test(value)) return;

        const newOtp = data.otp.split('');
        newOtp[index] = value;
        setData('otp', newOtp.join(''));

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !data.otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        if (/^\d+$/.test(pastedData)) {
            setData('otp', pastedData.padEnd(6, ''));
            inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
        }
    };

    return (
        <AuthLayout title="Verify your email" description="Enter the 6-digit code we sent to your email address.">
            <Head title="Email verification" />

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            {errors.otp && (
                <div className="mb-4 text-center text-sm font-medium text-red-600">
                    {errors.otp}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-center gap-2">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                        <Input
                            key={index}
                            ref={(el) => {
                                inputRefs.current[index] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={data.otp[index] || ''}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                            className="h-12 w-12 text-center text-lg font-semibold"
                            autoFocus={index === 0}
                        />
                    ))}
                </div>

                <Button type="submit" disabled={processing || data.otp.length !== 6} className="w-full">
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    Verify Email
                </Button>

                <div className="text-center">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handleResend}
                        disabled={resending}
                        className="text-sm"
                    >
                        {resending && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Resend code
                    </Button>
                </div>

                <TextLink href={logout()} className="mx-auto block text-center text-sm">
                    Log out
                </TextLink>
            </form>
        </AuthLayout>
    );
}
