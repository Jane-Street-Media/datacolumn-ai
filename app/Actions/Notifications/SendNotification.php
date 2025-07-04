<?php

namespace App\Actions\Notifications;

use App\Enums\NotificationType;

class SendNotification
{

    public function handle(NotificationType $type, string $oldPlan = null, string $newPlan = null): void
    {
        $user = auth()->user();
        $user->notify($type->getNotification($oldPlan, $newPlan));
    }
}