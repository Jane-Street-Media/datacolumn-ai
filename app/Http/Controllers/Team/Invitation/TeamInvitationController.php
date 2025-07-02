<?php

namespace App\Http\Controllers\Team\Invitation;

use App\Actions\Teams\TeamInvitation\AcceptTeamInvitation;
use App\Actions\Teams\TeamInvitation\DeleteTeamInvitation;
use App\Exceptions\PackageLimitExceededException;
use App\Http\Controllers\Controller;
use App\Models\Scopes\TeamScope;
use App\Models\TeamInvitation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class TeamInvitationController extends Controller
{
    public function store(int $teamInvitationId): RedirectResponse
    {
        $teamInvitation = TeamInvitation::query()->withoutGlobalScope(TeamScope::class)->findOrFail($teamInvitationId);
        AcceptTeamInvitation::handle(Auth::user(), $teamInvitation);
        return redirect(route('dashboard'))->with('success', 'You’ve successfully joined the team. You can now collaborate with your teammates.');
    }

    public function destroy(TeamInvitation $teamInvitation): RedirectResponse
    {
        DeleteTeamInvitation::handle($teamInvitation);

        return back()->with('success', 'Invite cancelled successfully.');
    }
}
