<?php

namespace App\Data\Projects\Charts;

use Spatie\LaravelData\Data;

class ChartFilterData extends Data
{
    public function __construct(
        public ?string $search = null,
    ) {}
}
