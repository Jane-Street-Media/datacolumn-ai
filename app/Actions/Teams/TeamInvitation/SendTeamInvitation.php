<?php

namespace App\Actions\Teams\TeamInvitation;

use App\Models\Team;

class SendTeamInvitation
{
    public static function handle(array $data, Team $team): void
    {
        $team->invitations()->create($data);
    }
}
