<?php

namespace App\Http\Controllers;

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
        $data = $request->validated();
        $team->invitations()->create($data);
        return back()->with('success', 'Invite sent successfully.');
    }

    public function update(TeamMemberUpdateRequest $request, User $user): RedirectResponse
    {
        $user->syncRoles($request->validated()['role']);
        return back()->with('success', 'Role updated successfully.');
    }

    public function destroy(TeamMemberDeleteRequest $request, Team $team): RedirectResponse
    {
        $data = $request->validated();
        $team->users()->detach($data['user_id']);
        return back()->with('success', 'User deleted successfully.');
    }
}
