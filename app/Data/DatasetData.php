<?php

namespace App\Data;

use App\Enums\DatasetSource;
use Spatie\LaravelData\Data;

class DatasetData extends Data
{
    public function __construct(
        public array $columns,
        public string $name,
        public array $data,
        public int $user_id,
        public int $team_id,
        public DatasetSource $source,
    ) {}
}
