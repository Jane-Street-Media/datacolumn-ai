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
        if (!$this->apiKey) {
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
            $formattedMessages = array_map(function(array $turn) {
                return [
                    'role'    => $turn['role'],
                    'content' => $turn['content'],
                ];
            }, $recentMessages);

            // 2.5) Make sure the system prompt comes first
            array_unshift($formattedMessages, [
                'role'    => 'system',
                'content' => $systemPrompt,
            ]);

            // 2.6) Append the user’s new message at the end
            $formattedMessages[] = [
                'role'    => 'user',
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

            $choice = $response->choices[0]->message;
            dd($choice);
            // 4) If it chose a function, handle it
            if ($choice->function_call) {
                $fn = $choice->function_call;
                $parsed = json_decode($fn->arguments, true);
                return $this->handleFunctionCall($fn->name, $parsed, $choice->message->content ?? '');
            }

            // 5) Otherwise parse a plain‐text reply
            return $this->parseAIResponse($choice->message->content ?? '', $message, $context);
        } catch (\Throwable $e) {
            \Log::error('AI service error: ' . $e->getMessage());
            return $this->getIntelligentFallbackResponse($message, $context);
        }
    }

    /** Return your two function schemas */
    protected function getFunctionSchemas(): array
    {
        return [
            [
                'name' => 'create_chart',
                'description' => 'Create a rechart configuration based on user requirements',
                'parameters' => [
                    'type' => 'object',
                    'properties' => [
                        'chartType' => ['type' => 'string', 'enum' => ['bar', 'line', 'area', 'pie', 'scatter', 'radar', 'radialBar', 'funnel', 'treemap', 'composed']],
                        'title' => ['type' => 'string'],
                        'xAxis' => ['type' => 'string'],
                        'yAxis' => ['type' => 'string'],
                        'data' => ['type' => 'array', 'items' => ['type' => 'object']],
                        'colors' => ['type' => 'array', 'items' => ['type' => 'string']],
                    ],
                    'required' => ['chartType', 'title', 'data'],
                ],
            ],
            [
                'name' => 'analyze_data',
                'description' => 'Analyze provided data and suggest visualizations',
                'parameters' => [
                    'type' => 'object',
                    'properties' => [
                        'insights' => ['type' => 'array', 'items' => ['type' => 'string']],
                        'recommendations' => ['type' => 'array', 'items' => ['type' => 'string']],
                        'suggestedChartType' => ['type' => 'string', 'enum' => ['bar', 'line', 'area', 'pie', 'scatter', 'radar', 'radialBar', 'funnel', 'treemap', 'composed']],
                    ],
                    'required' => ['insights', 'recommendations', 'suggestedChartType'],
                ],
            ],
        ];
    }

    /** Routes the function call to your handlers */
    protected function handleFunctionCall(string $name, array $args, string $aiContent): array
    {
        if ($name === 'create_chart') {
            $result = $this->createSampleChart($args['chartType'], $args);
            return array_merge($result, ['content' => $aiContent ?: $result['content']]);
        }

        if ($name === 'analyze_data') {
            $result = $this->analyzeUploadedData($args['data'] ?? []);
            return array_merge($result, ['content' => $aiContent ?: $result['content']]);
        }

        // Fallback
        return ['content' => $aiContent ?: 'Unable to process function.', 'suggestions' => []];
    }

    /** Fallback when API key is missing or call fails */
    protected function getIntelligentFallbackResponse(string $message, array $context): array
    {
        return [
            'content' => "I can't reach the AI service right now, but let me know how I can help!",
            'suggestions' => ['Try again later', 'Create a sample chart', 'Help with chart types']
        ];
    }

    /** Builds the big system prompt */
    protected function buildAdvancedSystemPrompt(array $context): string
    {
        $prompt = 'You are an expert AI assistant for DataColumn.ai, specializing in data visualization for journalists and content creators. You can:

1. CREATE CHARTS FROM DESCRIPTIONS: When users describe what they want to visualize, create complete chart configurations
2. ANALYZE DATA: Examine uploaded data to find patterns, insights, and recommend optimal visualizations
3. PROVIDE GUIDANCE: Offer professional advice on design, accessibility, and best practices
4. GENERATE SAMPLE DATA: Create realistic sample datasets when users need examples

CORE CAPABILITIES:
- Chart Creation: Generate complete chart configs from natural language descriptions
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

When users ask to create a chart, use the create_chart function.
When analyzing data, use the analyze_data function.
Always prioritize truthful data representation and journalistic integrity.';

        if (!empty($context['data'])) {
            $sample = json_encode(array_slice($context['data'], 0, 5));
            $prompt .= "\nCURRENT DATA CONTEXT: {$sample}…";
        }

        if (!empty($context['chartType'])) {
            $prompt .= "\nCURRENT CHART TYPE: {$context['chartType']}";
        }

        $prompt .= "\nRespond conversationally but be ready to take action when users want to create visualizations.";

        return $prompt;
    }

    /** Mirrors your TS createSampleChart */
    protected function createSampleChart(string $type, array $args): array
    {
        // copy/paste your TS chartConfigs object into PHP here...
        $chartConfigs = [
            'bar' => [
                'title' => 'Quarterly Sales Performance',
                'data' => [
                    ['quarter' => 'Q1 2024', 'sales' => 45000, 'target' => 40000],
                    // …
                ],
                'xAxis' => 'quarter', 'yAxis' => 'sales'
            ],
            // …line, pie, area, scatter, radar, radialBar, funnel, treemap, composed…
        ];

        $cfg = $chartConfigs[$type];
        return [
            'chartConfig' => [
                'type' => $type,
                'title' => $cfg['title'],
                'xAxis' => $cfg['xAxis'],
                'yAxis' => $cfg['yAxis'],
                'colors' => $args['colors'] ?? ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
                'showGrid' => true,
                'showLegend' => true,
                'width' => 800, 'height' => 400
            ],
            'generatedData' => $cfg['data'],
            'suggestions' => [
                'Customize the chart colors',
                'Change the chart title',
                'Add your own data',
                'Export for publication'
            ]
        ];
    }

    /** Port of your TS analyzeUploadedData */
    protected function analyzeUploadedData(array $data): array
    {
        if (empty($data)) {
            return [
                'content' => 'No data available for analysis.',
                'dataInsights' => ['patterns' => [], 'outliers' => [], 'recommendations' => []],
                'chartRecommendation' => ['type' => 'bar', 'reasoning' => 'Upload data to analyze.']
            ];
        }
        // … replicate your TS logic for insights, recommendations, suggestedChartTypes …
        return [
            'dataInsights' => ['patterns' => [],/*…*/],
            'recommendations' => [/*…*/],
            'chartRecommendation' => ['type' => 'line', 'reasoning' => '…']
        ];
    }

    /** Parses a non‐function reply (optional, for extra suggestions) */
    protected function parseAIResponse(string $aiContent, string $userMessage, array $context): array
    {
        // … port your parseAIResponse & generateAdvancedSuggestions logic …
        return ['content' => $aiContent, 'suggestions' => []];
    }
}
