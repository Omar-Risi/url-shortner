<?php

use App\Http\Controllers\UrlController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WelcomeController;
use App\Http\Middleware\AdminMiddleware;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [WelcomeController::class, 'index'])->name('home');
Route::post('/', [WelcomeController::class, 'store']);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [UrlController::class, 'index'])->name('dashboard');

    Route::get('/users', [UserController::class, 'index'])
        ->name('users')
        ->middleware(AdminMiddleware::class);
});

Route::post('/api/url/store', [UrlController::class, 'store'])->name('link.store');
Route::put('/api/url/update/{id}', [UrlController::class, 'update'])->name('update.store');
Route::delete('/api/url/delete/{id}', [UrlController::class, 'delete'])->name('link.destroy');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';


Route::get('/{short_code}', [UrlController::class, 'redirect'])->name('link.redirect');
