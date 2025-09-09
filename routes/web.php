<?php

use App\Http\Controllers\UrlController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\AdminMiddleware;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [UrlController::class, 'index'])->name('dashboard');

    Route::get('/users', [UserController::class, 'index'])
        ->name('users')
        ->middleware(AdminMiddleware::class);
});

Route::post('/api/url/store', [UrlController::class, 'store'])->name('link.store');
Route::put('/api/url/update/{id}', [UrlController::class, 'update'])->name('update.store');
Route::delete('/api/url/delete/{id}', [UrlController::class, 'delete'])->name('link.destroy');
Route::get('/short/{short_code}', [UrlController::class, 'redirect'])->name('link.redirect');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
