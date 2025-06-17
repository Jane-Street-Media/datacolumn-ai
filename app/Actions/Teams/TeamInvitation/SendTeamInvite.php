<?php

namespace App\Actions\Teams\TeamInvitation;

use App\Models\Team;

class SendTeamInvite
{
    public static function handle(array $data, Team $team): void
    {
        $team->invitations()->create($data);
    }
}
