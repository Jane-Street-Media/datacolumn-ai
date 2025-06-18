<?php

namespace App\Actions\Queries;

use App\Models\Chart;
use Illuminate\Database\Eloquent\Builder;

class GetChartQuery
{
    public static function handle(): Builder
    {
        return Chart::query();
    }
}
