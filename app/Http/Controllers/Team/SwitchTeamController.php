<?php

namespace App\Http\Controllers\Team;

use App\Actions\Teams\SwitchTeam;
use App\Http\Controllers\Controller;
use App\Http\Requests\Teams\SwitchTeamRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class SwitchTeamController extends Controller
{
    public function update(SwitchTeamRequest $switchTeamRequest): RedirectResponse
    {
        SwitchTeam::handle(Auth::user(), $switchTeamRequest->validated()['team_id']);

        return redirect()->back()->with('success', 'Team switched successfully!');
    }
}
