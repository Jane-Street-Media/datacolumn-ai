<?php

namespace App\Actions\Teams;

use App\Enums\ActivityEvents;
use App\Models\Team;
use function Illuminate\Support\defer;

class DeleteTeam
{
    public static function handle(Team $team): Team
    {
        $team->delete();
        defer(fn () => activity()
            ->performedOn($team)
            ->event(ActivityEvents::TEAM_DELETED->value)
            ->log(":causer.name deleted the team named {$team->name}")
        );

        return $team;
    }
}
