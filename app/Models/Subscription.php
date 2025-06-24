<?php

namespace App\Models;

use Carbon\Carbon;
use Chargebee\Cashier\Cashier;
use LogicException;

class Subscription extends \Chargebee\Cashier\Subscription
{
    protected $casts = [
        'billing_cycle_anchor' => 'datetime',
    ];

    // TODO: We added a new pause function in cashier subscription, in future updates, when cashier will implement this function from cahargebee, we will remove this function.
    public function pause(): self
    {
        if ($this->canceled() || ! $this->active()) {
            throw new LogicException('Only active subscriptions can be paused.');
        }
        $chargebee = Cashier::chargebee();
        $chargebeeSubscription = $chargebee->subscription()->pause($this->chargebee_id)->subscription;


        $this->fill([
            'chargebee_status' => $chargebeeSubscription->status->value,
            'ends_at' => Carbon::createFromTimestamp($chargebeeSubscription->pause_date)
        ])->save();

        return $this;
    }

    public function resumePauseScheduled(): self
    {
        if (is_null($this->ends_at)) {
            throw new LogicException('Only pause scheduled subscriptions can be resumed.');
        }
        $chargebee = Cashier::chargebee();
        $chargebeeSubscription = $chargebee->subscription()->removeScheduledPause($this->chargebee_id)->subscription;

        $this->fill([
            'chargebee_status' => $chargebeeSubscription->status->value,
            'ends_at' => null
        ])->save();

        return $this;
    }
}
