<?php

namespace App\Actions\Queries\Admin\Dashboard;

use App\Models\Scopes\TeamScope;
use App\Models\Team;
use Illuminate\Database\Eloquent\Builder;

class GetTeamsQuery
{
    public static function handle(): Builder
    {
        return Team::query()->withoutGlobalScope(TeamScope::class);
    }
}
