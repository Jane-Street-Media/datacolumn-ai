<?php

namespace App\Actions\Project;

use App\Actions\PlanLimitations\EnsurePlanLimitNotExceeded;
use App\Data\ChartData;
use App\Data\CreateProjectData;
use App\Data\DatasetData;
use App\Enums\ActivityEvents;
use App\Enums\DatasetSource;
use App\Enums\PlanFeatureEnum;
use App\Exceptions\PackageLimitExceededException;
use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CreateProject
{
    /**
     * @throws PackageLimitExceededException
     */
    public static function handle(User $user, CreateProjectData $data): Project
    {
        EnsurePlanLimitNotExceeded::handle($user->currentTeam, PlanFeatureEnum::NO_OF_PROJECTS);

        return DB::transaction(function () use ($user, $data) {
            $project = $user->projects()->create($data->toArray());
            $message = ':causer.name created a new project named ' . $project->name
                . ($project->folder ? ' under folder ' . $project->folder->name : '.');

            if (isset($data->chart)) {
                CreateChart::handle($project, ChartData::from([
                    ...$data->chart->toArray(),
                    'user_id' => $user->id,
                    'team_id' => $data->team_id,
                ]));
            }

            if (isset($data->chart)) {
                CreateDataset::handle($project, DatasetData::from([
                    ...$data->dataset->toArray(),
                    'user_id' => $user->id,
                    'source' => DatasetSource::AI_ASSISTANT,
                    'team_id' => $data->team_id,
                ]));
            }

            defer(fn() => activity()
                ->performedOn($project)
                ->event(ActivityEvents::TEAM_PROJECT_CREATED->value)
                ->log($message)
            );

            return $project;
        });
    }
}
