<?php

namespace App\Actions\Project;

use App\Actions\GetSubscriptionPlanWithFeatures;
use App\Enums\ActivityEvents;
use App\Models\Project;
use App\Models\User;
use Exception;

class CreateProject
{
    public static function handle(User $user, array $data): Project
    {
        $subscribedPlan = GetSubscriptionPlanWithFeatures::handle($user);
        if ($user->currentTeam->projects()->count() >= $subscribedPlan['features']['no_of_projects']) {
            throw new Exception('You have reached the maximum number of projects allowed by your plan');
        }
        $project = $user->projects()->create($data);
        defer(fn () => activity()
            ->performedOn($project)
            ->event(ActivityEvents::TEAM_PROJECT_CREATED->value)
            ->log(":causer.name created a new project named {$project->name} under folder {$project->folder->name}.")
        );

        return $project;
    }
}
