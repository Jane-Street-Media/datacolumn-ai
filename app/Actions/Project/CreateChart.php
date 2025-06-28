<?php

namespace App\Actions\Project;

use App\Data\ChartData;
use App\Models\Chart;
use App\Models\Project;

class CreateChart
{
    public static function handle(Project $project, ChartData $data): Chart
    {
        return $project->charts()->create(array_merge($data->toArray(), ['embed_settings' => $data->config]));
    }
}
