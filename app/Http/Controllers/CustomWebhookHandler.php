<?php

namespace App\Http\Controllers;

use App\Actions\Notifications\SendNotification;
use App\Actions\SyncSubscriptionPlanChanges;
use App\Enums\NotificationType;
use App\Helpers\SubscriptionLockHelper;
use App\Models\Plan;
use App\Models\User;
use Carbon\Carbon;
use Chargebee\Cashier\Cashier;
use Chargebee\Cashier\Listeners\HandleWebhookReceived;
use Illuminate\Support\Facades\Log;
use PHPUnit\Exception;

class CustomWebhookHandler extends HandleWebhookReceived
{
    protected function updateOrCreateSubscriptionFromPayload($user, array $data)
    {
        $firstItem = $data['subscription_items'][0];
        $isSinglePrice = count($data['subscription_items']) === 1;

        $trialEndsAt = isset($data['trial_end']) ? Carbon::createFromTimestamp($data['trial_end']) : null;
        $endsAt = isset($data['cancelled_at']) ? Carbon::createFromTimestamp($data['cancelled_at']) : null;
        $nextBillingCycle = isset($data['next_billing_at']) ? Carbon::createFromTimestamp($data['next_billing_at']) : null;

        $subscription = $user->subscriptions()->updateOrCreate(
            ['chargebee_id' => $data['id']],
            [
                'type' => $data['meta_data']['type'] ?? $data['meta_data']['name'] ?? $this->newSubscriptionType($data),
                'chargebee_status' => $data['status'],
                'chargebee_price' => $isSinglePrice ? $firstItem['item_price_id'] : null,
                'quantity' => $isSinglePrice && isset($firstItem['quantity']) ? $firstItem['quantity'] : null,
                'trial_ends_at' => $trialEndsAt,
                'ends_at' => $endsAt,
                'next_billing_at' => $nextBillingCycle,
            ]
        );

        $subscriptionItemPriceIds = [];
        $chargebee = Cashier::chargebee();
        foreach ($data['subscription_items'] as $item) {
            $subscriptionItemPriceIds[] = $item['item_price_id'];

            $subscription->items()->updateOrCreate(
                ['chargebee_price' => $item['item_price_id']],
                [
                    'chargebee_product' => $chargebee->itemPrice()->retrieve($item['item_price_id'])->item_price->item_id,
                    'quantity' => $item['quantity'] ?? null,
                ]
            );
        }

        $subscription->items()->whereNotIn('chargebee_price', $subscriptionItemPriceIds)->delete();

        return $subscription;
    }

    protected function updateOrCreateItemPrice(array $itemPrice): void
    {
        if (empty($itemPrice['price']) || $itemPrice['price'] === 0) {
            return;
        }
        if ($itemPrice['item_type'] !== 'plan') {
            return;
        }
        if (! in_array($itemPrice['period_unit'], ['month', 'year'], true)) {
            return;
        }

        Plan::updateOrCreate(
            ['chargebee_id' => $itemPrice['id']], // Fixed missing closing bracket
            [
                'display_name' => $itemPrice['external_name'] ?? $itemPrice['name'],
                'price' => $itemPrice['price'],
                'chargebee_product' => $itemPrice['item_id'],
                'frequency' => $itemPrice['period_unit'],
                'currency' => $itemPrice['currency_code'],
                'quantity' => 1,
            ]
        );
    }

    /**
     * handles item_price_created event
     */
    protected function handleItemPriceCreated(array $payload): void
    {
        try {
            $itemPrice = $payload['content']['item_price'];
            $this->updateOrCreateItemPrice($itemPrice);
            Log::info('ItemPrice created successfully.', [
                'item_price_id' => $itemPrice['id'],
            ]);
        } catch (Exception $ex) {
            Log::info('Exception while handling item_price_created webhook from chargebee', [
                'message' => $ex->getMessage(),
            ]);
        }
    }

    /**
     * handles item_price_updated event
     */
    protected function handleItemPriceUpdated(array $payload): void
    {
        try {
            $itemPrice = $payload['content']['item_price'];
            $this->updateOrCreateItemPrice($itemPrice);
            Log::info('ItemPrice updated successfully.', [
                'item_price_id' => $itemPrice->id,
            ]);
        } catch (Exception $ex) {
            Log::info('Exception while handling item_price_updated webhook from Chargebee', [
                'message' => $ex->getMessage(),
            ]);
        }
    }

    protected function handleSubscriptionCreated(array $payload): void
    {
        parent::handleSubscriptionCreated($payload);
        $team = Cashier::findBillable($payload['content']['subscription']['customer_id']);
        if ($team && $team->user_id) {
            $user = User::find($team->user_id);
            $newPlan = $user->currentTeam->subscriptionWithProductDetails()->plan->display_name;
            $oldPlan = Plan::query()->where('chargebee_id', 'free-monthly')->first()?->display_name ?? 'Free';
            SendNotification::handle($user, NotificationType::UPGRADE, $oldPlan, $newPlan);
            SubscriptionLockHelper::unlock($team->user_id);
        }
    }

    protected function handleSubscriptionCancellationScheduled(array $payload): void
    {
        if ($team = Cashier::findBillable($payload['content']['subscription']['customer_id'])) {
            $payloadSubscription = $payload['content']['subscription'];
            $currentTermEnd = null;
            $trialEnd = null;

            if (array_key_exists('trial_end', $payloadSubscription) && !is_null($payloadSubscription['trial_end'])) {
                $trialEnd = $payload['content']['subscription']['trial_end'];
            }

            if (array_key_exists('current_term_end', $payloadSubscription) && !is_null($payloadSubscription['current_term_end'])) {
                $currentTermEnd = $payload['content']['subscription']['current_term_end'];
            }

            $status = $payload['content']['subscription']['status'];
            $subscription = $team->subscriptions()->where('chargebee_id', $payload['content']['subscription']['id'])->first();
            $subscription->update([
                'chargebee_status' => $status,
                'ends_at' => Carbon::createFromTimestamp($currentTermEnd ?? $trialEnd),
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
                'trial_ends_at' => null,
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
