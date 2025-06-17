<?php

namespace App\Actions\Teams;

use App\Models\Team;
use App\Models\User;

class RemoveUserFromTeam
{
    public static function handle(array $data, Team $team): void
    {
        $team->users()->detach($data['user_id']);
    }
}
