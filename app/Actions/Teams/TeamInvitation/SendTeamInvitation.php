<?php

namespace App\Actions\Teams\TeamInvitation;

use App\Enums\ActivityEvents;
use App\Models\Team;
use App\Models\User;

class SendTeamInvitation
{
    public static function handle(array $data, Team $team): void
    {
        $teamInvitation = $team->invitations()->create($data);

        activity()
            ->performedOn($teamInvitation)
            ->event(ActivityEvents::TEAM_INVITATION_SENT->value)
            ->log(':causer.name sent the invitation to :subject.email');
    }
}
