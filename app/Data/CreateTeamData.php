<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class CreateTeamData extends Data
{
    public function __construct(
        public string $name,
        public ?bool  $personal_team = false,
    )
    {
    }
}
