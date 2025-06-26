<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class CurrentTeamUpdateData extends Data
{
    public function __construct(
        public int $team_id,
    ) {}
}
