<?php

namespace App\Http\Controllers;

use App\Actions\Teams\UpdateUserRole;
use App\Actions\Teams\TeamInvitation\SendTeamInvite;
use App\Actions\Teams\RemoveUserFromTeam;
use App\Http\Requests\TeamMemberDeleteRequest;
use App\Http\Requests\TeamMemberRequest;
use App\Http\Requests\TeamMemberUpdateRequest;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\RedirectResponse;

class TeamMemberController extends Controller
{
    public function store(TeamMemberRequest $request, Team $team): RedirectResponse
    {
        SendTeamInvite::handle($request->validated(), $team);
        return back()->with('success', 'Invite sent successfully.');
    }

    public function update(TeamMemberUpdateRequest $request, User $user): RedirectResponse
    {
        UpdateUserRole::handle($request->validated(), $user);
        return back()->with('success', 'Role assigned successfully.');
    }

    public function destroy(TeamMemberDeleteRequest $request, Team $team): RedirectResponse
    {
        RemoveUserFromTeam::handle($request->validated(), $team);
        return back()->with('success', 'User removed from team.');
    }
}
