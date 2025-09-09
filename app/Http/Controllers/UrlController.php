<?php

namespace App\Http\Controllers;

use App\Models\Url;
use Illuminate\Http\Request;
use Tuupola\Base62;
use Inertia\Inertia;

class UrlController extends Controller
{

    public function index(Request $request) {

        $query = Url::where('user_id', auth()->id()); // always limit to logged-in user

        // Apply search filter if provided
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('original_url', 'like', '%' . $request->search . '%')
                ->orWhere('short_code', 'like', '%' . $request->search . '%');
            });
        }

        $urls = $query->latest()->paginate(20)->withQueryString();

        return Inertia::render('dashboard', [
            'urls' => $urls,
        ]);
    }
    public function store(Request $request) {

       $validated =  $request->validate([
            'original_url' => ['required', 'url'],
        ],
        [
            'original_url.required' => 'Please enter a URL.',
            'original_url.original_url' => 'The URL must be valid and start with http:// or https://',
        ]);

       $base62 = new Base62();

       $url = Url::create([
           'original_url' => $validated['original_url'],
           'user_id' => auth()->id(),
       ]);

       $url->short_code = $base62->encode($url->id);
       $url->save();

       return redirect()->to(route('dashboard'))->with('successs');
    }

    public function update(Request $request, int $id) {


       $request->validate([
           'original_url' => ['required', 'url'],
        ],
        [
            'original_url.required' => 'Please enter a URL.',
            'original_url.original_url' => 'The URL must be valid and start with http:// or https://',
        ]);

        $url = Url::findOrFail($id);
        $url->update([
            'original_url' => $request->original_url
        ]);



        return back()->with('successs');
    }

    public function delete (Request $request, int $id) {

         $url = Url::findOrFail($id);

        if ($url->user_id !== auth()->id()) {
            abort(403, 'Unauthorized');
        }

        $url->delete();

        return back()->with('success', 'URL deleted successfully');
    }

    public function redirect (Request $request, string $short_code) {

        $url = Url::where('short_code', $short_code)->firstOrFail();

        $url->increment('clicks');
        return redirect()->to($url->original_url);
    }
}
