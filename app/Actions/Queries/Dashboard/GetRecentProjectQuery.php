<?php

namespace App\Actions\Queries\Dashboard;

use App\Models\Project;
use Illuminate\Database\Eloquent\Builder;

class GetRecentProjectQuery
{
    public static function handle(): Builder
    {
        return Project::query()->select([
            'id',
            'user_id',
            'team_id',
            'name',
            'description',
            'status',
            'created_at',
        ]);
    }
}
