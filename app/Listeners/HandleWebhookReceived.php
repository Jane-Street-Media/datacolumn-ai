<?php

namespace App\Listeners;

use App\Actions\Notifications\SendNotification;
use App\Enums\NotificationType;
use App\Actions\SyncSubscriptionPlanChanges;
use App\Helpers\SubscriptionLockHelper;
use App\Models\User;
use Carbon\Carbon;
use Chargebee\Cashier\Cashier;
use Illuminate\Support\Facades\Log;

class HandleWebhookReceived extends \Chargebee\Cashier\Listeners\HandleWebhookReceived
{
    protected function handleSubscriptionCreated(array $payload): void
    {
        parent::handleSubscriptionCreated($payload);
        $team = Cashier::findBillable($payload['content']['subscription']['customer_id']);
        if ($team && $team->user_id) {
            $user = User::find($team->user_id);
            Log::info('subscription is created for the user', ['user_id' => $team->user_id]);
            SendNotification::handle($user, NotificationType::WELCOME);
            SubscriptionLockHelper::unlock($team->user_id);
        }
    }

    protected function handleSubscriptionCancellationScheduled(array $payload): void
    {
        if ($team = Cashier::findBillable($payload['content']['subscription']['customer_id'])) {
            $currentTermEnd = $payload['content']['subscription']['current_term_end'];
            $status = $payload['content']['subscription']['status'];
            $subscription = $team->subscriptions()->where(
                'chargebee_id',
                $payload['content']['subscription']['id']
            )->first();
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
            $subscription = $team->subscriptions()->where(
                'chargebee_id',
                $payload['content']['subscription']['id']
            )->first();
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
            $subscription = $team->subscriptions()->where(
                'chargebee_id',
                $payload['content']['subscription']['id']
            )->first();
            $subscription->update([
                'chargebee_status' => $status,
                'ends_at' => Carbon::now(),
            ]);

            SyncSubscriptionPlanChanges::handle($team);

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
