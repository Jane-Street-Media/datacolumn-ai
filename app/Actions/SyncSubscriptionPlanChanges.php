<?php

namespace App\Actions;

use App\Actions\Project\GetProjects;
use App\Actions\Queries\Dashboard\GetChartQuery;
use App\Enums\ChartStatus;
use App\Enums\PlanFeatureEnum;
use App\Enums\ProjectStatus;
use App\Models\TeamInvitation;
use App\Models\User;

class SyncSubscriptionPlanChanges
{
    public static function handle(User $user): void
    {
        $currentPlanFeatures = $user->currentTeam->subscriptionWithProductDetails()->plan->features;
        $projectLimit = $currentPlanFeatures[PlanFeatureEnum::NO_OF_PROJECTS->value];
        $chartLimit = $currentPlanFeatures[PlanFeatureEnum::NO_OF_CHARTS->value];
        $teamMembersLimit = $currentPlanFeatures[PlanFeatureEnum::NO_OF_TEAM_MEMBERS->value];

        if ($projectLimit !== -1) {
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
        }


        if ($chartLimit !== -1) {
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
        }

        if ($teamMembersLimit !== -1) {
            $totalTeamMembersCount = $user->currentTeam->invitations()->count() + $user->currentTeam->users()->count();
            if ($totalTeamMembersCount > $teamMembersLimit) {
                $excessTeamMembersCount = $totalTeamMembersCount - $teamMembersLimit;
                defer(fn() => TeamInvitation::query()->latest()->limit($excessTeamMembersCount)->delete());
            }
        }
    }
}
