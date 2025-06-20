<?php

namespace App\Services;

use OpenAI\Laravel\Facades\OpenAI;

class OpenAIService
{
    public static function generateContent(string $systemContent, string $userContent): array
    {
        $aiModel = config('openai.trained_model');
        try {
            $response = OpenAI::chat()->create([
                'model' => $aiModel,
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => $systemContent,
                    ],
                    [
                        'role' => 'user',
                        'content' => $userContent,
                    ],
                ],
            ]);

            if (isset($response->choices[0]) && $response->choices[0]->message->content) {
                $returnResponse['content'] = $response->choices[0]->message->content;
            } else {
                $returnResponse['message'] = "Content not created";
            }

            return $returnResponse;
        } catch (\Exception $e) {
            $returnResponse['message'] = $e->getMessage();

            return $returnResponse;
        }
    }
}
