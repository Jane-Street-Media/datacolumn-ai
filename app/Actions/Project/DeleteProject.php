<?php

namespace App\Actions\Project;

use App\Models\Project;

class DeleteProject
{
    public static function handle(Project $project): void
    {
        $project->delete();
    }
}
