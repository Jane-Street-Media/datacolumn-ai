<?php

namespace App\Http\Controllers\Team\Invitation;

use App\Actions\Teams\TeamInvitation\AcceptTeamInvitation;
use App\Actions\Teams\TeamInvitation\DeleteTeamInvitation;
use App\Http\Controllers\Controller;
use App\Models\TeamInvitation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class TeamInvitationController extends Controller
{
    public function store(TeamInvitation $teamInvitation): RedirectResponse
    {
        AcceptTeamInvitation::handle(Auth::user(), $teamInvitation, Auth::user());

        return back()->with('success', 'Invite accepted successfully.');
    }

    public function destroy(TeamInvitation $teamInvitation): RedirectResponse
    {
        DeleteTeamInvitation::handle($teamInvitation);

        return back()->with('success', 'Invite cancelled successfully.');
    }
}
