<?php

namespace App\Actions\Teams;

use App\Models\User;

class UpdateUserRole
{
    public static function handle(array $data ,User $user): void
    {
        $user->syncRoles($data['role']);
    }
}
