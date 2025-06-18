<?php

namespace App\Actions\Dashboard;

use App\Actions\GetRecentProjects;
use App\Enums\Period;
use App\Helpers\ValueMetric;
use App\Models\Team;

class GetStats
{
    public static function handle()
    {
        $projectStats = ValueMetric::query(GetRecentProjects::execute())->for(Period::LAST_30_DAYS, true)->count();
        $projectStats['percentage_change'] = ValueMetric::calculatePercentageChange($projectStats['value'], $projectStats['compare_value']);

        $teamMemberStats = ValueMetric::query(GetTeamMembers::handle())->for(Period::LAST_30_DAYS, true)->count();
        $teamMemberStats['percentage_change'] = ValueMetric::calculatePercentageChange($teamMemberStats['value'], $teamMemberStats['compare_value']);

        $chartStats = ValueMetric::query(GetCharts::handle())->for(Period::LAST_30_DAYS, true)->count();
        $chartStats['percentage_change'] = ValueMetric::calculatePercentageChange($chartStats['value'], $chartStats['compare_value']);

        return [
            'projectStats' => $projectStats,
            'teamMemberStats' => $teamMemberStats,
            'chartStats' => $chartStats
        ];
    }
}
