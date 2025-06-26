<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class ChartAIController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('chart-ai');
    }
}
