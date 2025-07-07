<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use OpenAI\Laravel\Facades\OpenAI;

class ReChartAIService
{
    protected ?string $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.openai.key');
    }

    public function sendMessage(string $message, array $context = [], bool $forceCreateChart = false): array
    {
        if (! $this->apiKey) {
            return $this->getIntelligentFallbackResponse($message, $context);
        }

        try {
            $systemPrompt = $this->buildAdvancedSystemPrompt($context);

            $previousMessages = $context['previousMessages'] ?? [];

            // Reset conversation if "start again"
            if (strtolower(trim($message)) === 'start again') {
                $previousMessages = [];
            }

            $recentMessages = array_slice($previousMessages, -10);

            $formattedMessages = array_map(function (array $turn) {
                return [
                    'role' => $turn['role'],
                    'content' => $turn['content'],
                ];
            }, $recentMessages);

            array_unshift($formattedMessages, [
                'role' => 'system',
                'content' => $systemPrompt,
            ]);

            $formattedMessages[] = [
                'role' => 'user',
                'content' => $message,
            ];

            $response = OpenAI::chat()->create([
                'model' => 'gpt-4o',
                'messages' => $formattedMessages,
                'max_tokens' => 1000,
                'temperature' => 0.2,
                'functions' => $this->getFunctionSchemas(),
                'function_call' => $forceCreateChart ? ['name' => 'create_chart'] : 'auto',
            ]);

            $messageResponse = $response->choices[0]->message;

            if ($messageResponse->functionCall) {
                $fn = $messageResponse->functionCall;
                $parsed = json_decode($fn->arguments, true);
                return $this->handleFunctionCall($fn->name, $parsed, $messageResponse->content ?? '');
            }

            return $this->parseAIResponse($messageResponse->content ?? '', $message, $context);

        } catch (\Throwable $e) {
            Log::error('AI service error: ' . $e->getMessage());

            return $this->getIntelligentFallbackResponse($message, $context);
        }
    }

    protected function getFunctionSchemas(): array
    {
        return [
            [
                'name' => 'create_chart',
                'description' => <<<'DESC'
Generate a fully-formed Recharts configuration object based on the user's natural-language request.
Always include **series** attribute even if it's just x and y to keep consistency.
DESC,
                'parameters' => [
                    'type' => 'object',
                    'properties' => [
                        'chartType' => [
                            'type' => 'string',
                            'enum' => ['bar', 'line', 'area', 'composed'],
                        ],
                        'title' => [
                            'type' => 'string',
                        ],
                        'xAxis' => [
                            'type' => 'string',
                        ],
                        'yAxis' => [
                            'type' => 'string',
                        ],
                        'series' => [
                            'type' => 'array',
                            'items' => [
                                'type' => 'object',
                                'additionalProperties' => true,
                            ],
                            'minItems' => 1,
                        ],
                        'data' => [
                            'type' => 'array',
                            'items' => [
                                'type' => 'object',
                                'additionalProperties' => true,
                            ],
                            'minItems' => 1,
                        ],
                        'colors' => [
                            'type' => 'array',
                            'items' => ['type' => 'string'],
                        ],
                    ],
                    'required' => ['chartType', 'title', 'data', 'series'],
                    'additionalProperties' => false,
                ],
            ],
            [
                'name' => 'chart_not_feasible',
                'description' => 'Explain why chart generation is not possible.',
                'parameters' => [
                    'type' => 'object',
                    'properties' => [
                        'reason' => [
                            'type' => 'string',
                        ],
                    ],
                    'required' => ['reason'],
                    'additionalProperties' => false,
                ],
            ],
        ];
    }

    protected function handleFunctionCall(string $name, array $args, string $aiContent): array
    {
        if ($name === 'create_chart') {
            if (
                empty($args['chartType']) ||
                empty($args['title']) ||
                empty($args['data']) ||
                empty($args['series'])
            ) {
                return [
                    'content' => 'I tried to create a chart, but the configuration was incomplete. Please rephrase or try again.',
                    'suggestions' => $this->defaultSuggestions(),
                ];
            }

            $result = $this->createSampleChart($args['chartType'], $args);

            return array_merge($result, ['content' => $aiContent]);
        }

        return [
            'content' => $aiContent ?: 'Unable to process function.',
            'suggestions' => $this->defaultSuggestions(),
        ];
    }

    protected function getIntelligentFallbackResponse(string $message, array $context): array
    {
        return [
            'content' => "I can't reach the AI service right now, but here are some ideas you could explore:",
            'suggestions' => $this->defaultSuggestions(),
        ];
    }

    protected function buildAdvancedSystemPrompt(array $context): string
    {
        $prompt = <<<'TXT'
You are an expert AI data visualization assistant for DataColumn.ai, specializing in creating Recharts configurations from user instructions.

**MANDATORY BEHAVIOR**
- When creating a chart, you MUST return a `create_chart` function call.
- That function call MUST include:
  • `chartType`
  • `title`
  • a non-empty `data` array
  • at least one `series` definition
- If the user did not supply data, you MUST generate realistic sample data from your knowledge base or public data examples.

**IMPORTANT**
When the user message starts with words like "Create", "Generate", "Visualize", "Plot", "Show", or "Compare", treat it as a direct instruction to create a chart.
- You MUST respond ONLY by returning a `create_chart` function call with all required fields.
- DO NOT respond with any other text, markdown, explanations, or disclaimers outside the `title` field.
- DO NOT ask questions or offer further suggestions in this case.

**DATA GENERATION POLICY**
- If the user requests real-world historical data, you MUST attempt to recall accurate data or approximate the trend based on your training knowledge.
- If you cannot recall exact figures, you MUST still generate plausible sample data that reflects typical values and trends.
- If any data is approximate, clearly indicate this in the `title` field, e.g., "Approximate Data – U.S. Federal Deficit Over Time".
- NEVER leave the `data` array empty.

**RESPONSE FORMAT**
- You MUST always return only the `create_chart` function call.
- All required fields must be complete.
- Never return plain text or explanations outside of the function call.

**SUGGESTIONS POLICY**
- When offering suggestions, always recommend concrete, historically grounded datasets you can generate.
- Example suggestions:
  • "Create a bar chart showing average U.S. household income over the past ten years."
  • "Generate a line chart of the U.S. federal deficit over the last twenty years."
  • "Visualize minimum wage increases by U.S. state over the last 20 years."
  • "Plot the global smartphone adoption rates from 2000 to 2020."
- Avoid generic suggestions like "create a chart with sample data."

**YOUR CAPABILITIES**
You can:
1. Create charts from descriptions.
2. Analyze and visualize data.
3. Generate sample datasets.

**AVAILABLE CHART TYPES**
- Bar Charts
- Line Charts
- Area Charts
- Pie Charts (max 5 categories)
- Scatter Plots
- Radar Charts
- Radial Bar Charts
- Funnel Charts
- Treemaps
- Composed Charts

**DESIGN PRINCIPLES**
- Accessibility first (colorblind-friendly)
- Mobile responsive layouts
- Clear, descriptive titles and labels
- Minimal cognitive load
TXT;

        if (! empty($context['data'])) {
            $sample = json_encode(array_slice($context['data'], 0, 5));
            $prompt .= "\nCURRENT DATA CONTEXT: {$sample}…";
        }

        if (! empty($context['chartType'])) {
            $prompt .= "\nCURRENT CHART TYPE: {$context['chartType']}";
        }

        return $prompt;
    }

    private function ensureColorCount(array $existingColors, int $requiredCount): array
    {
        $colors = array_values(array_unique($existingColors));

        while (count($colors) < $requiredCount) {
            $new = sprintf('#%06X', mt_rand(0, 0xFFFFFF));
            if (! in_array($new, $colors, true)) {
                $colors[] = $new;
            }
        }

        return array_slice($colors, 0, $requiredCount);
    }

    protected function createSampleChart(string $type, array $args): array
    {
        return [
            'chartConfig' => [
                'type' => $type,
                'title' => $args['title'],
                'xAxis' => $args['xAxis'],
                'yAxis' => $args['yAxis'],
                'series' => $args['series'] ?? [],
                'colors' => $this->ensureColorCount($args['colors'] ?? [], count($args['series'] ?? [])),
                'showGrid' => $args['showGrid'] ?? true,
                'showLegend' => $args['showLegend'] ?? true,
                'width' => $args['width'] ?? 800,
                'height' => $args['height'] ?? 400,
            ],
            'generatedData' => $args['data'],
            'suggestions' => $this->defaultSuggestions(),
        ];
    }

    protected function parseAIResponse(string $aiContent, string $userMessage, array $context): array
    {
        return [
            'content' => $aiContent,
            'suggestions' => $this->defaultSuggestions(),
        ];
    }

    protected function defaultSuggestions(): array
    {
        return [
            'Create a bar chart showing average U.S. household income over the past ten years',
            'Generate a line chart of the U.S. federal deficit over the last twenty years',
            'Visualize minimum wage increases by U.S. state over the past twenty years',
            'Plot global smartphone adoption from 2000 to 2020',
            'Show CO₂ emissions by country since 1990',
            'Compare top programming languages by developer salary',
            'Illustrate global life expectancy trends over time',
            'Create a chart of renewable energy share by country',
        ];
    }
}
