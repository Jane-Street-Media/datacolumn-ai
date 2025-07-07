import { ChartRenderer } from '@/components/chart-editor/chart-renderer';
import { motion } from 'framer-motion';
import { BarChart3, Bot, Edit, Loader2, Send, Zap } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useInitials } from '@/hooks/use-initials';
import { ChartConfig } from '@/types';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { toast } from 'sonner';
import ExportChart from '@/components/chart-editor/export-chart';
import { ChartEditorProvider } from '@/contexts/chart-editor-context';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  chartRecommendation?: {
    type:
      | 'bar'
      | 'line'
      | 'area'
      | 'pie'
      | 'scatter'
      | 'radar'
      | 'radialBar'
      | 'funnel'
      | 'treemap'
      | 'composed';
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
      content:
        "Hello! I'm your AI assistant for data visualization. I can help you create charts from descriptions. Try saying something like 'Create a bar chart showing monthly sales data.'",
      timestamp: new Date(),
      suggestions: [
        'Create a line chart showing website traffic over time',
        'Generate an area chart for daily temperature variations',
        'Visualize sales data with an area chart',
        'Compare product performance with a composed bar chart',
      ],
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [setShowEmbedModal] = useState(false);
  const [setSelectedChart] = useState<{ config: ChartConfig; data: any[] } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  interface AIResponse {
    identifier: null;
    content: string;
    suggestions?: string[];
    chartRecommendation?: {
      type:
        | 'bar'
        | 'line'
        | 'area'
        | 'pie'
        | 'scatter'
        | 'radar'
        | 'radialBar'
        | 'funnel'
        | 'treemap'
        | 'composed';
      reasoning: string;
    };
    dataInsights?: {
      patterns: string[];
      outliers: string[];
      recommendations: string[];
    };
    chartConfig?: any;
    generatedData?: any[];
  }

  const [identifier, setIdentifier] = useState<string | null>(null);

  const handleSendMessage = async (messageText?: string, forceCreateChart = false) => {
    const text = messageText || inputValue;
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = (
        await axios.post(route('chart-ai.conversation'), {
          message: text,
          identifier: identifier,
          forceCreateChart: forceCreateChart,
        })
      ).data as AIResponse;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions,
        chartRecommendation: response.chartRecommendation,
        dataInsights: response.dataInsights,
        chartConfig: response.chartConfig,
        generatedData: response.generatedData,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIdentifier(response.identifier || null);

      if (response.chartConfig) {
        toast('Successful', {
          description:
            'Chart created successfully! You can customize it further or export it.',
        });
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleEditInProject = async (config: ChartConfig, data: any[]) => {
    const payload = {
      name: config.title,
      description: 'Created from AI Assistant.',
      chart: {
        title: config.title,
        type: config.type,
        description: 'Created from AI Assistant.',
        config: config,
        data: data,
      },
      dataset: {
        name: config.title,
        data: data,
        columns: Object.keys(data[0]),
      },
    };

    router.post(route('project.store'), payload, {
      only: ['flash'],
      preserveScroll: true,
      onSuccess: (response) => {
        router.visit(route('projects.charts.index', response.props.flash.data.id));
        toast.success('🎉 Project Deployed!', {
          id: 'create-project',
          description: `Project "${config.title}" has been successfully set up with its chart and dataset. 📊`,
        });
      },
      onError: (errors) => {
        if (errors.package_restriction) {
          toast.error(errors.package_restriction);
        }
      },
    });
  };

  const getInitials = useInitials();

  const parseChartFromMessage = (message) => {
    return {
      data: message.generatedData,
      config: message.chartConfig,
    };
  };

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
              <div
                className={`flex items-start space-x-3 ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <Avatar className="size-8 overflow-hidden rounded-full">
                  {message.type === 'user' ? (
                    <AvatarFallback className="bg-primary text-foreground rounded-lg">
                      {getInitials('aamish')}
                    </AvatarFallback>
                  ) : (
                    <AvatarFallback className="text-foreground from-gradient-from to-gradient-to rounded-lg bg-gradient-to-r">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  )}
                </Avatar>
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
                      <ChartEditorProvider chart={parseChartFromMessage(message)}>
                        <ChartRenderer />
                      </ChartEditorProvider>
                      <div className="mt-4 flex items-center justify-center space-x-3">
                        <Button
                          onClick={() =>
                            handleEditInProject(message.chartConfig, message.generatedData)
                          }
                        >
                          <Edit className="h-4 w-4" />
                          <span>Edit in Project</span>
                        </Button>
                        <div className="relative">
                          <ExportChart title={message.chartConfig.title} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Chart Recommendation */}
                  {message.chartRecommendation && (
                    <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
                      <div className="mb-2 flex items-center space-x-2">
                        <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="font-medium text-blue-900 dark:text-blue-200">
                          Chart Recommendation
                        </span>
                      </div>
                      <p className="text-sm text-blue-800 capitalize dark:text-blue-300">
                        <strong>{message.chartRecommendation.type} Chart</strong> -{' '}
                        {message.chartRecommendation.reasoning}
                      </p>
                    </div>
                  )}

                  {/* Suggestions */}
                  {message.suggestions && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, idx) => (
                        <Button
                          key={idx}
                          onClick={() => handleSendMessage(suggestion, true)}
                          className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 transition-colors duration-200 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}

                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
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
            <Button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isTyping}
              className="absolute top-1/2 right-2 -translate-y-1/2 transform rounded-lg bg-blue-600 p-2 text-white transition-colors duration-200 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
          <Zap className="mr-1 h-3 w-3" />
          <span>AI Assistant ready! Create charts from descriptions, analyze data, or ask for guidance.</span>
        </div>
      </div>
    </div>
  );
};
