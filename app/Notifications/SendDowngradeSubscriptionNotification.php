<?php

namespace App\Notifications;

use App\Enums\NotificationType;
use App\Traits\MessageFormatter;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Notifications\Notification;

class SendDowngradeSubscriptionNotification extends Notification
{
    use Queueable, MessageFormatter;

    public function __construct(public NotificationType $type, public string $oldPlan, public string $newPlan)
    {
        //
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): Mailable
    {
        $user = $notifiable;
        $type = $this->type;
        $notificationTemplate = $type->getNotificationTemplate();
        $text = $this->refineMessage($notificationTemplate->message, [
            'user_name' => $user->name,
            'team_name' => $user->currentTeam->name,
            'old_plan' => $this->oldPlan,
            'new_plan' => $this->newPlan
        ]);
        return $type->getNotificationEmail()
            ->with(['text' => $text])
            ->subject($notificationTemplate->subject)
            ->to($user->email);
    }

    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
