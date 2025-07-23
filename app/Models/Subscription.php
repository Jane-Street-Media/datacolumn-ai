<?php

namespace App\Models;

use Chargebee\Cashier\Cashier;
use LogicException;

class Subscription extends \Chargebee\Cashier\Subscription
{
    protected $casts = [
        'billing_cycle_anchor' => 'datetime',
        'ends_at' => 'datetime',
        'trial_ends_at' => 'datetime',
    ];

    public function resumeCancelScheduled(): self
    {
        if ($this->active()) {
            throw new LogicException('Your subscription is already resumed.');
        }
        $chargebee = Cashier::chargebee();
        $chargebeeSubscription = $chargebee->subscription()->reactivate($this->chargebee_id)->subscription;

        $this->fill([
            'chargebee_status' => $chargebeeSubscription->status->value,
            'ends_at' => null,
        ])->save();

        return $this;
    }
}
