<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class CreateProjectData extends Data
{
    public function __construct(
        public ?string $name,
        public ?string $description,
        public ?string $status,
        public ?int $folder_id,
        public ?int $team_id,
        public ?ChartData $chart,
        public ?DatasetData $dataset,

    ) {}
}
