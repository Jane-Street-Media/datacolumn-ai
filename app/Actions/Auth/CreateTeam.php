<?php

namespace App\Actions\Auth;

use App\Models\Team;
use App\Models\User;
use Spatie\Permission\PermissionRegistrar;

class CreateTeam
{
    public static function handle(User $user): void
    {
        $team = Team::create([
            'name' => $user->name . "'s Team",
            'personal_team' => true,
            'user_id' => $user->id,
        ]);
        $team->users()->attach($user->id);
        $user->assignRole('owner');
        $user->update(['current_team_id' => $team->id]);
    }
}
