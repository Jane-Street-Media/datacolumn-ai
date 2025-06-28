<?php

namespace App\Http\Controllers;

use App\Actions\Project\Charts\GetProjectCharts;
use App\Data\Projects\Charts\ChartFilterData;
use App\Http\Requests\Projects\Charts\ChartFilterRequest;
use App\Http\Requests\Projects\Charts\UpdateChartRequest;
use App\Models\Chart;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProjectChartsController extends Controller
{
    public function index(Project $project, ChartFilterRequest $request): Response
    {
        return Inertia::render('charts/chart-index', [
            'charts' => Inertia::defer(fn () => GetProjectCharts::handle($project, ChartFilterData::from($request->validated()))),
        ]);
    }

    public function edit(Project $project, Chart $chart): Response
    {
        return Inertia::render('charts/chart-editor', [
            'chart' => $chart,
        ]);
    }

    public function update(Project $project, Chart $chart, UpdateChartRequest $request): RedirectResponse
    {
        $updated = $chart->update($request->validated());
        if (! $updated) {
            return back()->withErrors([
                'error' => 'Something went wrong during updating chart.',
            ]);
        }
        return back()->with(['success' => 'Chart updated successfully.']);
    }
}
