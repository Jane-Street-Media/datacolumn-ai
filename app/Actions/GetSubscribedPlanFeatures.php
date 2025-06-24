<?php

namespace App\Actions;

use App\Models\Plan;
use App\Models\User;

class GetSubscribedPlanFeatures
{
    public static function handle(User $user)
    {
        $subscription = $user->currentTeam->subscriptionWithProductDetails();

        if (! $subscription) {
            return [
                'no_of_folders' => Plan::FREE_PLAN_NO_OF_FOLDERS,
                'no_of_projects' => Plan::FREE_PLAN_NO_OF_PROJECTS,
                'no_of_invitation' => Plan::FREE_PLAN_NO_OF_INVITATIONS,
            ];
        }

        return Plan::where('chargebee_id', $subscription->chargebee_price)->first()->features;
    }
}
