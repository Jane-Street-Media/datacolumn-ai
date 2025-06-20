<?php

namespace App\Actions\Project;

use App\Enums\ActivityEvents;
use App\Models\Project;

class DeleteProject
{
    public static function handle(Project $project): void
    {
        $project->delete();
        defer(fn () => activity()
            ->performedOn($project)
            ->event(ActivityEvents::TEAM_PROJECT_DELETED->value)
            ->log(":causer.name deleted a project named : {$project->name}. from folder {$project->folder->name}")
        );
    }
}
