<?php

namespace App\Actions\Teams;

use App\Models\Team;

class RemoveUserFromTeam
{
    public static function handle(array $data, Team $team): void
    {
        $team->users()->detach($data['user_id']);
    }
}
