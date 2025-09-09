import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

interface FormData {
    original_url: string;
}

export default function Welcome() {
    const { auth, flash } = usePage<SharedData>().props;
    const [shortUrl, setShortUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<FormData>({
        original_url: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setIsLoading(true);

        post('/api/url/store', {
            onSuccess: (page) => {
                // Assuming the response includes the short_code
                const response = page.props as any;
                if (response.short_code) {
                    setShortUrl(`${window.location.origin}/${response.short_code}`);
                }
                reset('original_url');
                setIsLoading(false);
            },
            onError: () => {
                setIsLoading(false);
            },
        });
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shortUrl);
            // You could add a toast notification here
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={register()}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                <main className="flex w-full max-w-md flex-col items-center space-y-6">
                    <div className="text-center">
                        <h1 className="text-3xl font-semibold text-[#1b1b18] dark:text-[#EDEDEC] mb-2">
                            URL Shortener
                        </h1>
                        <p className="text-[#6B7280] dark:text-[#9CA3AF]">
                            Shorten your long URLs quickly and easily
                        </p>
                    </div>

                    <form onSubmit={submit} className="w-full space-y-4">
                        <div>
                            <input
                                id="original_url"
                                type="url"
                                name="original_url"
                                value={data.original_url}
                                className="w-full rounded-lg border border-[#19140035] bg-white px-4 py-3 text-[#1b1b18] placeholder-[#6B7280] focus:border-[#1915014a] focus:outline-none focus:ring-0 dark:border-[#3E3E3A] dark:bg-[#1a1a1a] dark:text-[#EDEDEC] dark:placeholder-[#9CA3AF] dark:focus:border-[#62605b]"
                                placeholder="Enter your URL here (e.g., https://example.com)"
                                onChange={(e) => setData('original_url', e.target.value)}
                                required
                            />
                            {errors.original_url && (
                                <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                                    {errors.original_url}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full rounded-lg bg-[#1b1b18] px-4 py-3 font-medium text-white hover:bg-[#2a2a26] focus:outline-none focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-[#EDEDEC] dark:text-[#1b1b18] dark:hover:bg-[#d4d4d4]"
                        >
                            {processing ? 'Shortening...' : 'Shorten URL'}
                        </button>
                    </form>

                    {shortUrl && (
                        <div className="w-full space-y-3 rounded-lg border border-[#19140035] bg-[#f9f9f8] p-4 dark:border-[#3E3E3A] dark:bg-[#1a1a1a]">
                            <p className="text-sm font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
                                Your shortened URL:
                            </p>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={shortUrl}
                                    readOnly
                                    className="flex-1 rounded border border-[#19140035] bg-white px-3 py-2 text-sm text-[#1b1b18] dark:border-[#3E3E3A] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]"
                                />
                                <button
                                    type="button"
                                    onClick={copyToClipboard}
                                    className="rounded border border-[#19140035] px-3 py-2 text-sm text-[#1b1b18] hover:border-[#1915014a] hover:bg-[#f3f3f2] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b] dark:hover:bg-[#2a2a2a]"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Sign-in benefits section */}
                    {!auth.user && (
                        <div className="w-full mt-8 p-6 rounded-lg bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] border border-[#19140020] dark:from-[#1a1a1a] dark:to-[#2a2a2a] dark:border-[#3E3E3A]">
                            <div className="text-center mb-4">
                                <h2 className="text-xl font-semibold text-[#1b1b18] dark:text-[#EDEDEC] mb-2">
                                    Get More with an Account
                                </h2>
                                <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm">
                                    Create a free account to unlock powerful features
                                </p>
                            </div>

                            <div className="space-y-3 mb-5">
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5">
                                        <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
                                            Link Management Dashboard
                                        </p>
                                        <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                                            View, edit, and organize all your shortened links in one place
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5">
                                        <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
                                            Click Analytics & Statistics
                                        </p>
                                        <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                                            Track clicks, views, and performance of your links
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5">
                                        <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
                                            Custom Short Links
                                        </p>
                                        <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                                            Create memorable, branded short links with custom aliases
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5">
                                        <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
                                            Link Moderation & Safety
                                        </p>
                                        <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                                            Free link monitoring for spam, malware, and inappropriate content
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2">
                                <Link
                                    href={register()}
                                    className="flex-1 text-center rounded-lg bg-[#1b1b18] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#2a2a26] transition-colors dark:bg-[#EDEDEC] dark:text-[#1b1b18] dark:hover:bg-[#d4d4d4]"
                                >
                                    Create Free Account
                                </Link>
                                <Link
                                    href={login()}
                                    className="flex-1 text-center rounded-lg border border-[#19140035] px-4 py-2.5 text-sm font-medium text-[#1b1b18] hover:bg-[#f9f9f8] transition-colors dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:bg-[#2a2a2a]"
                                >
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
