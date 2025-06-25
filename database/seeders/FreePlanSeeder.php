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
            ['chargebee_id' => 'free-yearly', 'frequency' => 'month'],
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
