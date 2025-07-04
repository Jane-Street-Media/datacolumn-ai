<?php

namespace App\Actions\PlanLimitations;

use App\Enums\PlanFeatureEnum;
use App\Models\Plan;
use App\Models\Team;

class GetSubscribedPlanFeatures
{
    public static function handle(Team $team): ?array
    {
        return $team->subscriptionWithProductDetails()?->plan?->features;
    }
}
