<?php

namespace App\Actions\Dashboard;

use App\Models\TeamUser;
use Illuminate\Database\Eloquent\Builder;

class GetTeamMembers
{
    public static function handle(): Builder
    {
        return TeamUser::query();
    }
}
