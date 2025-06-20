<?php

namespace App\Actions\Project;

use App\Enums\ActivityEvents;
use App\Models\User;

class CreateProject
{
    public static function handle(User $user, array $data): void
    {
        $project = $user->projects()->create($data);
        activity()
            ->performedOn($project)
            ->event(ActivityEvents::TEAM_PROJECT_CREATED->value)
            ->log(":causer.name created a new project named {$project->name} in folder {$project->folder->name} ");
    }
}
