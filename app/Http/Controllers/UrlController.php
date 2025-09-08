<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

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




    }
}
