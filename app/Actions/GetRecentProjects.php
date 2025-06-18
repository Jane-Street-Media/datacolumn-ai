<?php

namespace App\Actions;

use App\Models\Project;
use Illuminate\Database\Eloquent\Collection;

class GetRecentProjects
{
    public static function execute(): Collection
    {
        return Project::query()->select([
            'user_id',
            'team_id',
            'name',
            'description',
            'status',
            'created_at',
        ])->latest()->limit(3)->get();
    }
}
