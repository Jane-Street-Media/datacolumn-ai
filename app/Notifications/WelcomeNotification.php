<?php

namespace App\Notifications;

use App\Enums\NotificationType;
use App\Traits\MessageFormatter;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Notifications\Notification;

class WelcomeNotification extends Notification
{
    use Queueable, MessageFormatter;

    public function __construct(public NotificationType $type)
    {
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
            'app_name' => config('app.name')
        ]);
        $subject = $this->refineMessage($notificationTemplate->subject, [
            'user_name' => $user->name,
            'app_name' => config('app.name')
        ]);
        return $type->getNotificationEmail()
            ->with(['text' => $text])
            ->subject($subject)
            ->to($user->email);
    }

    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
