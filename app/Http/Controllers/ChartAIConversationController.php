<?php

namespace App\Http\Controllers;

use App\Services\ReChartAIService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChartAIConversationController extends Controller
{
    public function __invoke(Request $request, ReChartAIService $reChartAIService): JsonResponse
    {
        // Pull history and any uploaded data out of session or DB
        $history = session('chart_ai_history', []);
        $data = session('uploaded_data', []);

        $message = $request->input('message');

        // Append new user message
        $history[] = ['role' => 'user', 'content' => $message];

        // Call the unified sendMessage()
        $response = $reChartAIService->sendMessage(
            $message,
            ['previousMessages' => $history, 'data' => $data]
        );

        // Save history + pass back only the last exchange
        session(['chart_ai_history' => $history]);

        return response()->json([
            'reply' => $response['content'] ?? '',
            'chartConfig' => $response['chartConfig'] ?? null,
            'generatedData' => $response['generatedData'] ?? null,
            'dataInsights' => $response['dataInsights'] ?? null,
            'chartRecommendation' => $response['chartRecommendation'] ?? null,
            'suggestions' => $response['suggestions'] ?? [],
        ]);
    }
}
