<?php

namespace App\Http\Controllers;

use App\Actions\Dashboard\GetStats;
use App\Actions\GetRecentProjects;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $recentProjects = GetRecentProjects::execute();
        $stats = GetStats::handle();

        return Inertia::render('dashboard', [
            'projects' => Inertia::defer(fn() => $recentProjects->latest()->limit(3)->get()),
            'statistics' => $stats,
        ]);
    }
}
