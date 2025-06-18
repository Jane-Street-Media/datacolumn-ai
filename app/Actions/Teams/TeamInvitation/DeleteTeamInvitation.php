<?php

namespace App\Actions\Teams\TeamInvitation;

use App\Enums\ActivityEvents;
use App\Models\TeamInvitation;
use App\Models\User;

class DeleteTeamInvitation
{
    public static function handle(TeamInvitation $teamInvitation, User $user): void
    {
        $teamInvitation->delete();

        activity()
            ->causedBy($user)
            ->performedOn($teamInvitation)
            ->event(ActivityEvents::TEAM_INVITATION_DELETED->value)
            ->log(':causer.name deleted the team invitation');
    }
}
