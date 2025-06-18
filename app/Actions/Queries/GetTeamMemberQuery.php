<?php

namespace App\Actions\Queries;

use App\Models\TeamUser;
use Illuminate\Database\Eloquent\Builder;

class GetTeamMemberQuery
{
    public static function handle(): Builder
    {
        return TeamUser::query();
    }
}
