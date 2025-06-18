<?php

namespace App\Http\Controllers;

use App\Actions\Dashboard\GetActivityFeeds;
use App\Actions\Dashboard\GetStats;
use App\Actions\Queries\GetRecentProjectQuery;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('dashboard', [
            'projects' => Inertia::defer(fn () => GetRecentProjectQuery::execute()->latest()->limit(3)->get()),
            'statistics' => GetStats::handle(),
            'activityFeeds' => GetActivityFeeds::handle(),
        ]);
    }
}
