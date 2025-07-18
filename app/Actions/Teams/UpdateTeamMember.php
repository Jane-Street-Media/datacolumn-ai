<?php

namespace App\Actions\Teams;

use App\Enums\ActivityEvents;
use App\Models\User;
use function Illuminate\Support\defer;

class UpdateTeamMember
{
    public static function handle(array $data, User $user): User
    {
        $user->syncRoles($data['role']);
        defer(fn () => activity()
            ->performedOn($user)
            ->event(ActivityEvents::TEAM_MEMBER_UPDATED->value)
            ->log(":causer.name updated a team member named {$user->name}.")
        );

        return $user;
    }
}
