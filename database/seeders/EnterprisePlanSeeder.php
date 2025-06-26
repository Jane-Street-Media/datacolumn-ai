<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class EnterprisePlanSeeder extends Seeder
{
    public function run(): void
    {
        $planQuery = Plan::query();

        // Enterprise Monthly
        $planQuery->updateOrCreate(
            ['chargebee_id' => 'enterprise-monthly', 'frequency' => 'month'],
            [
                'display_name' => 'Enterprise',
                'price' => 0,
                'chargebee_product' => 'enterprise',
                'description' => 'For large organizations with custom needs',
                'details' => [
                    'Unlimited seats',
                    'API & integrations',
                    'SLA & onboarding',
                    'Full white-labeling',
                    'Custom chart types',
                    'Dedicated support',
                    'Advanced security',
                ],
                'features' => [
                    'unlimited_seats' => true,
                    'api_integrations' => true,
                    'sla' => true,
                    'full_white_labeling' => true,
                    'custom_chart_types' => true,
                    'dedicated_support' => true,
                    'advanced_security' => true,
                ],
                'cta' => 'Contact Sales',
                'popular' => false,
            ]
        );

        // Enterprise Yearly
        $planQuery->updateOrCreate(
            ['chargebee_id' => 'enterprise-yearly', 'frequency' => 'year'],
            [
                'display_name' => 'Enterprise',
                'price' => 0,
                'chargebee_product' => 'enterprise',
                'description' => 'For large organizations with custom needs',
                'details' => [
                    'Unlimited seats',
                    'API & integrations',
                    'SLA & onboarding',
                    'Full white-labeling',
                    'Custom chart types',
                    'Dedicated support',
                    'Advanced security',
                ],
                'features' => [
                    'unlimited_seats' => true,
                    'api_integrations' => true,
                    'sla' => true,
                    'full_white_labeling' => true,
                    'custom_chart_types' => true,
                    'dedicated_support' => true,
                    'advanced_security' => true,
                ],
                'cta' => 'Contact Sales',
                'popular' => false,
            ]
        );
    }
}
