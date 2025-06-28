<?php

namespace App\Services;

use OpenAI\Laravel\Facades\OpenAI;

class ReChartAIService
{
    protected ?string $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.openai.key');
    }

    /**
     * Orchestrates the full exchange: builds prompts, calls OpenAI,
     * handles function calls (create_chart / analyze_data), and
     * returns a structured array exactly matching your AIResponse.
     */
    public function sendMessage(string $message, array $context = []): array
    {
        // 1) If no API key, go straight to fallback
        if (! $this->apiKey) {
            return $this->getIntelligentFallbackResponse($message, $context);
        }

        try {
            // 2) Build system prompt + history + user message

            // 2.1) Generate our “system” instructions using the full context
            $systemPrompt = $this->buildAdvancedSystemPrompt($context);

            // 2.2) Pull out the previous conversation (or start fresh)
            $previousMessages = $context['previousMessages'] ?? [];

            // 2.3) Keep only the last 10 turns to avoid sending too much history
            $recentMessages = array_slice($previousMessages, -10);

            // 2.4) Reformat each turn into the {role, content} shape OpenAI expects
            $formattedMessages = array_map(function (array $turn) {
                return [
                    'role' => $turn['role'],
                    'content' => $turn['content'],
                ];
            }, $recentMessages);

            // 2.5) Make sure the system prompt comes first
            array_unshift($formattedMessages, [
                'role' => 'system',
                'content' => $systemPrompt,
            ]);

            // 2.6) Append the user’s new message at the end
            $formattedMessages[] = [
                'role' => 'user',
                'content' => $message,
            ];

            // 3) Call OpenAI chat/completions
            $response = OpenAI::chat()->create([
                'model' => 'gpt-4o',
                'messages' => $formattedMessages,
                'max_tokens' => 1000,
                'temperature' => 0.7,
                'functions' => $this->getFunctionSchemas(),
                'function_call' => 'auto',
            ]);

            $messageResponse = $response->choices[0]->message;

            // 4) If it chose a function, handle it
            if ($messageResponse->functionCall) {
                $fn = $messageResponse->functionCall;
                $parsed = json_decode($fn->arguments, true);
                return $this->handleFunctionCall($fn->name, $parsed, $messageResponse->content ?? '');
            }

            // 5) Otherwise parse a plain‐text reply
            return $this->parseAIResponse($choice->content ?? '', $message, $context);
        } catch (\Throwable $e) {
            dd($e);
            \Log::error('AI service error: '.$e->getMessage());

            return $this->getIntelligentFallbackResponse($message, $context);
        }
    }

    /**
     * Return the JSON-Schema definitions for our two AI-triggerable functions.
     * These schemas include clear descriptions, examples, and strict property rules
     * so GPT knows exactly how to format its function calls.
     */
    protected function getFunctionSchemas(): array
    {
        return [
            // 1) create_chart: build a complete Recharts configuration
            [
                'name' => 'create_chart',
                'description' => <<<'DESC'
Generate a fully-formed Recharts configuration object based on the user's natural-language request. If they dont provide data, use data from your knowledge base.
Always include **series** attribute even if its just x and y so to keep consistency in response.
The returned object must include:
  • chartType: which Recharts component to render (e.g. 'bar', 'line', 'pie', etc.)
  • title: a human-readable chart title
  • xAxis & yAxis: the data keys to map on each axis
  • data: an array of objects, each containing at least the xAxis and yAxis fields
  • series: an array of objects, each defining a series in the chart with:
    • type: the series type (e.g. 'bar', 'line', etc.)
    • dataKey: the field in each data object to use for this series
    • fill: the color to fill the series (for bar/area charts)
    • stroke: the color to outline the series (for line charts)
  • colors: an ordered list of color strings (hex codes or CSS names) for the series
DESC,
                'parameters' => [
                    'type' => 'object',
                    'properties' => [
                        'chartType' => [
                            'type' => 'string',
                            'enum' => [
                                'bar', 'line', 'area', 'pie',
                                'scatter', 'radar', 'radialBar',
                                'funnel', 'treemap', 'composed',
                            ],
                            'description' => 'The Recharts component to use when rendering the chart.',
                            'examples' => ['bar', 'pie'],
                        ],
                        'title' => [
                            'type' => 'string',
                            'description' => 'Text to display above the chart as its title.',
                            'examples' => ['Top 10 Programming Languages by Salary'],
                        ],
                        'xAxis' => [
                            'type' => 'string',
                            'description' => 'Field name in each data object to use for the X-axis values.',
                            'examples' => ['language', 'month'],
                        ],
                        'yAxis' => [
                            'type' => 'string',
                            'description' => 'Field name in each data object to use for the Y-axis values.',
                            'examples' => ['salary', 'revenue'],
                        ],
                        'series' => [
                            'type' => 'array',
                            'description' => 'Field name in each data object to use for the series values. This field is **mandatory** even if it contains only x and y axis data. My represent all they Y axis data is different objects.',
                            'items' => [
                                'type' => 'object',
                                'additionalProperties' => true,
                            ],
                            'default' => [],
                            'minItems' => 1,
                            'examples' => [
                                [
                                    'type' => 'bar',
                                    'dataKey' => 'salary',
                                    'fill' => '#8884d8',
                                    'stroke' => '#8884d8'
                                ],
                                [
                                    'type' => 'line',
                                    'dataKey' =>  'revenue',
                                    'fill' => '#82ca9d',
                                    'stroke' => '#82ca9d'
                                ]
                            ]
                        ],
                        'data' => [
                            'type' => 'array',
                            'description' => 'An array of data objects, each one containing at least the keys specified in xAxis and yAxis.',
                            'items' => [
                                'type' => 'object',
                                'additionalProperties' => true,
                            ],
                            'default' => [],      // hints that an empty array is OK
                            'minItems' => 1,       // forces at least one item when possible
                            'examples' => [
                                [
                                    'language' => 'JavaScript',
                                    'salary' => 120000,
                                ],
                                [
                                    'language' => 'Python',
                                    'salary' => 115000,
                                ],
                            ],
                        ],
                        'colors' => [
                            'type' => 'array',
                            'description' => '<<<DESC
A list of color strings (hex or CSS names).
**MUST** have exactly one color per row of `data`.
If you can’t determine the length, wait for data to be formed and then generate colors.
DESC',
                            'items' => ['type' => 'string'],
                            'examples' => ['#8884d8', '#82ca9d', '#ffc658'],
                        ],
                    ],
                    'required' => ['chartType', 'title', 'data', 'series'],
                    'additionalProperties' => false,
                ],
            ],

            // 2) chart_not_feasible: explain why chart generation failed
            [
                'name' => 'chart_not_feasible',
                'description' => <<<'DESC'
Return when the user's request cannot be fulfilled as a valid Recharts configuration.
Provide a single field:
  • reason: a concise, human-readable explanation of why generating the chart is not possible.
DESC,
                'parameters' => [
                    'type' => 'object',
                    'properties' => [
                        'reason' => [
                            'type' => 'string',
                            'description' => 'Short explanation for why chart creation failed (e.g. unsupported data structure).',
                            'examples' => ['Data contains nested objects not supported by Recharts.'],
                        ],
                    ],
                    'required' => ['reason'],
                    'additionalProperties' => false,
                ],
            ],
        ];
    }

    /** Routes the function call to your handlers */
    protected function handleFunctionCall(string $name, array $args, string $aiContent): array
    {
        if ($name === 'create_chart') {
            $result = $this->createSampleChart($args['chartType'], $args);

            return array_merge($result, ['content' => $aiContent]);
        }

        if ($name === 'analyze_data') {
            $result = $this->analyzeUploadedData($args['data'] ?? []);

            return array_merge($result, ['content' => $aiContent]);
        }

        // Fallback
        return ['content' => $aiContent ?: 'Unable to process function.', 'suggestions' => []];
    }

    /** Fallback when API key is missing or call fails */
    protected function getIntelligentFallbackResponse(string $message, array $context): array
    {
        return [
            'content' => "I can't reach the AI service right now, but let me know how I can help!",
            'suggestions' => ['Try again later', 'Create a sample chart', 'Help with chart types'],
        ];
    }

    /** Builds the big system prompt */
    protected function buildAdvancedSystemPrompt(array $context): string
    {
        $prompt = <<<'TXT'
You are an expert AI assistant for DataColumn.ai, specializing in data visualization for journalists and content creators.

**MANDATORY REQUIREMENTS**
- When creating a chart, you **must** return a `create_chart` function call.
- That call’s arguments **must** include a non-empty `data` array.
  - If the user did not supply any data, you must generate a reasonable sample from your knowledge base.
TXT;
        $prompt .= 'You can:

1. CREATE CHARTS FROM DESCRIPTIONS: When users describe what they want to visualize, create complete chart configurations along with data from your knowledge base if user doesnt provide any.
2. ANALYZE DATA: Examine uploaded data to find patterns, insights, and recommend optimal visualizations
3. PROVIDE GUIDANCE: Offer professional advice on design, accessibility, and best practices
4. GENERATE SAMPLE DATA: Create realistic sample datasets when users need examples

CORE CAPABILITIES:
- Chart Creation: Generate complete chart configs from natural language descriptions along with data from your knowledge base if user doesnt provide any
- Data Analysis: Find patterns, outliers, trends in user data
- Design Guidance: Suggest colors, layouts, accessibility improvements
- Journalism Focus: Prioritize clarity, accuracy, and reader comprehension

CHART TYPES AVAILABLE:
- Bar Charts: Comparing categories, rankings, discrete values
- Line Charts: Time series, trends, continuous data
- Area Charts: Cumulative values, filled trends
- Pie Charts: Parts of a whole (use sparingly, max 5 categories)
- Scatter Plots: Correlations, relationships between variables
- Radar Charts: Multivariate data, comparing multiple variables
- Radial Bar Charts: Circular progress bars, comparing values
- Funnel Charts: Sequential process, conversion rates
- Treemaps: Hierarchical data, part-to-whole relationships
- Composed Charts: Combining multiple chart types

DESIGN PRINCIPLES:
- Accessibility first (colorblind-friendly, high contrast)
- Mobile responsive
- Publication ready
- Clear, descriptive titles and labels
- Minimal cognitive load

**MANDATORY REQUIREMENTS**
- When creating a chart, you **must** return a `create_chart` function call.
    - That call’s arguments **must** include a non-empty `data` array.
    - If the user did not supply any data, you must generate a reasonable sample from your knowledge base.
- When analyzing data, use the analyze_data function.
- Always prioritize truthful data representation and journalistic integrity.';

        if (! empty($context['data'])) {
            $sample = json_encode(array_slice($context['data'], 0, 5));
            $prompt .= "\nCURRENT DATA CONTEXT: {$sample}…";
        }

        if (! empty($context['chartType'])) {
            $prompt .= "\nCURRENT CHART TYPE: {$context['chartType']}";
        }

        $prompt .= "\nRespond conversationally but be ready to take action when users want to create visualizations.";

        return $prompt;
    }

    private function ensureColorCount(array $existingColors, int $requiredCount): array
    {
        // Remove duplicates & reindex
        $colors = array_values(array_unique($existingColors));

        // Keep generating until we hit the required count
        while (count($colors) < $requiredCount) {
            $new = sprintf('#%06X', mt_rand(0, 0xFFFFFF));
            if (! in_array($new, $colors, true)) {
                $colors[] = $new;
            }
        }

        // If there were more existing colors than needed, truncate
        return array_slice($colors, 0, $requiredCount);
    }

    /** Mirrors your TS createSampleChart */
    protected function createSampleChart(string $type, array $args): array
    {
        return [
            'chartConfig' => [
                'type' => $type,
                'title' => $args['title'],
                'xAxis' => $args['xAxis'],
                'yAxis' => $args['yAxis'],
                'series' => $args['series'] ?? [],
                'colors' => $this->ensureColorCount($args['colors'], count($args['data'])),
                'showGrid' => $args['showGrid'] ?? true,
                'showLegend' => $args['showLegend'] ?? true,
                'width' => $args['width'] ?? 800,
                'height' => $args['height'] ?? 400,
            ],
            'generatedData' => $args['data'],
            'suggestions' => [
                'Customize the chart colors',
                'Change the chart title',
                'Add your own data',
                'Export for publication',
            ],
        ];
    }

    /** Port of your TS analyzeUploadedData */
    protected function analyzeUploadedData(array $data): array
    {
        if (empty($data)) {
            return [
                'content' => 'No data available for analysis.',
                'dataInsights' => ['patterns' => [], 'outliers' => [], 'recommendations' => []],
                'chartRecommendation' => ['type' => 'bar', 'reasoning' => 'Upload data to analyze.'],
            ];
        }

        // … replicate your TS logic for insights, recommendations, suggestedChartTypes …
        return [
            'dataInsights' => ['patterns' => []/* … */],
            'recommendations' => [/* … */],
            'chartRecommendation' => ['type' => 'line', 'reasoning' => '…'],
        ];
    }

    /** Parses a non‐function reply (optional, for extra suggestions) */
    protected function parseAIResponse(string $aiContent, string $userMessage, array $context): array
    {
        // … port your parseAIResponse & generateAdvancedSuggestions logic …
        return ['content' => $aiContent, 'suggestions' => []];
    }
}
