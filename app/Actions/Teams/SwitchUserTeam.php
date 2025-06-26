<?php

namespace App\Actions\Teams;

use App\Models\User;

class SwitchUserTeam
{
    public static function handle(User $user, int $teamId): User
    {
        $user->update([
            'current_team_id' => $teamId,
        ]);

        return $user;
    }
}
