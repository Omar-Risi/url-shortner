<?php

use App\Http\Controllers\UrlController;
use App\Models\Url;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {

        $urls = auth()->user()->urls()->latest()->paginate(2);

        return Inertia::render('dashboard',
            ['urls' => $urls]);
    })->name('dashboard');
});

Route::post('/api/url/store', [UrlController::class, 'store'])->name('link.store');
Route::put('/api/url/update/{id}', [UrlController::class, 'update'])->name('update.store');
Route::delete('/api/url/delete/{id}', [UrlController::class, 'delete'])->name('link.destroy');
Route::get('/short/{short_code}', [UrlController::class, 'redirect'])->name('link.redirect');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
