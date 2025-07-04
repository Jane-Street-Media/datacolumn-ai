<?php

namespace App\Http\Controllers;

use App\Enums\ChartStatus;
use App\Enums\ProjectStatus;
use App\Models\Chart;
use Inertia\Inertia;
use Inertia\Response;

class EmbeddedChartController extends Controller
{
    public function __invoke(Chart $chart): Response
    {
        if ($chart->status !== ChartStatus::ACTIVE || $chart->project->status !== ProjectStatus::ACTIVE) {
            abort(404, 'Chart not found or is not active.');
        }
        $chart->increment('total_visits');
        return Inertia::render('charts/chart-embed', [
            'chart' => $chart,
        ]);
    }
}
