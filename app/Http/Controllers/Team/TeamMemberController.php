<?php

namespace App\Http\Controllers\Team;

use App\Actions\Teams\RemoveUserFromTeam;
use App\Actions\Teams\TeamInvitation\SendTeamInvitation;
use App\Actions\Teams\UpdateTeamMember;
use App\Http\Controllers\Controller;
use App\Http\Requests\Teams\TeamMemberDeleteRequest;
use App\Http\Requests\Teams\TeamMemberRequest;
use App\Http\Requests\Teams\TeamMemberUpdateRequest;
use App\Models\Team;
use App\Models\User;
use Exception;
use Illuminate\Http\RedirectResponse;

class TeamMemberController extends Controller
{
    public function store(TeamMemberRequest $request, Team $team): RedirectResponse
    {
        try {
            SendTeamInvitation::handle($request->validated(), $team);

            return back()->with('success', 'Invite sent successfully.');
        } catch (Exception $exception) {
            return back()->with('error', $exception->getMessage());
        }
    }

    public function update(TeamMemberUpdateRequest $request, User $user): RedirectResponse
    {
        UpdateTeamMember::handle($request->validated(), $user);

        return back()->with('success', 'Role assigned successfully.');
    }

    public function destroy(TeamMemberDeleteRequest $request, Team $team): RedirectResponse
    {
        RemoveUserFromTeam::handle($request->validated(), $team);

        return back()->with('success', 'User removed from team.');
    }
}
