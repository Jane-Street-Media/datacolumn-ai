<?php

namespace App\Data\Team;

use Spatie\LaravelData\Data;

class CreateTeamData extends Data
{
    public function __construct(
        public string $name,
        public ?bool $personal_team = false,
    ) {}
}
