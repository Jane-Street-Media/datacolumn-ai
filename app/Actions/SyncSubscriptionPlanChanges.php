<?php

namespace App\Actions;

use App\Actions\Project\GetProjects;
use App\Actions\Queries\Dashboard\GetChartQuery;
use App\Enums\ChartStatus;
use App\Enums\PlanFeatureEnum;
use App\Enums\ProjectStatus;
use App\Models\TeamInvitation;
use App\Models\User;
use LibDNS\Records\Types\Char;

class SyncSubscriptionPlanChanges
{
    public static function handle(User $user): void
    {
        $currentPlanFeatures = $user->currentTeam->subscriptionWithProductDetails()->plan->features;
        $projectLimit = $currentPlanFeatures[PlanFeatureEnum::NO_OF_PROJECTS->value];
        $chartLimit = $currentPlanFeatures[PlanFeatureEnum::NO_OF_CHARTS->value];
        $teamMembersLimit = $currentPlanFeatures[PlanFeatureEnum::NO_OF_TEAM_MEMBERS->value];

        if ($projectLimit !== -1) {
            $totalProjectsCount = GetProjects::handle()->where('status', ProjectStatus::ACTIVE)->count();
            if ($totalProjectsCount > $projectLimit) {
                $excessProjectCount = $totalProjectsCount - $projectLimit;

                $excessActiveProjectQuery = GetProjects::handle()
                    ->with(['charts' => fn($q) => $q->where('status', ChartStatus::ACTIVE)])
                    ->where('status', ProjectStatus::ACTIVE)
                    ->limit($excessProjectCount)
                    ->latest();

                $excessActiveProjectQuery->update([
                    'status' => ProjectStatus::INACTIVE,
                ]);

                if ($chartLimit !== -1) {
                    $excessActiveProjects = $excessActiveProjectQuery->get();
                    $totalActiveChartsInExcessProjects = $excessActiveProjects->sum('charts');
                    $totalActiveChartsInOtherProjects = GetChartQuery::handle()
                        ->where('status', ChartStatus::ACTIVE)
                        ->whereNotIn('project_id', $excessActiveProjects->pluck('id'))
                        ->count();
                    if ($totalActiveChartsInExcessProjects > $chartLimit) {
                        $excessChartCount = $totalActiveChartsInExcessProjects - $chartLimit;
                        for ($i = 0; $i < $excessChartCount; $i++) {
                            $excessActiveProjectQuery->each(function ($project) use ($excessChartCount) {
                                $project->charts->limit($excessChartCount)->each(function ($chart) {
                                    $chart->status = ChartStatus::INACTIVE;
                                    $chart->save();
                                });
                            });
                        }
                    } elseif ($totalActiveChartsInOtherProjects > $chartLimit) {
                        $excessChartCount = $totalActiveChartsInOtherProjects - $chartLimit;
                    }
                }
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
