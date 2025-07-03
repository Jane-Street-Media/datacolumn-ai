<?php

namespace App\Actions\PlanLimitations;

use App\Enums\PlanFeatureEnum;
use App\Exceptions\PackageLimitExceededException;
use App\Models\Chart;
use App\Models\Team;

class EnsurePlanLimitNotExceeded
{
    /**
     * @throws PackageLimitExceededException
     */
    public static function handle(Team $team, PlanFeatureEnum $feature): int
    {
        $features = GetSubscribedPlanFeatures::handle($team);
        $featureUsageCount = $feature->getFeatureUsageCount($team);

        if (!isset($features[$feature->value])) {
            throw new PackageLimitExceededException('You current package does not support this feature.');
        }

        if ( $features[$feature->value] === -1) {
            return $featureUsageCount; // Unlimited feature, no limit check needed
        }

        if ($featureUsageCount >= ($features[$feature->value])) {
            throw new PackageLimitExceededException($feature->featureErrorMessage());
        }

        return $featureUsageCount;
    }
}
