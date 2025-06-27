<?php

namespace App\Actions;

use App\Data\DatasetData;
use App\Models\Dataset;
use App\Models\Project;

class CreateDataset
{
    public static function handle(Project $project, DatasetData $data): Dataset
    {
        return $project->datasets()->create($data->toArray());
    }
}
