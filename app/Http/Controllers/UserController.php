<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->get('search');

        $users = User::where('id', '!=', auth()->id())
            ->when($query, function ($queryBuilder) use ($query) {
                return $queryBuilder->where(function ($q) use ($query) {
                    $q->where('name', 'LIKE', '%' . $query . '%')
                      ->orWhere('email', 'LIKE', '%' . $query . '%')
                      ->orWhere('phone_number', 'LIKE', '%' . $query . '%');
                });
            })
            ->orderBy('name')
            ->paginate(25)
            ->withQueryString(); // Preserve search parameters in pagination links

        return Inertia::render('users', [
            'users' => $users,
            'query' => $query,
        ]);
    }
}
