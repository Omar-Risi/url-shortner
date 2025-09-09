<?php

namespace App\Http\Controllers;

use App\Models\Url;
use Illuminate\Http\Request;
use Tuupola\Base62;

class UrlController extends Controller
{

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
}
