<?php

namespace App\Actions\Project;

use App\Enums\ActivityEvents;
use App\Models\Project;

class DeleteProject
{
    public static function handle(Project $project): void
    {
        $project->delete();
        activity()
            ->causedBy($project->user)
            ->event(ActivityEvents::TEAM_PROJECT_DELETED->value)
            ->log(':causer.name deleted the project.');
    }
}
