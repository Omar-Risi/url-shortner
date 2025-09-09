<?php

namespace App\Http\Controllers;

use App\Models\Url;
use Illuminate\Http\Request;
use Tuupola\Base62;
use Inertia\Inertia;

class WelcomeController extends Controller
{
    public function index()
    {
        return Inertia::render('welcome');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'original_url' => ['required', 'url'],
        ], [
            'original_url.required' => 'Please enter a URL.',
            'original_url.url' => 'The URL must be valid and start with http:// or https://',
        ]);

        $base62 = new Base62();
        $url = Url::create([
            'original_url' => $validated['original_url'],
            'user_id' => auth()->id(), // This will be null for anonymous users
        ]);

        $url->short_code = $base62->encode($url->id);
        $url->save();

        // Redirect back to welcome page with the short_code
        return redirect()->route('home')->with([
            'short_code' => $url->short_code,
            'success' => 'URL shortened successfully!'
        ]);
    }
}
