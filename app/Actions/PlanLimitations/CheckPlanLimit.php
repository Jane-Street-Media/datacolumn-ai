<?php

namespace App\Actions\PlanLimitations;

use App\Enums\PlanFeatureEnum;
use App\Exceptions\PackageLimitExceededException;
use App\Models\Team;

class CheckPlanLimit
{
    /**
     * @throws PackageLimitExceededException
     */
    public static function handle(Team $team, PlanFeatureEnum $feature): void
    {
        $features = GetSubscribedPlanFeatures::handle($team);
        $packageLimit = match ($feature->value) {
            'no_of_projects' => $team->projects()->count(),
            'no_of_invitations' => $team->users()->count() + $team->invitations()->count(),
        };

        if ($packageLimit >= $features[$feature->value]) {
            $message = match ($feature->value) {
                'no_of_projects' => 'You have reached the maximum number of projects allowed by your plan.',
                'no_of_invitations' => 'You have reached the maximum number of invitations allowed by your plan.',
                default => 'You have reached a limit in your subscription plan.'
            };
            throw new PackageLimitExceededException($message);
        }
    }
}
