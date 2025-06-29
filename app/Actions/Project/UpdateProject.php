<?php

namespace App\Actions\Project;

use App\Enums\ActivityEvents;
use App\Models\Project;
use function Illuminate\Support\defer;

class UpdateProject
{
    public static function handle(Project $project, array $data): Project
    {
        $project->update($data);
        defer(fn () => activity()
            ->performedOn($project)
            ->event(ActivityEvents::TEAM_PROJECT_CREATED->value)
            ->log(":causer.name update a project named {$project->name} under folder {$project->folder->name}")
        );

        return $project;
    }
}
