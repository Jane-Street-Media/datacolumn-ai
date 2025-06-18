<?php

namespace App\Actions\Dashboard;

use App\Actions\GetRecentProjects;
use App\Enums\Period;
use App\Helpers\ValueMetric;

class GetStats
{
    public static function handle()
    {
        $projects = ValueMetric::query(GetRecentProjects::execute())->for(Period::LAST_30_DAYS, true)->count();
        $projects['percentage_change'] = ValueMetric::calculatePercentageChange($projects['value'], $projects['compare_value']);

        return [
            'projects' => $projects,
        ];
    }
}
