<?php

namespace App\Actions\Teams\TeamInvitation;

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
            ->event('Team Invitation Deleted')
            ->withProperties(['attributes' => $teamInvitation->toArray()])
            ->log(':causer.name deleted the team invitation');
    }
}
