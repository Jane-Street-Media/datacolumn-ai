<?php

namespace App\Http\Controllers\Team;

use App\Actions\Teams\SwitchUserTeam;
use App\Http\Controllers\Controller;
use App\Http\Requests\Teams\SwitchUserTeamRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class SwitchUserTeamController extends Controller
{
    public function update(SwitchUserTeamRequest $switchTeamRequest): RedirectResponse
    {
        SwitchUserTeam::handle(Auth::user(), $switchTeamRequest->validated()['team_id']);

        return redirect()->back()->with('success', 'Team switched successfully!');
    }
}
