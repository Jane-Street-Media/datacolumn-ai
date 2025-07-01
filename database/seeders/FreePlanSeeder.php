<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class FreePlanSeeder extends Seeder
{
    public function run(): void
    {
        $planQuery = Plan::query();
        // Free Monthly
        $planQuery->updateOrCreate(
            ['chargebee_id' => 'free-monthly', 'frequency' => 'month'],
            [
                'display_name' => 'Free',
                'price' => 0,
                'chargebee_product' => 'free',
                'description' => 'Perfect for trying out DataColumn',
                'details' => [
                    '3 charts per month',
                    'Basic customization',
                    'Branded embeds',
                    'Community support',
                ],
                'features' => [
                    'no_of_invitations' => 3,
                    'no_of_projects' => 3,
                    'no_of_charts' => 3,
                    'no_of_exports' => 3,
                    'basic_customization' => true,
                    'branded_embeds' => true,
                    'community_support' => true,
                    'watermark' => true,
                    'basic_export_options' => true,
                    'ai_assistant' => false,
                ],
                'limitations' => [
                    'Limited chart types',
                    'DataColumn watermark',
                    'Basic export options',
                ],
                'cta' => 'Get Started',
                'popular' => false,
            ]
        );

        // Free Yearly
        $planQuery->updateOrCreate(
            ['chargebee_id' => 'free-yearly', 'frequency' => 'year'],
            [
                'display_name' => 'Free',
                'price' => 0,
                'chargebee_product' => 'free',
                'description' => 'Perfect for trying out DataColumn',
                'details' => [
                    '3 charts per year',
                    'Basic customization',
                    'Branded embeds',
                    'Community support',
                ],
                'features' => [
                    'no_of_invitations' => 3,
                    'no_of_projects' => 3,
                    'no_of_charts' => 3,
                    'no_of_exports' => 3,
                    'basic_customization' => true,
                    'branded_embeds' => true,
                    'community_support' => true,
                    'watermark' => true,
                    'basic_export_options' => true,
                    'ai_assistant' => false,
                ],
                'limitations' => [
                    'Limited chart types',
                    'DataColumn watermark',
                    'Basic export options',
                ],
                'cta' => 'Get Started',
                'popular' => false,
            ]
        );
    }
}
