<?php

namespace App\Http\Controllers;

use App\Actions\Teams\TeamInvitation\AcceptTeamInvitation;
use App\Actions\Teams\TeamInvitation\DeleteInvitation;
use App\Http\Requests\TeamInvitationRequest;
use App\Models\TeamInvitation;
use App\Models\User;
use Illuminate\Http\RedirectResponse;

class TeamInvitationController extends Controller
{
    public function store(TeamInvitationRequest $request, TeamInvitation $teamInvitation): RedirectResponse
    {
        $data = $request->validated();
        $user = User::findOrfail($data['user_id']);
        AcceptTeamInvitation::handle($user, $teamInvitation);
        $teamInvitation->delete();
        return back()->with('success', 'Invite accepted successfully.');
    }

    public function destroy(TeamInvitation $teamInvitation): RedirectResponse
    {
        DeleteInvitation::handle($teamInvitation);
        return back()->with('success', 'Invite cancelled successfully.');
    }

}
