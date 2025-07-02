<?php

namespace App\Models;

use App\Enums\SubscriptionStatus;
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
        return $this->belongsToMany(User::class)->withTimestamps()->withPivot('status');
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

    public function charts(): HasMany
    {
        return $this->hasMany(Chart::class);
    }

    public function subscriptionWithProductDetails(): ?\Chargebee\Cashier\Subscription
    {
        if ($this->subscribed()) {
            $subscription = $this->subscriptions()->first();
            $subscription->setRelation('plan', Plan::where('chargebee_id', $subscription->chargebee_price)->first());

            return $subscription;
        }

        return null;
    }

    public function isOnFreePlan(): bool
    {
        return $this->subscriptionWithProductDetails()?->chargebee_status === SubscriptionStatus::CANCELLED->value;
    }

    public function freePlan(): ?Plan
    {
        return Plan::query()->where('chargebee_id', 'free-monthly')->first();
    }
}
