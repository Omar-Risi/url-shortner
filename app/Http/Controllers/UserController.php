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
        $sortOrder = $request->get('sort_order', 'desc');

        $users = User::where('id', '!=', auth()->id())
            ->when($query, function ($queryBuilder) use ($query) {
                return $queryBuilder->where(function ($q) use ($query) {
                    $q->where('name', 'LIKE', '%' . $query . '%')
                      ->orWhere('email', 'LIKE', '%' . $query . '%')
                      ->orWhere('phone_number', 'LIKE', '%' . $query . '%');
                });
            })
            ->orderBy('id', $sortOrder)
            ->paginate(25)
            ->withQueryString(); // Preserve search parameters in pagination links

        return Inertia::render('users', [
            'users' => $users,
            'query' => $query,
            'sort_by'=> 'id',
            'sort_order' => $sortOrder
        ]);
    }

    public function edit(Request $request, string $id) {
        $user = User::findOrFail($id);

        return Inertia::render('user/edit', [
            'user' => $user,
        ]);
    }

    public function update(Request $request, string $id) {

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255',
            'phone_number' => ['required', 'string', 'max:20'],
            'is_admin' => ['boolean'],
        ]);

        $user = User::findOrFail($id);

        $user->update(
            $validated
        );

        return redirect()->to(route('users'))->with('success');
    }
}
