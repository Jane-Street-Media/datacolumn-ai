<?php

namespace App\Actions\Teams\TeamInvitation;

use App\Enums\ActivityEvents;
use App\Models\TeamInvitation;

class DeleteTeamInvitation
{
    public static function handle(TeamInvitation $teamInvitation): void
    {
        $teamInvitation->delete();
        defer(fn() => activity()
            ->performedOn($teamInvitation)
            ->event(ActivityEvents::TEAM_INVITATION_DELETED->value)
            ->log(":causer.name deleted the invitation sent to {$teamInvitation->email} for team {$teamInvitation->team->name}.")
        );
    }
}
