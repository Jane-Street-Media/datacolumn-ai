<?php

namespace App\Actions;

use App\Data\CreateProjectData;
use App\Models\Chart;
use App\Models\Project;

class CreateChart
{
    public static function handle(Project $project, CreateProjectData $data): Chart
    {
        return $project->charts()->create($data->chart->toArray());
    }
}
