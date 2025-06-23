<?php

namespace App\Http\Controllers;

use App\Services\ReChartAIService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ChartAIController extends Controller
{
    public function __construct(protected ReChartAIService $ai)
    {
    }

    public function index(): Response
    {
        return Inertia::render('ChartAI');
    }

    public function message(Request $request, ReChartAIService $reChartAIService): JsonResponse
    {
        // Pull history and any uploaded data out of session or DB
        $history = session('chart_ai_history', []);
        $data = session('uploaded_data', []);

        // Append new user message
        $history[] = ['role' => 'user', 'content' => $request->input('message')];

        // Call the unified sendMessage()
        $response = $reChartAIService->sendMessage(
            $request->input('message'),
            ['previousMessages' => $history, 'data' => $data]
        );

        // Save history + pass back only the last exchange
        session(['chart_ai_history' => $history]);

        return response()->json([
            'reply' => $response['content'] ?? '',
            'chartConfig' => $response['chartConfig'] ?? null,
            'dataInsights' => $response['dataInsights'] ?? null,
            'chartRec' => $response['chartRecommendation'] ?? null,
            'suggestions' => $response['suggestions'] ?? []
        ]);
    }
}
