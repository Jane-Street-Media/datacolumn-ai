<?php

namespace App\Actions;

use App\Data\CreateProjectData;
use App\Models\Dataset;
use App\Models\Project;

class CreateDataset
{
    public static function handle(Project $project, CreateProjectData $data): Dataset
    {
        return $project->datasets()->create($data->dataset->toArray());
    }
}
