<?php

namespace App\Actions\Dashboard;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Spatie\Activitylog\Models\Activity;

class GetActivityFeeds
{
    public static function handle(): Collection
    {
        $inLastTwoDays = [Carbon::now()->subDays(2), Carbon::now()];
        return Activity::query()
            ->whereBetween('created_at', $inLastTwoDays)
            ->latest()
            ->get();
    }
}
