<?php

namespace App\Actions\Teams;

use App\Models\Team;
use App\Models\User;

class UpdateTeam
{
    public static function handle(array $data, Team $team): void
    {
        $team->update($data);
    }
}
