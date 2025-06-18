<?php

namespace App\Actions;

use App\Models\Project;
use Illuminate\Database\Eloquent\Builder;

class GetRecentProjects
{
    public static function execute(): Builder
    {
        return Project::query()->select([
            'user_id',
            'team_id',
            'name',
            'description',
            'status',
            'created_at',
        ]);
    }
}
