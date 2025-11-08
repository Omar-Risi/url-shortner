<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Middleware\TermsMiddleware;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;


Route::middleware(['guest', TermsMiddleware::class])->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])
        ->name('register');

    Route::post('register', [RegisteredUserController::class, 'store'])
        ->name('register.store');

    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');

    Route::post('login', [AuthenticatedSessionController::class, 'store'])
        ->name('login.store');

    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
});

Route::middleware('auth')->group(function () {
    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');

    /* Route::get('verify-email/{id}/{hash}', VerifyEmailController::class) */
    /*     ->middleware(['signed', 'throttle:6,1']) */
    /*     ->name('verification.verify'); */

    Route::get('/verify-email/{id}/{hash}', function (Request $request, $id, $hash) {
    // Force HTTPS
    $request->server->set('HTTPS', 'on');
    $request->server->set('SERVER_PORT', 443);

    $user = \App\Models\User::findOrFail($id);

    // Reconstruct what the signature SHOULD be
    $correctUrl = \Illuminate\Support\Facades\URL::temporarySignedRoute(
        'verification.verify',
        \Carbon\Carbon::createFromTimestamp($request->query('expires')),
        [
            'id' => $id,
            'hash' => $hash,
        ]
    );

    // Parse both URLs
    $receivedUrl = $request->fullUrl();
    $receivedParsed = parse_url($receivedUrl);
    $correctParsed = parse_url($correctUrl);

    parse_str($receivedParsed['query'] ?? '', $receivedQuery);
    parse_str($correctParsed['query'] ?? '', $correctQuery);

    return response()->json([
        'RECEIVED_URL' => $receivedUrl,
        'EXPECTED_URL' => $correctUrl,
        'URLS_MATCH' => $receivedUrl === $correctUrl,

        'COMPARISON' => [
            'scheme' => [
                'received' => $receivedParsed['scheme'] ?? null,
                'expected' => $correctParsed['scheme'] ?? null,
                'match' => ($receivedParsed['scheme'] ?? null) === ($correctParsed['scheme'] ?? null),
            ],
            'host' => [
                'received' => $receivedParsed['host'] ?? null,
                'expected' => $correctParsed['host'] ?? null,
                'match' => ($receivedParsed['host'] ?? null) === ($correctParsed['host'] ?? null),
            ],
            'path' => [
                'received' => $receivedParsed['path'] ?? null,
                'expected' => $correctParsed['path'] ?? null,
                'match' => ($receivedParsed['path'] ?? null) === ($correctParsed['path'] ?? null),
            ],
            'signature' => [
                'received' => $receivedQuery['signature'] ?? null,
                'expected' => $correctQuery['signature'] ?? null,
                'match' => ($receivedQuery['signature'] ?? null) === ($correctQuery['signature'] ?? null),
            ],
        ],

        'CONFIG' => [
            'app_url' => config('app.url'),
            'app_key' => substr(config('app.key'), 0, 20) . '...',
            'environment' => app()->environment(),
        ],

        'REQUEST_INFO' => [
            'scheme' => $request->getScheme(),
            'host' => $request->getHost(),
            'full_url' => $request->fullUrl(),
        ],
    ]);
    })->name('verification.verify.debug');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->name('password.confirm');

    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('password.confirm.store');

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
});
