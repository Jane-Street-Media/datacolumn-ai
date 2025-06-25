<?php

namespace App\Enums;

use App\Models\Team;

enum PlanFeatureEnum: string
{
    case NO_OF_PROJECTS = 'no_of_projects';
    case NO_OF_INVITATIONS = 'no_of_invitations';


    public function getFeatureUsageCount(Team $team): int
    {
        return match ($this) {
            self::NO_OF_PROJECTS => $team->projects()->count(),
            self::NO_OF_INVITATIONS => $team->users()->count() + $team->invitations()->count(),
        };
    }

    public function featureErrorMessage(): string
    {
        return match ($this) {
            self::NO_OF_PROJECTS => 'You have reached the maximum number of projects allowed by your plan.',
            self::NO_OF_INVITATIONS => 'You have reached the maximum number of invitations allowed by your plan.',
        };
    }
}
