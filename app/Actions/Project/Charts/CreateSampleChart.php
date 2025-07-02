<?php

namespace App\Actions\Project\Charts;

use App\Actions\PlanLimitations\EnsurePlanLimitNotExceeded;
use App\Enums\PlanFeatureEnum;
use App\Models\Chart;
use App\Models\Project;
use App\Models\User;

class CreateSampleChart
{
    public static function handle(User $user, Project $project): Chart
    {
        EnsurePlanLimitNotExceeded::handle($project->team, PlanFeatureEnum::NO_OF_CHARTS);
        $team = $user->currentTeam;
        $chart = Chart::factory()
            ->count(1)
            ->create([
                'user_id' => $user->id,
                'team_id' => $team->id,
                'project_id' => $project->id,
            ]);
        return $chart->first();
    }
}
