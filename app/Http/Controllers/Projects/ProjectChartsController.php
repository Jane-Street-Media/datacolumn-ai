<?php

namespace App\Http\Controllers\Projects;

use App\Actions\Project\Charts\CreateSampleChart;
use App\Actions\Project\Charts\GetProjectCharts;
use App\Data\Projects\Charts\ChartFilterData;
use App\Exceptions\PackageLimitExceededException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Projects\Charts\ChartFilterRequest;
use App\Http\Requests\Projects\Charts\UpdateChartRequest;
use App\Models\Chart;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProjectChartsController extends Controller
{
    public function index(Project $project, ChartFilterRequest $request): Response
    {
        $params = $request->validated();
        $analyticsEnabled = Auth::user()->currentTeam->isAnalyticsEnabled();
        $params['analyticsEnabled'] = $analyticsEnabled;

        return Inertia::render('charts/chart-index', [
            'charts' => Inertia::defer(fn () => GetProjectCharts::handle($project, ChartFilterData::from($params))),
            'project' => $project,
        ]);
    }

    public function store(Project $project, Request $request): RedirectResponse
    {
        try {
            $chart = CreateSampleChart::handle(Auth::user(), $project, $request->all());
            return redirect()->route('projects.charts.edit', [
                'project' => $project,
                'chart' => $chart,
            ]);

        } catch (PackageLimitExceededException $exception) {
            return redirect()->back()
                ->withErrors(['package_restriction' => $exception->getMessage()]);
        }

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

    public function destroy(Project $project, Chart $chart): RedirectResponse
    {
        $chart->delete();
        return redirect()->back()->with('success', 'Chart deleted successfully.');
    }
}
