<?php

use App\Http\Controllers\UrlController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard',
            ['urls' => auth()->user()->urls()->latest()->paginate(20)]);
    })->name('dashboard');
});

Route::post('/api/url/store', [UrlController::class, 'store'])->name('link.store');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
