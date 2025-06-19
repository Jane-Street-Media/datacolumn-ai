<?php

namespace App\Actions\Teams;

use App\Enums\ActivityEvents;
use App\Models\User;

class UpdateTeamMember
{
    public static function handle(array $data, User $teamMember): void
    {
        $teamMember->syncRoles($data['role']);

        activity()
            ->performedOn($teamMember)
            ->event(ActivityEvents::TEAM_MEMBER_UPDATED->value)
            ->log(':causer.name updated a team member.');
    }
}
