<?php

namespace App\Actions\Teams;

use App\Enums\ActivityEvents;
use App\Models\User;

class UpdateTeamMember
{
    public static function handle(array $data, User $user): void
    {
        $user->syncRoles($data['role']);
        defer(fn () => activity()
            ->performedOn($user)
            ->event(ActivityEvents::TEAM_MEMBER_UPDATED->value)
            ->log(":causer.name updated a team member named {$user->name}.")
        );
    }
}
