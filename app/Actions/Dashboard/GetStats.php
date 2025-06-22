<?php

namespace App\Actions\Dashboard;

use App\Actions\Queries\Dashboard\GetChartQuery;
use App\Actions\Queries\Dashboard\GetRecentProjectQuery;
use App\Actions\Queries\Dashboard\GetTeamMemberQuery;
use App\Enums\Period;
use App\Helpers\ValueMetric;

class GetStats
{
    public static function handle(): array
    {
        $projectStats = ValueMetric::query(GetRecentProjectQuery::handle())->for(Period::LAST_30_DAYS, true)->count();

        $teamMemberStats = ValueMetric::query(GetTeamMemberQuery::handle())->for(Period::LAST_30_DAYS, true)->count();

        $chartStats = ValueMetric::query(GetChartQuery::handle())->for(Period::LAST_30_DAYS, true)->count();

        $projectStats['percentage_change'] = ValueMetric::calculatePercentageChange($projectStats['value'], $projectStats['compare_value']);

        $teamMemberStats['percentage_change'] = ValueMetric::calculatePercentageChange($teamMemberStats['value'], $teamMemberStats['compare_value']);

        $chartStats['percentage_change'] = ValueMetric::calculatePercentageChange($chartStats['value'], $chartStats['compare_value']);

        return [
            'projectStats' => $projectStats,
            'teamMemberStats' => $teamMemberStats,
            'chartStats' => $chartStats,
        ];
    }
}
