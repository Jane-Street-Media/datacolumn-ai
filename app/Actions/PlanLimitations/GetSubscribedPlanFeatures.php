<?php

namespace App\Actions\PlanLimitations;

use App\Enums\PlanFeatureEnum;
use App\Models\Plan;
use App\Models\Team;

class GetSubscribedPlanFeatures
{
    public static function handle(Team $team)
    {
        $subscription = $team->subscriptionWithProductDetails();

        if (!$subscription) {
            return [
                PlanFeatureEnum::NO_OF_PROJECTS->value => Plan::FREE_PLAN_NO_OF_PROJECTS,
                PlanFeatureEnum::NO_OF_INVITATIONS->value => Plan::FREE_PLAN_NO_OF_INVITATIONS,
            ];
        }

        return Plan::where('chargebee_id', $subscription->chargebee_price)->first()->features;
    }
}
