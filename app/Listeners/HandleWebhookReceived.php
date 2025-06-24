<?php

namespace App\Listeners;

use App\Helpers\SubscriptionLockHelper;
use Carbon\Carbon;
use Chargebee\Cashier\Cashier;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class HandleWebhookReceived extends \Chargebee\Cashier\Listeners\HandleWebhookReceived
{
    protected function handleSubscriptionCreated(array $payload): void
    {
        parent::handleSubscriptionCreated($payload);
        SubscriptionLockHelper::unlock(Auth::user()?->id);
    }
    protected function handleSubscriptionPaused(array $payload): void
    {
        if ($team = Cashier::findBillable($payload['content']['subscription']['customer_id'])) {
            $status = $payload['content']['subscription']['status'];
            $subscription = $team->subscriptions()->where('chargebee_id', $payload['content']['subscription']['id'])->first();
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

    protected function handleSubscriptionPauseScheduled(array $payload): void
    {
        if ($team = Cashier::findBillable($payload['content']['subscription']['customer_id'])) {
            $endsAt = $payload['content']['subscription']['pause_date'];
            $subscription = $team->subscriptions()->where('chargebee_id', $payload['content']['subscription']['id'])->first();
            $subscription->update([
                'ends_at' => Carbon::createFromTimestamp($endsAt),
            ]);

            Log::info('Subscription pause scheduled successfully.', [
                'subscription_id' => $subscription->id,
                'chargebee_subscription_id' => $payload['content']['subscription']['id'],
            ]);
        } else {
            Log::info('Subscription pause scheduled attempted, but no matching user found.', [
                'customer_id' => $payload['content']['subscription']['customer_id'],
            ]);
        }
    }

    protected function handleSubscriptionScheduledPauseRemoved(array $payload): void
    {
        if ($team = Cashier::findBillable($payload['content']['subscription']['customer_id'])) {
            $subscription = $team->subscriptions()->where('chargebee_id', $payload['content']['subscription']['id'])->first();
            $subscription->update([
                'ends_at' => null,
            ]);

            Log::info('Subscription pause scheduled successfully.', [
                'subscription_id' => $subscription->id,
                'chargebee_subscription_id' => $payload['content']['subscription']['id'],
            ]);
        } else {
            Log::info('Subscription pause scheduled attempted, but no matching user found.', [
                'customer_id' => $payload['content']['subscription']['customer_id'],
            ]);
        }
    }
}
