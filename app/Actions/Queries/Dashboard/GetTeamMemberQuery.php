<?php

namespace App\Actions\Queries\Dashboard;

use App\Models\TeamUser;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

class GetTeamMemberQuery
{
    public static function handle(): Builder
    {
        return TeamUser::query();
    }
}
