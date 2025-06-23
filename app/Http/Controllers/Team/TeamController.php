<?php

namespace App\Http\Controllers\Team;

use App\Actions\Common\CreateTeam;
use App\Actions\Teams\DeleteTeam;
use App\Actions\Teams\Stats\GetTeamStats;
use App\Actions\Teams\UpdateTeam;
use App\Data\Team\CreateTeamData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Teams\TeamRequest;
use App\Http\Requests\Teams\TeamUpdateRequest;
use App\Models\Team;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class TeamController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('team', [
            'statistics' => GetTeamStats::handle(),
            'roles' => Inertia::defer(fn()=>Role::all())
        ]);
    }

    public function store(TeamRequest $request): RedirectResponse
    {
        CreateTeam::handle(CreateTeamData::from($request->validated()), Auth::user());

        return back()->with(['success' => 'team created successfully']);
    }

    public function update(TeamUpdateRequest $request, Team $team): RedirectResponse
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
