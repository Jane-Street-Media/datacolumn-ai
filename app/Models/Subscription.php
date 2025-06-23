<?php

namespace App\Models;

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
        $chargebee->subscription()->pause($this->chargebee_id)->subscription;

        return $this;
    }
}
