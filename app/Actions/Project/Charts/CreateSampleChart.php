<?php

namespace App\Actions\Project\Charts;

use App\Actions\PlanLimitations\EnsurePlanLimitNotExceeded;
use App\Enums\PlanFeatureEnum;
use App\Models\Chart;
use App\Models\Project;
use App\Models\User;

class CreateSampleChart
{
    public static function handle(User $user, Project $project, array $chartConfig): Chart
    {
        EnsurePlanLimitNotExceeded::handle($project->team, PlanFeatureEnum::NO_OF_CHARTS);
        $team = $user->currentTeam;
        $data = $chartConfig['data'];
        unset($chartConfig['data']);
        $chart = Chart::factory()
            ->count(1)
            ->create([
                'user_id' => $user->id,
                'team_id' => $team->id,
                'project_id' => $project->id,
                'data' => $data,
                'config' => $chartConfig,
                'type' => $chartConfig['type'] ?? 'composed',
            ]);
        return $chart->first();
    }
}
