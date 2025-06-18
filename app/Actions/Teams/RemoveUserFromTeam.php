<?php

namespace App\Actions\Teams;

use App\Models\Team;
use App\Models\User;

class RemoveUserFromTeam
{
    public static function handle(array $data, Team $team, User $user): void
    {
        $team->users()->detach($data['user_id']);

        $teamMember = User::find($data['user_id']);
        activity()
            ->causedBy($user)
            ->performedOn($teamMember)
            ->event('Team Member Removed')
            ->withProperties(['attributes' => $teamMember->toArray()])
             ->log(':causer.name removed a team member.');
    }
}
