<?php

namespace App\Actions\Project;

use App\Actions\PlanLimitations\EnsurePlanLimitNotExceeded;
use App\Enums\ActivityEvents;
use App\Enums\PlanFeatureEnum;
use App\Models\Project;
use App\Models\User;
use Exception;

class CreateProject
{

    public static function handle(User $user, array $data): Project
    {
        EnsurePlanLimitNotExceeded::handle($user->currentTeam, PlanFeatureEnum::NO_OF_PROJECTS);
        $project = $user->projects()->create($data);
        defer(fn () => activity()
            ->performedOn($project)
            ->event(ActivityEvents::TEAM_PROJECT_CREATED->value)
            ->log(":causer.name created a new project named {$project->name} under folder {$project->folder->name}.")
        );

        return $project;
    }
}
