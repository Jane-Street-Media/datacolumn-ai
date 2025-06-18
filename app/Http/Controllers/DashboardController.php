<?php

namespace App\Http\Controllers;

use App\Actions\GetRecentProjects;
use App\Models\Project;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('dashboard', [
            'projects' => Inertia::defer(fn() => GetRecentProjects::execute()),
        ]);
    }
}
