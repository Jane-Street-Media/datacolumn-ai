<?php

namespace App\Actions\Teams;

use App\Models\TeamInvitation;
use Illuminate\Database\Eloquent\Collection;

class GetTeamInvitations
{
    public static function handle(): Collection
    {
        return TeamInvitation::query()->get();
    }
}
