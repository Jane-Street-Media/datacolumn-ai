<?php

namespace App\Enums;

use App\Enums\Traits\EnumToArray;
use App\Mail\InvitationSent;
use App\Mail\WelcomeMail;
use App\Mail\SubscriptionPlanUpgradeMail;
use App\Mail\SubscriptionPlanDowngradeMail;
use App\Models\NotificationTemplate;
use App\Notifications\SendDowngradeSubscriptionNotification;
use App\Notifications\SendUpgradeSubscriptionNotification;
use App\Notifications\WelcomeNotification;
use Filament\Support\Colors\Color;
use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasIcon;
use Filament\Support\Contracts\HasLabel;
use Illuminate\Mail\Mailable;
use Illuminate\Notifications\Notification;

enum NotificationType: string implements HasColor, HasIcon, HasLabel
{
    use EnumToArray;

    case UPGRADE = 'upgrade';
    case DOWNGRADE = 'downgrade';
    case WELCOME = 'welcome';
    case INVITATION = 'invitation';

    public function getLabel(): ?string
    {
        return match ($this) {
            self::WELCOME => 'Welcome',
            self::UPGRADE => 'Upgrade',
            self::DOWNGRADE => 'Downgrade',
            self::INVITATION => 'Invitation'
        };
    }

    public function getColor(): string|array|null
    {
        return match ($this) {
            self::WELCOME => Color::Amber,
            self::DOWNGRADE => Color::Red,
            self::UPGRADE => Color::Green,
            self::INVITATION => Color::Blue
        };
    }

    public function getIcon(): string
    {
        return match ($this) {
            self::WELCOME => 'heroicon-o-trophy',
            self::DOWNGRADE => 'heroicon-o-arrow-trending-down',
            self::UPGRADE => 'heroicon-o-arrow-trending-up',
            self::INVITATION => 'heroicon-o-trophy'
        };
    }

    public function getNotificationTemplate(): NotificationTemplate
    {
        return match ($this) {
            self::WELCOME => NotificationTemplate::query()->where('type', self::WELCOME)->first(),
            self::DOWNGRADE => NotificationTemplate::query()->where('type', self::DOWNGRADE)->first(),
            self::UPGRADE => NotificationTemplate::query()->where('type', self::UPGRADE)->first(),
            self::INVITATION => NotificationTemplate::query()->where('type', self::INVITATION)->first(),
        };
    }

    public function getNotificationEmail(): Mailable
    {
        return match ($this) {
            self::WELCOME => new WelcomeMail,
            self::DOWNGRADE => new SubscriptionPlanDowngradeMail,
            self::UPGRADE => new SubscriptionPlanUpgradeMail,
        };
    }
    public function getNotification(string $oldPlan = null, string $newPlan = null): Notification
    {
        return match ($this) {
            self::WELCOME => new WelcomeNotification(self::WELCOME),
            self::DOWNGRADE => new SendDowngradeSubscriptionNotification(self::DOWNGRADE, $oldPlan, $newPlan),
            self::UPGRADE => new SendUpgradeSubscriptionNotification(self::UPGRADE, $oldPlan, $newPlan),
        };
    }
}
