<?php

namespace App\Models;

use Chargebee\Cashier\Billable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Team extends Model
{
    use Billable, HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'personal_team',
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)->withTimestamps();
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function invitations(): HasMany
    {
        return $this->hasMany(TeamInvitation::class);
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    public function subscriptionWithProductDetails(): ?\Chargebee\Cashier\Subscription
    {
        $subscriptionDetails = $this->subscriptions()->latest()->first();
        if (! $subscriptionDetails) {
            return null;
        }
        foreach ($subscriptionDetails->items as $item) {
            $chargebeeProductId = $item->chargebee_product;
            $plan = Plan::where('chargebee_product', $chargebeeProductId)->first();
            $item->plan_name = $plan->display_name ?? null;
        }
        $subscriptionDetails->currency = $plan->currency ?? null;

        return $subscriptionDetails;
    }
}
