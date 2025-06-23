<?php

namespace App\Listeners;

use Chargebee\Cashier\Cashier;
use Illuminate\Support\Facades\Log;

class HandleWebhookReceived extends \Chargebee\Cashier\Listeners\HandleWebhookReceived
{
    protected function handleSubscriptionPaused(array $payload): void
    {
        if ($user = Cashier::findBillable($payload['content']['subscription']['customer_id'])) {
            $status = $payload['content']['subscription']['status'];
            $subscription = $user->subscriptions()->where('chargebee_id', $payload['content']['subscription']['id'])->first();
            $subscription->update([
                'chargebee_status' => $status,
            ]);

            Log::info('Subscription paused successfully.', [
                'subscription_id' => $subscription->id,
                'chargebee_subscription_id' => $payload['content']['subscription']['id'],
            ]);
        } else {
            Log::info('Subscription paused attempted, but no matching user found.', [
                'customer_id' => $payload['content']['subscription']['customer_id'],
            ]);
        }
    }
}
