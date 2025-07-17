<?php

namespace App\Actions\Queries\Admin\Dashboard;

use App\Models\Chart;
use App\Models\Scopes\TeamScope;
use Illuminate\Database\Eloquent\Builder;

class GetChartQuery
{
    public static function handle(): Builder
    {
        return Chart::query()->withoutGlobalScope(TeamScope::class);
    }
}
