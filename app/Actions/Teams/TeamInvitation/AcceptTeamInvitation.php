<?php

namespace App\Actions\Teams\TeamInvitation;

use App\Enums\ActivityEvents;
use App\Models\TeamInvitation;
use App\Models\User;

class AcceptTeamInvitation
{
    public static function handle(User $user, TeamInvitation $teamInvitation): void
    {
        $teamInvitation->team->users()->sync($user->id);
        $user->assignRole($teamInvitation->role);
        $teamInvitation->delete();

        defer(fn () => activity()
            ->performedOn($teamInvitation)
            ->event(ActivityEvents::TEAM_INVITATION_SENT->value)
            ->log(":causer.name accepted the invitation to join the team {$teamInvitation->team->name}.")
        );

    }
}
