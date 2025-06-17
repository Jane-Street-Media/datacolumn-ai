<?php

namespace App\Actions\Teams;

use App\Models\Team;
use App\Models\User;

class DeleteTeam
{
    public static function handle(Team $team,): void
    {
        $team->delete();
    }
}
