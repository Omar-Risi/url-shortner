<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {

        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }

        Inertia::share([
            'user' => fn() => auth()->user(),
            'flash' => [
                'success' => fn () => session()->get('success'),
                'error' => fn () => session()->get('error'),
            ],
            'short_code' => fn () => session()->get('short_code'),
        ]);
    }
}
