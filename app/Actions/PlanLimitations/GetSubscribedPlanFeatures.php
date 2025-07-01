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

        if (! $subscription) {
            return Plan::where('chargebee_id', 'free-monthly')->first()->features;
        }

        return Plan::where('chargebee_id', $subscription->chargebee_price)->first()->features;
    }
}
