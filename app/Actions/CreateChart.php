<?php

namespace App\Actions;

use App\Data\ChartData;
use App\Data\CreateProjectData;
use App\Models\Chart;
use App\Models\Project;

class CreateChart
{
    public static function handle(Project $project, ChartData $data): Chart
    {
        return $project->charts()->create($data->toArray());
    }
}
