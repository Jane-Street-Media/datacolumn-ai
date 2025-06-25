<?php

namespace App\Actions;

use App\Models\User;

class UpdateUserCurrentTeam
{
    public static function handle(User $user, array $data): User
    {
        $user->update([
            'current_team_id' => $data['team_id'],
        ]);
        return $user;
    }
}
