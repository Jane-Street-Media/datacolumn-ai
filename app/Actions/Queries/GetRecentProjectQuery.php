<?php

namespace App\Actions\Queries;

use App\Models\Project;
use Illuminate\Database\Eloquent\Builder;

class GetRecentProjectQuery
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
