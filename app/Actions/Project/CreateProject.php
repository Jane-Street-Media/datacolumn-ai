<?php

namespace App\Actions\Project;

use App\Models\User;

class CreateProject
{
    public static function handle(User $user, array $data): void
    {
        $user->projects()->create($data);
    }
}
