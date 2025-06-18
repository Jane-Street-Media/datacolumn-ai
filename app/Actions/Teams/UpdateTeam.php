<?php

namespace App\Actions\Teams;

use App\Models\Team;

class UpdateTeam
{
    public static function handle(array $data, Team $team): void
    {
        $team->update($data);
    }
}
