<?php

namespace App\Actions\Teams;

use App\Enums\ActivityEvents;
use App\Models\User;

class UpdateTeamMember
{
    public static function handle(array $data, User $teamMember, User $user): void
    {
        $teamMember->syncRoles($data['role']);

        activity()
            ->causedBy($user)
            ->performedOn($teamMember)
            ->event(ActivityEvents::TEAM_MEMBER_UPDATED->value)
            ->log(':causer.name updated a team member.');
    }
}
