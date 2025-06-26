import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Bot,
    Send,
    BarChart3,
    Zap,
    Loader2,
    Code,
    Download,
    FileImage,
    Edit
} from 'lucide-react';
import { ChartRenderer } from '@/components/chart-editor/chart-renderer';
// import { EmbedCodeModal } from '../components/EmbedCodeModal';
import { ChartConfig } from '@/types';
import { useChartExport } from '@/hooks/use-chart-export';
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';

interface Message {
    id: string;
    type: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    suggestions?: string[];
    chartRecommendation?: {
        type: 'bar' | 'line' | 'area' | 'pie' | 'scatter' | 'radar' | 'radialBar' | 'funnel' | 'treemap' | 'composed';
        reasoning: string;
    };
    dataInsights?: {
        patterns: string[];
        outliers: string[];
        recommendations: string[];
    };
    chartConfig?: ChartConfig;
    generatedData?: any[];
}

export const Assistant: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            type: 'assistant',
            content: "Hello! I'm your AI assistant for data visualization. I can help you create charts from descriptions, analyze data patterns, and provide professional guidance. Try saying something like 'Create a bar chart showing monthly sales data' or upload a CSV file for analysis!",
            timestamp: new Date(),
            suggestions: [
                "Create a line chart showing website traffic over time",
                "Make a pie chart of market share by company",
                "Analyze my CSV data for insights",
                "Show me best practices for accessible charts"
            ]
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showEmbedModal, setShowEmbedModal] = useState(false);
    const [selectedChart, setSelectedChart] = useState<{ config: ChartConfig; data: any[] } | null>(null);
    const [showExportMenu, setShowExportMenu] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { exportChart, exportChartAsSVG } = useChartExport();
    const createProject = () => {};

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    interface AIResponse {
        content: string
        suggestions?: string[]
        chartRecommendation?: {
            type: 'bar' | 'line' | 'area' | 'pie' | 'scatter' | 'radar' | 'radialBar' | 'funnel' | 'treemap' | 'composed'
            reasoning: string
        }
        dataInsights?: {
            patterns: string[]
            outliers: string[]
            recommendations: string[]
        }
        chartConfig?: any
        generatedData?: any[]
    }

    const handleSendMessage = async (messageText?: string) => {
        const text = messageText || inputValue;
        if (!text.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            content: text,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        try {
            // const response = await backendAIService.sendMessage(text, {
            //     data: null,
            //     previousMessages: messages.slice(-5).map(m => ({
            //         role: m.type === 'user' ? 'user' : 'assistant',
            //         content: m.content,
            //         timestamp: m.timestamp
            //     }))
            // });

            const response = getFallbackResponse(text)

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                type: 'assistant',
                content: response.content,
                timestamp: new Date(),
                suggestions: response.suggestions,
                chartRecommendation: response.chartRecommendation,
                dataInsights: response.dataInsights,
                chartConfig: response.chartConfig,
                generatedData: response.generatedData
            };

            console.log('aiMessageaiMessageaiMessage');
            console.log(aiMessage);

            setMessages(prev => [...prev, aiMessage]);

            // If a chart was generated, show success message
            if (response.chartConfig) {
                toast('Successful', {
                    description: 'Chart created successfully! You can customize it further or export it.'
                });
            }
        } catch (error) {
            console.error('AI Error:', error);
            toast.error(error.message);
        } finally {
            setIsTyping(false);
        }
    };

    const getFallbackResponse = (message: string, context?: any): AIResponse =>  {
        const lowerMessage = message.toLowerCase()

        // Chart creation from descriptions
        if (lowerMessage.includes('create') || lowerMessage.includes('make') || lowerMessage.includes('build')) {
            if (lowerMessage.includes('bar') || lowerMessage.includes('column')) {
                return createSampleChart('bar', message)
            }
            if (lowerMessage.includes('line') || lowerMessage.includes('trend')) {
                return createSampleChart('line', message)
            }
            if (lowerMessage.includes('area') || lowerMessage.includes('area')) {
                return createSampleChart('area', message)
            }
            if (lowerMessage.includes('pie') || lowerMessage.includes('donut')) {
                return createSampleChart('pie', message)
            }
            if (lowerMessage.includes('scatter') || lowerMessage.includes('correlation')) {
                return createSampleChart('scatter', message)
            }
            if (lowerMessage.includes('area') || lowerMessage.includes('filled')) {
                return createSampleChart('area', message)
            }
            if (lowerMessage.includes('radar') || lowerMessage.includes('spider')) {
                return createSampleChart('radar', message)
            }
            if (lowerMessage.includes('radial') || lowerMessage.includes('circular')) {
                return createSampleChart('radialBar', message)
            }
            if (lowerMessage.includes('funnel') || lowerMessage.includes('conversion')) {
                return createSampleChart('funnel', message)
            }
            if (lowerMessage.includes('treemap') || lowerMessage.includes('hierarchy')) {
                return createSampleChart('treemap', message)
            }
            if (lowerMessage.includes('composed') || lowerMessage.includes('combined') || lowerMessage.includes('mixed')) {
                return createSampleChart('composed', message)
            }

            // Default to bar chart for general creation requests
            return createSampleChart('bar', message)
        }

        // Default response
        return {
            content: "I'm here to help you create effective data visualizations! I can create charts from descriptions and professional guidance. What would you like to work on?",
            suggestions: [
                "Create a bar chart showing quarterly sales",
                "Make a line chart of website traffic",
                "Build a area chart for monthly expenses",
            ]
        }
    }

    const createSampleChart = (type: string, message: string): AIResponse => {
        const chartConfigs = {
            bar: {
                title: "Quarterly Sales Performance",
                data: [
                    { quarter: "Q1 2024", sales: 45000, target: 40000 },
                    { quarter: "Q2 2024", sales: 52000, target: 48000 },
                    { quarter: "Q3 2024", sales: 61000, target: 55000 },
                    { quarter: "Q4 2024", sales: 58000, target: 60000 }
                ],
                xAxis: "quarter",
                yAxis: "sales",
                series: [
                    { dataKey: "sales" },
                    { dataKey: "target" }
                ]
            },
            line: {
                title: "Website Traffic Over Time",
                data: [
                    { month: "Jan", visitors: 12500, pageviews: 45000 },
                    { month: "Feb", visitors: 13200, pageviews: 48000 },
                    { month: "Mar", visitors: 15800, pageviews: 52000 },
                    { month: "Apr", visitors: 14600, pageviews: 49000 },
                    { month: "May", visitors: 16900, pageviews: 58000 },
                    { month: "Jun", visitors: 18200, pageviews: 62000 }
                ],
                xAxis: "month",
                yAxis: "visitors",
                series: [
                    { dataKey: "visitors" },
                    { dataKey: "pageviews" }
                ]
            },
            pie: {
                title: "Market Share by Company",
                data: [
                    { company: "Company A", share: 35 },
                    { company: "Company B", share: 28 },
                    { company: "Company C", share: 22 },
                    { company: "Company D", share: 15 }
                ],
                xAxis: "company",
                yAxis: "share",
                series: [
                    { dataKey: "share" }
                ]
            },
            area: {
                title: "Revenue Growth",
                data: [
                    { year: "2020", revenue: 120000 },
                    { year: "2021", revenue: 145000 },
                    { year: "2022", revenue: 168000 },
                    { year: "2023", revenue: 195000 },
                    { year: "2024", revenue: 220000 }
                ],
                xAxis: "year",
                yAxis: "revenue",
                series: [
                    { dataKey: "revenue" }
                ]
            },
            scatter: {
                title: "Price vs. Sales Correlation",
                data: [
                    { price: 25, sales: 450 },
                    { price: 30, sales: 380 },
                    { price: 35, sales: 320 },
                    { price: 40, sales: 280 },
                    { price: 45, sales: 240 },
                    { price: 50, sales: 200 }
                ],
                xAxis: "price",
                yAxis: "sales",
                series: [
                    { dataKey: "sales" }
                ]
            },
            radar: {
                title: "Product Feature Comparison",
                data: [
                    { feature: "Quality",    productA: 85, productB: 90, productC: 78 },
                    { feature: "Price",      productA: 65, productB: 50, productC: 95 },
                    { feature: "Durability", productA: 90, productB: 85, productC: 70 },
                    { feature: "Design",     productA: 75, productB: 95, productC: 80 },
                    { feature: "Support",    productA: 80, productB: 75, productC: 65 }
                ],
                xAxis: "feature",
                yAxis: "productA",
                series: [
                    { dataKey: "productA" },
                    { dataKey: "productB" },
                    { dataKey: "productC" }
                ]
            },
            radialBar: {
                title: "Goal Completion Rates",
                data: [
                    { name: "Sales",       value: 85 },
                    { name: "Marketing",   value: 72 },
                    { name: "Development", value: 90 },
                    { name: "Support",     value: 68 }
                ],
                xAxis: "name",
                yAxis: "value",
                series: [
                    { dataKey: "value" }
                ]
            },
            funnel: {
                title: "Sales Conversion Funnel",
                data: [
                    { stage: "Visitors",  value: 5000 },
                    { stage: "Leads",     value: 3500 },
                    { stage: "Qualified", value: 2200 },
                    { stage: "Proposals", value: 1200 },
                    { stage: "Closed",    value: 600 }
                ],
                xAxis: "stage",
                yAxis: "value",
                series: [
                    { dataKey: "value" }
                ]
            },
            treemap: {
                title: "Budget Allocation by Department",
                data: [
                    { department: "Marketing",  budget: 250000 },
                    { department: "R&D",        budget: 350000 },
                    { department: "Operations", budget: 200000 },
                    { department: "Sales",      budget: 300000 },
                    { department: "IT",         budget: 180000 },
                    { department: "HR",         budget: 120000 }
                ],
                xAxis: "department",
                yAxis: "budget",
                series: [
                    { dataKey: "budget" }
                ]
            },
            composed: {
                title: "Sales Performance vs Target",
                data: [
                    { month: "Jan", sales: 45000, target: 40000 },
                    { month: "Feb", sales: 52000, target: 48000 },
                    { month: "Mar", sales: 61000, target: 55000 },
                    { month: "Apr", sales: 58000, target: 60000 },
                    { month: "May", sales: 64000, target: 62000 },
                    { month: "Jun", sales: 68000, target: 65000 }
                ],
                xAxis: "month",
                yAxis: "sales",
                series: [
                    { dataKey: "sales" },
                    { dataKey: "target" }
                ]
            }
        };

        const config = chartConfigs[type as keyof typeof chartConfigs]

        return {
            content: `I've created a ${type} chart for you! This visualization demonstrates how ${type} charts can effectively display your data. You can customize the colors, labels, and styling to match your needs.`,
            chartConfig: {
                type,
                title: config.title,
                xAxis: config.xAxis,
                yAxis: config.yAxis,
                series: config.series,
                colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
                showGrid: true,
                showLegend: true,
                width: 800,
                height: 400
            },
            generatedData: config.data,
            suggestions: [
                'Customize the chart colors',
                'Change the chart title',
                'Add your own data',
                'Export for publication'
            ]
        }
    }


    const handleSuggestionClick = (suggestion: string) => {
        setInputValue(suggestion);
    };

    const handleShowEmbed = (config: ChartConfig, data: any[]) => {
        setSelectedChart({ config, data });
        setShowEmbedModal(true);
    };

    const handleExportChart = async (messageId: string, config: ChartConfig, format: 'png' | 'svg') => {
        try {
            if (format === 'svg') {
                await exportChartAsSVG(config.title || 'ai-generated-chart');
                toast.success('Chart exported as SVG successfully!');
            } else {
                await exportChart(config.title || 'ai-generated-chart');
                toast.success('Chart exported as PNG successfully!');
            }
        } catch (error) {
            toast.error(`Failed to export chart as ${format.toUpperCase()}.`);
        }
        setShowExportMenu(null);
    };

    const handleEditInProject = async (config: ChartConfig, data: any[]) => {
        // In development mode, we don't need to check for user authentication
        try {
            // Create a new project with the chart data
            const newProject = await createProject({
                name: config.title || 'AI Generated Chart',
                description: 'Created from AI Assistant',
                createdBy: user?.id || 'dev-user-id',
                collaborators: [user?.id || 'dev-user-id'],
                charts: [{
                    id: Date.now().toString(),
                    name: config.title || 'AI Generated Chart',
                    type: config.type,
                    config: config,
                    data: data,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }],
                datasets: [{
                    id: Date.now().toString(),
                    name: `${config.title || 'AI Generated'} Data`,
                    data: data,
                    columns: Object.keys(data[0] || {}),
                    source: 'ai',
                    createdAt: new Date(),
                    updatedAt: new Date()
                }],
                tags: ['ai-generated'],
                status: 'draft' as const
            });

            toast.success('Project created! Redirecting to editor...');

            // Navigate to the new project
            if (newProject && newProject.id) {
                // navigate(`/projects/${newProject.id}`);
            }
        } catch (error) {
            console.error('Error creating project:', error);
            toast.error('Failed to create project. Please try again.');
        }
    };

    const getInitials = useInitials();

    return (
        <div className="bg-background flex h-full w-full flex-col">
            {/* Chat Messages */}
            <div className="flex-1 space-y-6 overflow-y-auto p-6">
                {messages.map((message, index) => (
                    <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-4xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                            <div className={`flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                <Avatar className="size-8 overflow-hidden rounded-full">
                                    {message.type === 'user' ? (
                                        <AvatarFallback className="bg-primary text-foreground rounded-lg">{getInitials('aamish')}</AvatarFallback>
                                    ) : (
                                        <AvatarFallback className="text-foreground rounded-lg bg-gradient-to-r bg-gradient-from bg-gradient-to">
                                            <Bot className="h-4 w-4" />
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                                {/*<div*/}
                                {/*    className={`flex h-8 w-8 items-center justify-center rounded-full ${*/}
                                {/*        message.type === 'user' ? 'bg-blue-600' : 'bg-gradient-to-r from-purple-500 to-pink-500'*/}
                                {/*    }`}*/}
                                {/*>*/}
                                {/*    {message.type === 'user' ? (*/}
                                {/*        <div className="h-4 w-4 rounded-full bg-white" />*/}
                                {/*    ) : (*/}
                                {/*        <Bot className="h-4 w-4 text-white" />*/}
                                {/*    )}*/}
                                {/*</div>*/}

                                <div className={`min-w-0 flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                                    <div
                                        className={`inline-block rounded-2xl p-4 ${
                                            message.type === 'user'
                                                ? 'bg-primary text-white'
                                                : 'bg-secondary dark:bg-card text-foreground'
                                        }`}
                                    >
                                        <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                                    </div>

                                    {/* Generated Chart */}
                                    {message.chartConfig && message.generatedData && (
                                        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                                            <ChartRenderer data={message.generatedData} config={message.chartConfig} />

                                            {/* Chart Actions */}
                                            {/*<div className="mt-4 flex items-center justify-center space-x-3">*/}
                                            {/*    <button*/}
                                            {/*        onClick={() => handleEditInProject(message.chartConfig!, message.generatedData!)}*/}
                                            {/*        className="flex items-center space-x-2 rounded-lg bg-blue-600 px-3 py-2 text-sm text-white transition-colors duration-200 hover:bg-blue-700"*/}
                                            {/*    >*/}
                                            {/*        <Edit className="h-4 w-4" />*/}
                                            {/*        <span>Edit in Project</span>*/}
                                            {/*    </button>*/}
                                            {/*    <button*/}
                                            {/*        onClick={() => handleShowEmbed(message.chartConfig!, message.generatedData!)}*/}
                                            {/*        className="flex items-center space-x-2 rounded-lg bg-blue-600 px-3 py-2 text-sm text-white transition-colors duration-200 hover:bg-blue-700"*/}
                                            {/*    >*/}
                                            {/*        <Code className="h-4 w-4" />*/}
                                            {/*        <span>Get Embed Code</span>*/}
                                            {/*    </button>*/}
                                            {/*    <div className="relative">*/}
                                            {/*        <button*/}
                                            {/*            onClick={() => setShowExportMenu(showExportMenu === message.id ? null : message.id)}*/}
                                            {/*            className="flex items-center space-x-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"*/}
                                            {/*        >*/}
                                            {/*            <Download className="h-4 w-4" />*/}
                                            {/*            <span>Export</span>*/}
                                            {/*        </button>*/}

                                            {/*        {showExportMenu === message.id && (*/}
                                            {/*            <div className="absolute right-0 z-10 mt-2 w-40 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">*/}
                                            {/*                <button*/}
                                            {/*                    onClick={() => handleExportChart(message.id, message.chartConfig!, 'png')}*/}
                                            {/*                    className="flex w-full items-center space-x-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"*/}
                                            {/*                >*/}
                                            {/*                    <FileImage className="h-4 w-4" />*/}
                                            {/*                    <span>Export as PNG</span>*/}
                                            {/*                </button>*/}
                                            {/*                <button*/}
                                            {/*                    onClick={() => handleExportChart(message.id, message.chartConfig!, 'svg')}*/}
                                            {/*                    className="flex w-full items-center space-x-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"*/}
                                            {/*                >*/}
                                            {/*                    <Code className="h-4 w-4" />*/}
                                            {/*                    <span>Export as SVG</span>*/}
                                            {/*                </button>*/}
                                            {/*            </div>*/}
                                            {/*        )}*/}
                                            {/*    </div>*/}
                                            {/*</div>*/}
                                        </div>
                                    )}

                                    {/* Chart Recommendation */}
                                    {message.chartRecommendation && (
                                        <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
                                            <div className="mb-2 flex items-center space-x-2">
                                                <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                <span className="font-medium text-blue-900 dark:text-blue-200">Chart Recommendation</span>
                                            </div>
                                            <p className="text-sm text-blue-800 capitalize dark:text-blue-300">
                                                <strong>{message.chartRecommendation.type} Chart</strong> - {message.chartRecommendation.reasoning}
                                            </p>
                                        </div>
                                    )}

                                    {/* Suggestions */}
                                    {message.suggestions && (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {message.suggestions.map((suggestion, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleSuggestionClick(suggestion)}
                                                    className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 transition-colors duration-200 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                                >
                                                    {suggestion}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {isTyping && (
                    <div className="flex justify-start">
                        <div className="flex items-start space-x-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                                <Bot className="h-4 w-4 text-white" />
                            </div>
                            <div className="rounded-2xl bg-gray-100 p-4 dark:bg-gray-800">
                                <div className="flex items-center space-x-2">
                                    <Loader2 className="h-4 w-4 animate-spin text-gray-500 dark:text-gray-400" />
                                    <span className="text-sm text-gray-600 dark:text-gray-300">Thinking...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center space-x-4">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                            placeholder="Describe the chart you want to create..."
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-12 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
                            disabled={isTyping}
                        />
                        <button
                            onClick={() => handleSendMessage()}
                            disabled={!inputValue.trim() || isTyping}
                            className="absolute top-1/2 right-2 -translate-y-1/2 transform rounded-lg bg-blue-600 p-2 text-white transition-colors duration-200 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600"
                        >
                            <Send className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                    <Zap className="mr-1 h-3 w-3" />
                    <span>AI Assistant ready! Create charts from descriptions, analyze data, or ask for guidance.</span>
                </div>
            </div>

            {/* Embed Code Modal */}
            {/*{selectedChart && (*/}
            {/*    <EmbedCodeModal*/}
            {/*        isOpen={showEmbedModal}*/}
            {/*        onClose={() => {*/}
            {/*            setShowEmbedModal(false);*/}
            {/*            setSelectedChart(null);*/}
            {/*        }}*/}
            {/*        chartId="demo-chart"*/}
            {/*        chartData={selectedChart.data}*/}
            {/*        chartConfig={selectedChart.config}*/}
            {/*        onCopy={() => notifySuccess('Embed code copied to clipboard!')}*/}
            {/*    />*/}
            {/*)}*/}
        </div>
    );
};
