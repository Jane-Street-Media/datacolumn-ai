<?php

namespace App\Actions\Project;

use App\Enums\ActivityEvents;
use App\Models\Project;

class UpdateProject
{
    public static function handle(Project $project, array $data): void
    {
        $project->update($data);
        activity()
            ->causedBy($project->user)
            ->event(ActivityEvents::TEAM_PROJECT_CREATED->value)
            ->log(':causer.name updated the project.');
    }
}
