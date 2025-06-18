<?php

namespace App\Actions\Teams\TeamInvitation;

use App\Models\TeamInvitation;
use App\Models\User;

class DeleteTeamInvitation
{
    public static function handle(TeamInvitation $teamInvitation): void
    {
        $teamInvitation->delete();
    }
}
