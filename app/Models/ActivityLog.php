<?php

namespace App\Models;

use App\Enums\ActivityEvents;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Spatie\Activitylog\Models\Activity;

class ActivityLog extends Activity
{
    protected $appends = ['icon_name', 'icon_class'];
    public function iconName(): Attribute
    {
        return Attribute::make(
            get: fn () => ActivityEvents::tryFrom($this->event)?->getIcon()
        );
    }

    public function iconClass(): Attribute
    {
        return Attribute::make(
            get: fn () => ActivityEvents::tryFrom($this->event)?->getIconClasses()
        );
    }
}
