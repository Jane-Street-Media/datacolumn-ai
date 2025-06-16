<?php

namespace App\Actions\Auth;

use App\Data\RegisterUserData;
use App\Models\User;
use Illuminate\Auth\Events\Registered;

class CreateTeam
{
    public static function handle(User $user): void
    {
        $team = $user->teams()->create([
            'name' => $user->name . "'s team",
            'personal_team' => true,
            'user_id' => $user->id
        ]);
        $user->update([
            'current_team_id' => $team->id,
        ]);
    }
}
