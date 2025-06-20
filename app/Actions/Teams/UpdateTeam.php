<?php

namespace App\Actions\Teams;

use App\Enums\ActivityEvents;
use App\Models\Team;

class UpdateTeam
{
    public static function handle(array $data, Team $team): Team
    {
        $team->update($data);
        defer(fn () => activity()
            ->performedOn($team)
            ->event(ActivityEvents::TEAM_UPDATED->value)
            ->log(":causer.name updated the team named {$team->name}")
        );
        return $team;
    }
}
