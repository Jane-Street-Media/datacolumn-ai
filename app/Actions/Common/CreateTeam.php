<?php

namespace App\Actions\Common;

use App\Data\Team\CreateTeamData;
use App\Models\Team;
use App\Models\User;

class CreateTeam
{
    public static function handle(CreateTeamData $data, User $user): void
    {
        $team = $user->teams()->create(array_merge($data->toArray(), ['user_id' => $user->id]));
        $team->users()->attach($user->id);
        $user->update(['current_team_id' => $team->id]);
        $user->assignRole('owner');
    }
}
