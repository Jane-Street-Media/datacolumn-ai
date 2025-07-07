<?php

namespace App\Actions\Notifications;

use App\Enums\NotificationType;
use App\Models\User;

class SendNotification
{

    public static function handle(User $user, NotificationType $type, string $oldPlan = null, string $newPlan = null): void
    {
        $user->notify($type->getNotification($oldPlan, $newPlan));
    }
}