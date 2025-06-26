<?php

namespace App\Http\Controllers\Team\Invitation;

use App\Actions\Teams\TeamInvitation\AcceptTeamInvitation;
use App\Actions\Teams\TeamInvitation\DeleteTeamInvitation;
use App\Http\Controllers\Controller;
use App\Models\Scopes\TeamScope;
use App\Models\TeamInvitation;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class TeamInvitationController extends Controller
{
    public function store(int $teamInvitationId): RedirectResponse
    {
        $teamInvitation = TeamInvitation::query()->withoutGlobalScope(TeamScope::class)->findOrFail($teamInvitationId);
        AcceptTeamInvitation::handle(Auth::user(), $teamInvitation);
        return redirect(route('dashboard'));
    }

    public function destroy(TeamInvitation $teamInvitation): RedirectResponse
    {
        DeleteTeamInvitation::handle($teamInvitation);

        return back()->with('success', 'Invite cancelled successfully.');
    }
}
