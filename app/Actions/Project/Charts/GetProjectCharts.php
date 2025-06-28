<?php

namespace App\Actions\Project\Charts;

use App\Data\Projects\Charts\ChartFilterData;
use App\Models\Project;
use Illuminate\Support\Collection;

class GetProjectCharts
{
    public static function handle(Project $project, ?ChartFilterData $data = null): Collection
    {
        return $project->charts()
            ->when($data?->search, fn ($query) => $query->whereAny(['title', 'description'], 'like', '%'.$data->search.'%'))
            ->get();
    }
}
