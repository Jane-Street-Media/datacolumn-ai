<?php

namespace App\Actions;

use App\Models\Plan;
use App\Models\Team;
use App\Models\User;

class GetSubscriptionPlanWithFeatures
{
    public static function handle(User $user): array
    {
        $subscription = $user->currentTeam->subscriptionWithProductDetails();


        if (! $subscription) {
            return [
                'features' => [
                    'no_of_folders' => 3,
                    'no_of_projects' => 3,
                    'no_of_invitation' => 3,
                ],
            ];
        }

        $plan = Plan::where('chargebee_id', $subscription->items[0]->chargebee_price)->first();
        return [
            'name' => $plan->name ?? Plan::FREE_PLAN,
            'features' => $plan->features,
        ];
    }
}
