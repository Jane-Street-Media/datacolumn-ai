<?php

namespace App\Providers;

use App\Console\Commands\FetchPlans;
use App\Models\Subscription;
use App\Models\Team;
use Chargebee\Cashier\Cashier;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->commands([
            FetchPlans::class,
        ]);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // TODO: This is only for ngrok
        if (app()->environment('production')) {
            URL::forceScheme('https');
        }
        Cashier::useCustomerModel(Team::class);
        Cashier::useSubscriptionModel(Subscription::class);
    }
}
