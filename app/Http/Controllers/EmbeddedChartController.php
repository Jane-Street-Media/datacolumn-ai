<?php

namespace App\Http\Controllers;

use App\Models\Chart;
use Inertia\Inertia;

class EmbeddedChartController extends Controller
{
    public function __invoke(Chart $chart)
    {
        $chart->increment('total_visits');
        return Inertia::render('charts/chart-embed', [
            'chart' => $chart,
        ]);
    }
}
