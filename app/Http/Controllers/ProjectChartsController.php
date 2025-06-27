<?php

namespace App\Http\Controllers;

use App\Actions\Project\Charts\GetProjectCharts;
use App\Data\Projects\Charts\ChartFilterData;
use App\Http\Requests\Projects\Charts\ChartFilterRequest;
use App\Models\Chart;
use App\Models\Project;
use Inertia\Inertia;
use Inertia\Response;

class ProjectChartsController extends Controller
{
    public function index(Project $project, ChartFilterRequest $request): Response
    {
        return Inertia::render('charts/chart-index', [
            'charts' => Inertia::defer(fn() => GetProjectCharts::handle($project, ChartFilterData::from($request->validated())))
        ]);
    }

    public function edit(Project $project, Chart $chart): Response
    {
        return Inertia::render('charts/chart-editor', [
            'chart' => $chart,
        ]);
    }
}
