<?php

namespace App\Actions\Dashboard;

use App\Models\Chart;
use Illuminate\Database\Eloquent\Builder;

class GetCharts
{
    public static function handle(): Builder
    {
        return Chart::query();
    }
}
