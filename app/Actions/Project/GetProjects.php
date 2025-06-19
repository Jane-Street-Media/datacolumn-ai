<?php

namespace App\Actions\Project;

use App\Models\Project;
use Illuminate\Database\Eloquent\Collection;

class GetProjects
{
    public static function handle(): Collection
    {
        return Project::withCount('charts')->get();
    }
}
