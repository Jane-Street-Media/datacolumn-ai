<?php

namespace App\Actions\Teams\TeamInvitation;

use App\Enums\ActivityEvents;
use App\Models\Team;

class SendTeamInvitation
{
    public static function handle(array $data, Team $team): void
    {
        $teamInvitation = $team->invitations()->create($data);
        defer(fn () => activity()
            ->performedOn($teamInvitation)
            ->event(ActivityEvents::TEAM_INVITATION_SENT->value)
            ->log(":causer.name invited :subject.email to join {$team->name} team.")
        );
    }
}
