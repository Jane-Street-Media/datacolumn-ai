<?php

namespace App\Actions\PlanLimitations;

use App\Models\Plan;
use App\Models\Team;

class GetSubscribedPlanFeatures
{
    public static function handle(Team $team)
    {
        $subscription = $team->subscriptionWithProductDetails();

        if (! $subscription) {
            return [
                'no_of_folders' => Plan::FREE_PLAN_NO_OF_FOLDERS,
                'no_of_projects' => Plan::FREE_PLAN_NO_OF_PROJECTS,
                'no_of_invitations' => Plan::FREE_PLAN_NO_OF_INVITATIONS,
            ];
        }

        return Plan::where('chargebee_id', $subscription->chargebee_price)->first()->features;
    }
}
