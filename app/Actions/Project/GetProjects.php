<?php

namespace App\Actions\Project;

use App\Models\Project;

class GetProjects
{
    public static function handle(array $data)
    {
        return Project::withCount('charts')
            ->when(isset($data['folder']), fn ($q) => $q->whereRelation('folder', 'id', $data['folder']))
            ->when(isset($data['search']), fn ($query) => $query->where('name', 'like', '%'.$data['search'].'%'))
            ->get();
    }
}
