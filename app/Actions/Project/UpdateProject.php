<?php

namespace App\Actions\Project;

use App\Models\Project;

class UpdateProject
{
    public static function handle(Project $project, array $data): void
    {
        $project->update($data);
    }
}
