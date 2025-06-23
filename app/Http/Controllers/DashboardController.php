<?php

namespace App\Http\Controllers;

use App\Actions\Dashboard\GetActivityLogs;
use App\Actions\Dashboard\GetStats;
use App\Actions\Folder\GetFolders;
use App\Actions\Queries\Dashboard\GetRecentProjectQuery;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('dashboard', [
            'projects' => Inertia::defer(fn () => GetRecentProjectQuery::handle()->latest()->limit(3)->get()),
            'statistics' => GetStats::handle(),
            'activityLogs' => GetActivityLogs::handle(),
            'folders' => Inertia::defer(fn () => GetFolders::handle()),
            'roles' => Inertia::defer(fn()=>Role::all())
        ]);
    }
}
