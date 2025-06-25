<?php

namespace App\Actions\Common;

use App\Data\Team\CreateTeamData;
use App\Enums\ActivityEvents;
use App\Models\Team;
use App\Models\User;
use function Illuminate\Support\defer;

class CreateTeam
{
    public static function handle(CreateTeamData $data, User $user): Team
    {
        $team = Team::create(array_merge($data->toArray(), ['user_id' => $user->id]));
        $user->update(['current_team_id' => $team->id]);
        setPermissionsTeamId($team->id);
        $team->users()->attach($user->id);
        $user->assignRole('owner');

        defer(fn () => activity()
            ->causedBy($user)
            ->performedOn($team)
            ->event(ActivityEvents::TEAM_CREATED->value)
            ->log(":causer.name created a new team named {$team->name}.")
        );

        return $team;
    }
}
