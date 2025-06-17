<?php

namespace App\Http\Controllers;

use App\Actions\Teams\CreateTeam;
use App\Actions\Teams\DeleteTeam;
use App\Actions\Teams\UpdateTeam;
use App\Http\Requests\TeamRequest;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class TeamController extends Controller
{
    public function store(TeamRequest $request): RedirectResponse
    {
        CreateTeam::handle(Auth::user(), $request->validated());
        return back()->with(['success' => 'team created successfully']);
    }

    public function update(TeamRequest $request, Team $team): RedirectResponse
    {
        UpdateTeam::handle($request->validated(), $team);
        return back()->with(['success' => 'team updated successfully']);
    }

    public function destroy(Team $team): RedirectResponse
    {
        DeleteTeam::handle($team);
        return back()->with(['success' => 'team deleted successfully']);
    }
}
