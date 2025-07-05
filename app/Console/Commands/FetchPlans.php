<?php

namespace App\Console\Commands;

use App\Models\Plan;
use Chargebee\ChargebeeClient;
use Database\Seeders\EnterprisePlanSeeder;
use Database\Seeders\FreePlanSeeder;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class FetchPlans extends Command
{
    protected $signature = 'chargebee:fetch-plans';

    protected $description = 'Fetch plans from Chargebee and store them in the database';

    /**
     * @throws \Exception
     */
    public function handle()
    {
        Artisan::call('db:seed', [
            '--class' => FreePlanSeeder::class,
        ]);

        $site = env('CHARGEBEE_SITE');
        $apiKey = env('CHARGEBEE_API_KEY');

        if (! $site || ! $apiKey) {
            $this->error('Chargebee site or API key is missing in .env file');

            return;
        }

        $chargebee = new ChargebeeClient([
            'apiKey' => $apiKey,
            'site' => $site,
        ]);

        try {
            $items = $chargebee->item()->all([
                'type' => [
                    'is' => 'plan',
                ],
                'status' => [
                    'is' => 'active',
                ],
            ]);
            foreach ($items->list as $itemEntry) {
                $item = $itemEntry->item;
                $response = $chargebee->itemPrice()->all([
                    'item_type' => [
                        'is' => 'plan',
                    ],
                    'item_id' => [
                        'is' => $item->id,
                    ],
                    'limit' => 30,
                ]);
                foreach ($response->list as $entry) {
                    $itemPrice = $entry->item_price;
                    if (! $itemPrice?->price || $itemPrice->price === 0) {
                        continue;
                    }
                    $plan = Plan::updateOrCreate(
                        ['chargebee_id' => $itemPrice->id],
                        [
                            'display_name' => $item->external_name ?? $item->name,
                            'price' => $itemPrice->price,
                            'chargebee_product' => $itemPrice->item_id,
                            'frequency' => $itemPrice->period_unit,
                            'currency' => $itemPrice->currency_code,
                            'quantity' => 1,
                        ]
                    );

                    if ($plan->display_name === 'Pro') {
                        $plan->update([
                            'description' => 'For professional journalists and content creators',
                            'details' => [
                                'Unlimited charts & exports',
                                'No watermark',
                                '50 AI chart generations per month',
                                'Priority rendering',
                                'Chart presets',
                                'Custom embed domain',
                                'Advanced customization',
                                'SVG/PNG exports',
                                'Usage analytics',
                                'Email support',
                            ],
                            'features' => [
                                'no_of_team_members' => 0,
                                'no_of_projects' => -1,
                                'no_of_charts' => -1,
                                'no_of_exports' => -1,
                                'no_of_ai_generations' => 50,
                                'watermark' => false,
                                'priority_rendering' => true,
                                'chart_presets' => true,
                                'custom_embed_domain' => true,
                                'advanced_customization' => true,
                                'svg_exports' => true,
                                'png_exports' => true,
                                'email_support' => true,
                                'ai_assistant' => false,
                                'usage_analytics' => true,
                            ],
                            'cta' => 'Start Pro Trial',
                            'popular' => true,
                        ]);
                    }

                    if ($plan->display_name === 'Team') {
                        $plan->update([
                            'description' => 'For newsrooms and content teams',
                            'details' => [
                                'everything from Pro plan',
                                '5 seats included',
                                '500 AI chart generations per month',
                                'Shared folders & styles',
                                'Access controls',
                                'Priority support',
                                'Team collaboration',
                                'Brand customization',
                                'Usage analytics',
                            ],
                            'features' => [
                                'no_of_team_members' => 5,
                                'no_of_projects' => -1,
                                'no_of_charts' => -1,
                                'no_of_exports' => -1,
                                'no_of_ai_generations' => 500,
                                'shared_folders' => true,
                                'shared_styles' => true,
                                'access_controls' => true,
                                'priority_support' => true,
                                'team_collaboration' => true,
                                'brand_customization' => true,
                                'usage_analytics' => true,
                                'ai_assistant' => false,
                                'watermark' => false,
                            ],
                            'cta' => 'Start Team Trial',
                            'popular' => false,
                        ]);
                    }

                }

                $this->info('Plans '.$item->id.' details successfully stored in the database.');
            }

        } catch (\Exception $e) {
            $this->error('Error fetching plans: '.$e->getMessage());
        }

        Artisan::call('db:seed', [
            '--class' => EnterprisePlanSeeder::class,
        ]);
    }
}
