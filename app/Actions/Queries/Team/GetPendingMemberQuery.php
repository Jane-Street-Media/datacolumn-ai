<?php

namespace App\Actions\Queries\Team;

use App\Models\TeamInvitation;
use Illuminate\Database\Eloquent\Builder;

class GetPendingMemberQuery
{
    public static function handle(): Builder
    {
        return TeamInvitation::query();
    }
}
