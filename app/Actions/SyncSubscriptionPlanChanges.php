<?php

namespace App\Actions;

use App\Actions\Project\GetProjects;
use App\Actions\Queries\Dashboard\GetChartQuery;
use App\Enums\ChartStatus;
use App\Enums\PlanFeatureEnum;
use App\Enums\ProjectStatus;
use App\Enums\TeamUserStatus;
use App\Models\TeamInvitation;
use App\Models\TeamUser;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class SyncSubscriptionPlanChanges
{
    public static function handle(User $user): void
    {
        $currentPlanFeatures = $user->currentTeam->subscriptionWithProductDetails()->plan->features;
        $projectLimit = $currentPlanFeatures[PlanFeatureEnum::NO_OF_PROJECTS->value];
        $chartLimit = $currentPlanFeatures[PlanFeatureEnum::NO_OF_CHARTS->value];
        $teamMembersLimit = $currentPlanFeatures[PlanFeatureEnum::NO_OF_TEAM_MEMBERS->value];

        DB::transaction(function () use ($user, $projectLimit, $chartLimit, $teamMembersLimit) {
            // Enforce subscription limits:
            // 1. Fetch active projects; if count exceeds project limit, deactivate oldest excess projects.
            // 2. If chart limit is set:
            //    a. Within deactivated projects, deactivate oldest excess charts over chart limit.
            //    b. Then for all remaining active charts, deactivate oldest until within chart limit.
            $projectsQuery = GetProjects::handle()->notInActive()->where('team_id', $user->currentTeam->id);
            $totalActiveProjectsCount = $projectsQuery->count();

            if ($projectLimit !== -1 && $totalActiveProjectsCount > $projectLimit) {
                $excessActiveProjectCount = $totalActiveProjectsCount - $projectLimit;
                $excessProjectsQuery = $projectsQuery->latest()->limit($excessActiveProjectCount);
                $excessProjectIds = $excessProjectsQuery->pluck('id')->toArray();
                $excessProjectsQuery->update([
                    'status' => ProjectStatus::INACTIVE,
                ]);

                if ($chartLimit !== -1) {
                    $chartsQuery = GetChartQuery::handle()->active()->where('team_id', $user->currentTeam->id);

                    $excessChartsCount = $chartsQuery
                        ->whereIn('project_id', $excessProjectIds)
                        ->count();

                    if ($excessChartsCount > $chartLimit) {
                        $excessChartsToDeactivate = $excessChartsCount - $chartLimit;
                        $chartsQuery
                            ->whereIn('project_id', $excessProjectIds)
                            ->latest()
                            ->limit($excessChartsToDeactivate)
                            ->update([
                                'status' => ChartStatus::INACTIVE,
                            ]);
                    }
                }
            }

            if ($chartLimit !== -1) {
                $chartsQuery = GetChartQuery::handle()->active()->where('team_id', $user->currentTeam->id);
                $remainingChartsCount = $chartsQuery->count();
                if ($remainingChartsCount > $chartLimit) {
                    $remainingExcessChartsCount = $remainingChartsCount - $chartLimit;
                    $chartsQuery
                        ->latest()
                        ->limit($remainingExcessChartsCount)
                        ->update([
                            'status' => ChartStatus::INACTIVE,
                        ]);
                }
            }

            if ($teamMembersLimit !== -1) {
                $team = $user->currentTeam;
                $invitationsCount = $team->invitations()->count();
                $usersCount = $team->users()->count();
                $totalCount = $invitationsCount + $usersCount;

                if ($totalCount > $teamMembersLimit) {
                    $excess = $totalCount - $teamMembersLimit;
                    $deletedInvitations = TeamInvitation::query()
                        ->where('team_id', $team->id)
                        ->oldest('created_at')
                        ->limit($excess)
                        ->delete();

                    $remainingExcess = $excess - $deletedInvitations;

                    if ($remainingExcess > 0) {
                        $userIdsToRemove = $team->users()
                            ->where('user_id', '!=', $user->id) // Exclude the current user
                            ->orderBy('team_user.created_at')
                            ->limit($remainingExcess)
                            ->pluck('users.id')
                            ->toArray();

                        TeamUser::query()->where('team_id', $team->id)
                            ->whereIn('user_id', $userIdsToRemove)
                            ->where('status', TeamUserStatus::ACTIVE)
                            ->update([
                                'status' => TeamUserStatus::INACTIVE,
                            ]);
                    }
                }
            }
        });
    }
}
