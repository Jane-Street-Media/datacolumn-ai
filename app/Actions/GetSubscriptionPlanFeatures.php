<?php

namespace App\Actions;

use App\Models\Plan;
use App\Models\User;

class GetSubscriptionPlanFeatures
{
    public static function handle(User $user)
    {
        $subscription = $user->currentTeam->subscriptionWithProductDetails();

        if (! $subscription) {
            return [
                    'no_of_folders' => 3,
                    'no_of_projects' => 3,
                    'no_of_invitation' => 3,
            ];
        }

        return Plan::where('chargebee_id', $subscription->items[0]->chargebee_price)->first()->features;
    }
}
