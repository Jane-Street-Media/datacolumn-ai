<?php

namespace App\Actions\Project;

use App\Models\Project;
use Illuminate\Database\Eloquent\Builder;

class GetProjects
{
    public static function handle(?array $data = null): Builder
    {
        if (!isset($data['analyticsEnabled'])) {
            $data['analyticsEnabled'] = false; // Default to false if not set
        }

        return Project::query()->withCount('charts')
            ->when($data['analyticsEnabled'], fn ($q) => $q->withSum('charts', 'total_visits'))
            ->when(isset($data['folder']), fn ($q) => $q->whereRelation('folder', 'id', $data['folder']))
            ->when(isset($data['search']), fn ($query) => $query->where('name', 'like', '%'.$data['search'].'%'));
    }
}
