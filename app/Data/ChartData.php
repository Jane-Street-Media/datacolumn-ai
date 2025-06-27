<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class ChartData extends Data
{
    public function __construct(
        public string $title,
        public string $type,
        public string $description,
        public array $config,
        public array $data,
        public int $user_id,
        public int $team_id,
    ) {}
}
