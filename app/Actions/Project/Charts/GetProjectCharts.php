<?php

namespace App\Actions\Project\Charts;

use App\Data\Projects\Charts\ChartFilterData;
use App\Models\Project;
use Illuminate\Support\Collection;

class GetProjectCharts
{
    public static function handle(Project $project, ?ChartFilterData $data = null): Collection
    {
        $charts = $project->charts()
            ->when($data?->search, fn ($query) => $query->whereAny(['title', 'description'], 'like', '%'.$data->search.'%'))
            ->get();

        if (!$data->analyticsEnabled) {
            $charts->makeHidden('total_visits');
        }
        return $charts;
    }
}
