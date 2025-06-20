<?php

namespace App\Actions\Teams\TeamInvitation;

use App\Enums\ActivityEvents;
use App\Models\Team;
use App\Models\User;

class SendTeamInvitation
{
    public static function handle(array $data, Team $team, User $user): void
    {
        $teamInvitation = $team->invitations()->create($data);

        activity()
            ->causedBy($user)
            ->performedOn($teamInvitation)
            ->event(ActivityEvents::TEAM_INVITATION_SENT->value)
            ->log(":causer.name invited :subject.email to join {$team->name} team.");
    }
}
