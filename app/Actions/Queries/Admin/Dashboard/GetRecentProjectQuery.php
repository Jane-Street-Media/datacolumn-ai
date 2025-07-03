<?php

namespace App\Actions\Queries\Admin\Dashboard;

use App\Models\Project;
use App\Models\Scopes\TeamScope;
use Illuminate\Database\Eloquent\Builder;

class GetRecentProjectQuery
{
    public static function handle(): Builder
    {
        return Project::query()->withoutGlobalScope(TeamScope::class);
    }
}
