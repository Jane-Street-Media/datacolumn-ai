<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Chargebee\Cashier\Billable;
use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements MustVerifyEmail
{
    use Billable;

    /** @use HasFactory<UserFactory> */
    use HasFactory, HasRoles, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'current_team_id',
        'name',
        'email',
        'password',
        'provider_id',
        'provider_name',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function teams(): BelongsToMany
    {
        return $this->belongsToMany(Team::class)->withTimestamps();
    }

    public function sentTeamInvitations(): HasMany
    {
        return $this->hasMany(TeamInvitation::class, 'invited_by_id');
    }

    public function receivedTeamInvitations(): HasMany
    {
        return $this->hasMany(TeamInvitation::class, 'email', 'email');
    }

    public function subsriptionWithProductDetails()
    {
        $subscriptionDetails = $this->subscription('default');
        if (! $subscriptionDetails) {
            return null;
        }
        foreach ($subscriptionDetails->items as $item) {
            $chargebeeProductId = $item->chargebee_product;
            $plan = \App\Models\Plan::where('chargebee_product', $chargebeeProductId)->first();
            $item->plan_name = $plan->display_name ?? null;
        }
        $subscriptionDetails->currency = $plan->currency ?? null;

        return $subscriptionDetails;
    }
}
