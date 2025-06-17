<?php

namespace App\Http\Controllers;

use App\Http\Requests\TeamInvitationRequest;
use App\Models\Team;
use App\Models\TeamInvitation;
use App\Models\User;
use Illuminate\Http\RedirectResponse;

class TeamInvitationController extends Controller
{
    public function store(TeamInvitationRequest $request, TeamInvitation $teamInvitation): RedirectResponse
    {
        $data = $request->validated();
        $user = User::findOrfail($data['user_id']);

        $teamInvitation->team->users()->attach($user->id,[
            'role' => $teamInvitation->role,
        ]);
        $user->assignRole($teamInvitation->role);
        $teamInvitation->delete();
        return back()->with('success', 'Invite accepted successfully.');
    }

    public function destroy(TeamInvitation $teamInvitation): RedirectResponse
    {
        $teamInvitation->delete();
        return back()->with('success', 'Invite cancelled successfully.');
    }

}
