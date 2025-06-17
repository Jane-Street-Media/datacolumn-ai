<?php

namespace App\Actions\Teams;

use App\Models\User;

class CreateTeam
{
    public static function handle(User $user, array $data): void
    {
        $user->teams()->create(array_merge($data));
    }
}
