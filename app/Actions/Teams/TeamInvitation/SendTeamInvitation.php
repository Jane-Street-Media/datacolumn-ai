<?php

namespace App\Actions\Teams\TeamInvitation;

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
            ->event('Invitation Sent')
            ->withProperties(['attributes' => $teamInvitation->toArray()])
            ->log(':causer.name sent the invitation to :subject.email');
    }
}
