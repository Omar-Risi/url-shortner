<?php

namespace App\Http\Controllers;

use App\Models\Url;
use Illuminate\Http\Request;
use Tuupola\Base62;

class UrlController extends Controller
{

    public function store(Request $request) {

       $validated =  $request->validate([
            'url' => ['required', 'url'],
        ],
        [
            'url.required' => 'Please enter a URL.',
            'url.url' => 'The URL must be valid and start with http:// or https://',
        ]);

       $base62 = new Base62();
       $user = auth()->user;

       $url = Url::create([
           'url' => $validated->url,
           'user_id' => $user->id,
       ]);

       $url->short_code = $base62->encode($url->id);
       $url->save();

       return redirect()->to(route('dashboard'))->with('successs');
    }
}
