<?php

namespace App\Actions;

use App\Actions\Project\GetProjects;
use App\Actions\Queries\Dashboard\GetChartQuery;
use App\Enums\ChartStatus;
use App\Enums\PlanFeatureEnum;
use App\Enums\ProjectStatus;
use App\Enums\TeamUserStatus;
use App\Models\User;

class SyncSubscriptionPlanChanges
{
    public static function handle(User $user)
    {
        $freePlanFeatures = $user->currentTeam->freePlan()->features;
        $projectLimit = $freePlanFeatures[PlanFeatureEnum::NO_OF_PROJECTS->value];
        $chartLimit = $freePlanFeatures[PlanFeatureEnum::NO_OF_CHARTS->value];
        $teamMembersLimit = $freePlanFeatures[PlanFeatureEnum::NO_OF_TEAM_MEMBERS->value];

        if(! $user->currentTeam->isOnFreePlan()){
            $currentPlan = $user->currentTeam->subscriptionWithProductDetails()->plan;
            $projectLimit = $currentPlan->features[PlanFeatureEnum::NO_OF_PROJECTS->value];
            $chartLimit = $currentPlan->features[PlanFeatureEnum::NO_OF_CHARTS->value];
            $teamMembersLimit = $currentPlan->features[PlanFeatureEnum::NO_OF_TEAM_MEMBERS->value];
        }

        $totalProjectsCount = GetProjects::handle()->count();
        if ($totalProjectsCount > $projectLimit) {
            $excessProjectCount = $totalProjectsCount - $projectLimit;
            defer(fn() => GetProjects::handle()
                ->latest()
                ->limit($excessProjectCount)
                ->update([
                    'status' => ProjectStatus::INACTIVE,
                ]));
        }

        $totalChartsCount = GetChartQuery::handle()->count();
        if ($totalChartsCount > $chartLimit) {
            $excessChartCount = $totalChartsCount - $chartLimit;
            defer(fn() => GetChartQuery::handle()
                ->latest()
                ->limit($excessChartCount)
                ->update([
                    'status' => ChartStatus::INACTIVE,
                ]));
        }

        $totalTeamMembersCount = $user->currentTeam->users()->count();
        if ($totalTeamMembersCount > $teamMembersLimit) {
            $excessTeamMembersCount = $totalTeamMembersCount - $teamMembersLimit;
            defer(fn() => $user->currentTeam->users()
                ->latest('team_user.created_at')
                ->limit($excessTeamMembersCount)
                ->update([
                    'status' => TeamUserStatus::INACTIVE,
                ]));
        }

    }
}
