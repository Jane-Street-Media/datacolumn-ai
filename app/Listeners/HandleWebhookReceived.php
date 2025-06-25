<?php

namespace App\Listeners;

use App\Helpers\SubscriptionLockHelper;
use Carbon\Carbon;
use Chargebee\Cashier\Cashier;
use Illuminate\Support\Facades\Log;

class HandleWebhookReceived extends \Chargebee\Cashier\Listeners\HandleWebhookReceived
{
    protected function handleSubscriptionCreated(array $payload): void
    {
        parent::handleSubscriptionCreated($payload);
        $team = Cashier::findBillable($payload['content']['subscription']['customer_id']);
        SubscriptionLockHelper::unlock($team->user_id);
    }

    protected function handleSubscriptionCancellationScheduled(array $payload): void
    {
        if ($team = Cashier::findBillable($payload['content']['subscription']['customer_id'])) {
            $currentTermEnd = $payload['content']['subscription']['current_term_end'];
            $status = $payload['content']['subscription']['status'];
            $subscription = $team->subscriptions()->where('chargebee_id', $payload['content']['subscription']['id'])->first();
            $subscription->update([
                'chargebee_status' => $status,
                'ends_at' => Carbon::createFromTimestamp($currentTermEnd),
            ]);

            Log::info('Subscription cancel scheduled successfully.', [
                'subscription_id' => $subscription->id,
                'chargebee_subscription_id' => $payload['content']['subscription']['id'],
            ]);
        } else {
            Log::info('Subscription cancel scheduled attempted, but no matching user found.', [
                'customer_id' => $payload['content']['subscription']['customer_id'],
            ]);
        }
    }

    protected function handleSubscriptionScheduledCancellationRemoved(array $payload): void
    {
        if ($team = Cashier::findBillable($payload['content']['subscription']['customer_id'])) {
            $status = $payload['content']['subscription']['status'];
            $subscription = $team->subscriptions()->where('chargebee_id', $payload['content']['subscription']['id'])->first();
            $subscription->update([
                'chargebee_status' => $status,
                'ends_at' => null,
            ]);

            Log::info('Subscription cancel scheduled removed successfully.', [
                'subscription_id' => $subscription->id,
                'chargebee_subscription_id' => $payload['content']['subscription']['id'],
            ]);
        } else {
            Log::info('Subscription cancel scheduled removed attempted, but no matching user found.', [
                'customer_id' => $payload['content']['subscription']['customer_id'],
            ]);
        }
    }

    protected function handleSubscriptionCancelled(array $payload): void
    {
        if ($team = Cashier::findBillable($payload['content']['subscription']['customer_id'])) {
            $status = $payload['content']['subscription']['status'];
            $subscription = $team->subscriptions()->where('chargebee_id', $payload['content']['subscription']['id'])->first();
            $subscription->update([
                'chargebee_status' => $status,
                'ends_at' => Carbon::now(),
            ]);

            Log::info('Subscription cancelled successfully.', [
                'subscription_id' => $subscription->id,
                'chargebee_subscription_id' => $payload['content']['subscription']['id'],
            ]);
        } else {
            Log::info('Subscription cancelled attempted, but no matching user found.', [
                'customer_id' => $payload['content']['subscription']['customer_id'],
            ]);
        }
    }
}
