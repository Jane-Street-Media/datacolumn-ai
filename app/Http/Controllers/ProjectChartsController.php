<?php

namespace App\Http\Controllers;

use App\Models\Chart;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectChartsController extends Controller
{
    public function index()
    {

    }

    public function edit($project, $chart): Response
    {
        $chart = new Chart(['id' => $chart]);
        return Inertia::render('charts/chart-editor', [
            'chart' => $chart,
        ]);
    }
}
