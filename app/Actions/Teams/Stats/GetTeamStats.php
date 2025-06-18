<?php

namespace App\Actions\Teams\Stats;

use App\Actions\Queries\Team\GetAdminQuery;
use App\Actions\Queries\Team\GetPendingMemberQuery;
use App\Actions\Queries\Team\GetTeamMemberQuery;
use App\Enums\Period;
use App\Helpers\ValueMetric;

class GetTeamStats
{
    public static function handle(): array
    {

        $totalMembersStats = ValueMetric::query(GetTeamMemberQuery::handle())->for(Period::LAST_30_DAYS, true)->count();
        $activeMembersStats = ValueMetric::query(GetTeamMemberQuery::handle())->for(Period::LAST_30_DAYS, true)->count();
        $adminStats = ValueMetric::query(GetAdminQuery::handle())->for(Period::LAST_30_DAYS, true)->count();
        $pendingMemberStats = ValueMetric::query(GetPendingMemberQuery::handle())->for(Period::LAST_30_DAYS, true)->count();


        $totalMembersStats['percentage_change'] = ValueMetric::calculatePercentageChange($totalMembersStats['value'], $totalMembersStats['compare_value']);
        $activeMembersStats['percentage_change'] = ValueMetric::calculatePercentageChange($activeMembersStats['value'], $activeMembersStats['compare_value']);
        $adminStats['percentage_change'] = ValueMetric::calculatePercentageChange($adminStats['value'], $adminStats['compare_value']);
        $pendingMemberStats['percentage_change'] = ValueMetric::calculatePercentageChange($pendingMemberStats['value'], $pendingMemberStats['compare_value']);


        return [
            'totalMembersStats' => $totalMembersStats,
            'activeMembersStats' => $activeMembersStats,
            'adminStats' => $adminStats,
            'pendingMemberStats' => $pendingMemberStats,
        ];
    }
}
