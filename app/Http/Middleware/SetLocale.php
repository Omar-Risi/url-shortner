<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->cookie('locale', config('app.locale'));
        
        // Validate locale
        if (!in_array($locale, ['en', 'ar'])) {
            $locale = config('app.locale');
        }
        
        App::setLocale($locale);
        
        return $next($request);
    }
}
