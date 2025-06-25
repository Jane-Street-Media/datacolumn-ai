<?php

namespace App\Models;

use App\Enums\ActivityEvents;
use App\Models\Scopes\TeamScope;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;
use Spatie\Activitylog\Models\Activity;

class ActivityLog extends Activity
{
    protected $appends = ['icon_name', 'icon_class', 'icon_background_class'];

    protected static function booted(): void
    {
        static::addGlobalScope(new TeamScope);
        static::creating(function (ActivityLog $activity) {
            $activity->team_id = Auth::user()?->current_team_id;
        });

    }

    public function iconName(): Attribute
    {
        return Attribute::make(
            get: fn() => ActivityEvents::tryFrom($this->event)?->getIcon()
        );
    }

    public function iconClass(): Attribute
    {
        return Attribute::make(
            get: fn() => ActivityEvents::tryFrom($this->event)?->getIconClasses()
        );
    }

    public function iconBackgroundClass(): Attribute
    {
        return Attribute::make(
            get: fn() => ActivityEvents::tryFrom($this->event)?->getIconBackgroundClasses()
        );
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }
}
