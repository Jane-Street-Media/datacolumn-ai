<?php

namespace App\Actions\Teams;

use App\Enums\ActivityEvents;
use App\Models\Team;
use App\Models\User;

class RemoveUserFromTeam
{
    public static function handle(array $data, Team $team): void
    {
        $team->users()->detach($data['user_id']);
        $teamMember = User::find($data['user_id']);
        activity()
            ->performedOn($teamMember)
            ->event(ActivityEvents::TEAM_MEMBER_DELETED->value)
            ->log(":causer.name removed {$teamMember->name} from team {$team->name} .");
    }
}
