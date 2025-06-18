<?php

namespace App\Actions\Teams;

use App\Models\User;

class UpdateTeamMember
{
    public static function handle(array $data ,User $user): void
    {
        $user->syncRoles($data['role']);
    }
}
