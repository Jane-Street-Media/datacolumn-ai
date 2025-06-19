<?php

namespace App\Providers;

use App\Console\Commands\FetchPlans;
use App\Models\Subscription;
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
        if (app()->environment('local')) {
            URL::forceScheme('https');
        }
        Cashier::useSubscriptionModel(Subscription::class);
    }
}
