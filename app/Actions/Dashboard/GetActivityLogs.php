<?php

namespace App\Actions\Dashboard;

use App\Models\ActivityLog;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;

class GetActivityLogs
{
    public static function handle(): Collection
    {
        $inLastTwoDays = [Carbon::now()->subDays(2), Carbon::now()];
        return ActivityLog::query()
            ->whereBetween('created_at', $inLastTwoDays)
            ->latest()
            ->get();
    }
}
