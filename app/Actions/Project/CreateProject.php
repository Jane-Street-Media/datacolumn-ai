<?php

namespace App\Actions\Project;

use App\Enums\ActivityEvents;
use App\Models\User;

class CreateProject
{
    public static function handle(User $user, array $data): void
    {
        $user->projects()->create($data);
        activity()
            ->causedBy($user)
            ->event(ActivityEvents::TEAM_PROJECT_CREATED->value)
            ->log(':causer.name created a new project.');
    }
}
