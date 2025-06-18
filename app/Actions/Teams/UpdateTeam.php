<?php

namespace App\Actions\Teams;

use App\Enums\ActivityEvents;
use App\Models\Team;
use App\Models\User;

class UpdateTeam
{
    public static function handle(array $data, Team $team, User $user): void
    {
        $team->update($data);

        activity()
            ->causedBy($user)
            ->performedOn($team)
            ->event(ActivityEvents::TEAM_UPDATED->value)
            ->log(':causer.name updated the team.');
    }
}
