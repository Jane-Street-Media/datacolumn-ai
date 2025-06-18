<?php

namespace App\Actions\Teams\TeamInvitation;

use App\Models\TeamInvitation;
use App\Models\User;

class AcceptTeamInvitation
{
    public static function handle(User $user, TeamInvitation $teamInvitation): void
    {
        $teamInvitation->team->users()->sync($user->id);
        $user->assignRole($teamInvitation->role);
        $teamInvitation->delete();
    }
}
