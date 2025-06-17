<?php

namespace App\Http\Controllers;

use App\Http\Requests\TeamRequest;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class TeamController extends Controller
{
    public function store(TeamRequest $request): RedirectResponse
    {
        $user = User::first();
        $user->teams()->create(array_merge($request->validated(), ['personal_team' => true]));
        return back()->with(['success' => 'team created successfully']);
    }

    public function update(TeamRequest $request, Team $team): RedirectResponse
    {
        $team->update($request->validated());
        return back()->with(['success' => 'team updated successfully']);
    }

    public function destroy(Team $team): RedirectResponse
    {
        $team->delete();
        return back()->with(['success' => 'team deleted successfully']);
    }
}
