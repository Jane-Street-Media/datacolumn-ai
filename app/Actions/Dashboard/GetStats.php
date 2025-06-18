<?php

namespace App\Actions\Dashboard;

use App\Actions\GetRecentProjects;
use App\Enums\Period;
use App\Helpers\ValueMetric;
use Illuminate\Support\Facades\Concurrency;

class GetStats
{
    public static function handle(): array
    {
        [$projectStats, $teamMemberStats, $chartStats] = Concurrency::run([
            fn () => ValueMetric::query(GetRecentProjects::execute())->for(Period::LAST_30_DAYS, true)->count(),
            fn () => ValueMetric::query(GetTeamMembers::handle())->for(Period::LAST_30_DAYS, true)->count(),
            fn () => ValueMetric::query(GetCharts::handle())->for(Period::LAST_30_DAYS, true)->count(),
        ]);
        $projectStats['percentage_change'] = ValueMetric::calculatePercentageChange($projectStats['value'], $projectStats['compare_value']);
        $teamMemberStats['percentage_change'] = ValueMetric::calculatePercentageChange($teamMemberStats['value'], $teamMemberStats['compare_value']);
        $chartStats['percentage_change'] = ValueMetric::calculatePercentageChange($chartStats['value'], $chartStats['compare_value']);

        return [
            'projectStats' => $projectStats,
            'teamMemberStats' => $teamMemberStats,
            'chartStats' => $chartStats
        ];
    }
}
