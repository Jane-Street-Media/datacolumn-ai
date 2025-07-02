<?php

namespace App\Actions\Project;

use App\Actions\PlanLimitations\EnsurePlanLimitNotExceeded;
use App\Data\ChartData;
use App\Enums\PlanFeatureEnum;
use App\Models\Chart;
use App\Models\Project;

class CreateChart
{
    public static function handle(Project $project, ChartData $data): Chart
    {
        EnsurePlanLimitNotExceeded::handle($project->team, PlanFeatureEnum::NO_OF_CHARTS);
        return $project->charts()->create(array_merge($data->toArray(), ['embed_settings' => $data->config]));
    }
}
