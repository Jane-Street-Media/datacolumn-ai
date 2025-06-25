<?php

namespace App\Actions\PlanLimitations;

use App\Enums\PlanFeatureEnum;
use App\Exceptions\PackageLimitExceededException;
use App\Models\Team;

class EnsurePlanLimitNotExceeded
{
    /**
     * @throws PackageLimitExceededException
     */
    public static function handle(Team $team, PlanFeatureEnum $feature): int
    {
        $features = GetSubscribedPlanFeatures::handle($team);
        $packageFeatureLimit = $feature->getFeatureUsageCount($team);
        if ($packageFeatureLimit >= $features[$feature->value]) {
            throw new PackageLimitExceededException($feature->featureErrorMessage());
        }
        return $packageFeatureLimit;
    }
}
