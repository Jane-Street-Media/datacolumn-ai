<?php

namespace App\Actions\Teams;

use App\Models\Team;
use App\Models\User;

class DeleteTeam
{
    public static function handle(Team $team, User $user): void
    {
        $team->delete();

        activity()
            ->causedBy($user)
            ->performedOn($team)
            ->event('Team Deleted')
            ->withProperties(['attributes' => $team->toArray()])
            ->log(':causer.name deleted the team.');
    }
}
