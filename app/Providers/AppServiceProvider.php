<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {

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
