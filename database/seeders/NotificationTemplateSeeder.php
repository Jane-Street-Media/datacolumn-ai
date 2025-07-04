<?php

namespace Database\Seeders;

use App\Enums\NotificationType;
use App\Models\NotificationTemplate;
use Illuminate\Database\Seeder;

class NotificationTemplateSeeder extends Seeder
{
    public function run(): void
    {
        $notificationTemplates = [
            [
                'name' => 'Welcome',
                'subject' => 'Hi',
                'type' => NotificationType::WELCOME,
                'message' => 'Hi [user_name] Welcome, you have successfully subscribed our plan [plan_name]',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Plan Upgrade',
                'subject' => 'Hi',
                'type' => NotificationType::UPGRADE,
                'message' => '[user_name] from [team_name] upgrade subscription plan from [old_plan] to [new_plan]',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Plan Downgrade',
                'subject' => 'Hi',
                'type' => NotificationType::DOWNGRADE,
                'message' => '[user_name] from [team_name] downgrade subscription plan from [old_plan] to [new_plan]',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        NotificationTemplate::upsert($notificationTemplates, ['type'], ['name', 'message', 'created_at', 'updated_at']);
    }
}
