<?php

namespace App\Http\Controllers;

use App\Actions\PlanLimitations\EnsurePlanLimitNotExceeded;
use App\Enums\PlanFeatureEnum;
use App\Exceptions\PackageLimitExceededException;
use App\Services\ReChartAIService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChartAIConversationController extends Controller
{
    public function __invoke(Request $request, ReChartAIService $reChartAIService): JsonResponse
    {
        $team = auth()->user()->currentTeam;

        try {
            EnsurePlanLimitNotExceeded::handle($team, PlanFeatureEnum::NO_OF_AI_GENERATIONS);
        }  catch (PackageLimitExceededException $exception) {
            return response()->json([
                'error' => $exception->getMessage(),
            ]);
        }

        $conversationIdentifier = $request->identifier;
        if (is_null($conversationIdentifier)) {
            $conversationIdentifier = 'chart_ai_' . uniqid();
        }

        $conversationSessionKey = 'chart_ai_conversation_' . $conversationIdentifier;

        // Pull history and any uploaded data out of session or DB
        $history = session($conversationSessionKey, []);
        $data = session('uploaded_data', []);

        $message = $request->input('message');

        // Append new user message
        $history[] = ['role' => 'user', 'content' => $message];

        // Call the unified sendMessage()
        $response = $reChartAIService->sendMessage(
            $message,
            ['previousMessages' => $history, 'data' => $data]
        );

        $chartConfig = $response['chartConfig'] ?? null;

        if ($chartConfig) {
            $team->increment('total_ai_chart_generations');
        }

        // Save history + pass back only the last exchange
        session([$conversationSessionKey => $history]);

        return response()->json([
            'reply' => $response['content'] ?? '',
            'chartConfig' => $chartConfig,
            'generatedData' => $response['generatedData'] ?? null,
            'dataInsights' => $response['dataInsights'] ?? null,
            'chartRecommendation' => $response['chartRecommendation'] ?? null,
            'suggestions' => $response['suggestions'] ?? [],
            'identifier' => $conversationIdentifier
        ]);
    }
}
