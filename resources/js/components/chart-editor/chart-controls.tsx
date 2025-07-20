import * as React from 'react';
import {
    BarChart,
    LineChart,
    TrendingUp,
    Sun,
    Moon,
    Monitor,
    Layers,
    PieChart,
    Radar,
    Circle,
    GitFork,
    LayoutGrid,
    Target,
    Activity,
    BarChart3,
    BarChart2,
    GitBranch
} from 'lucide-react';
import { CustomChartConfig } from '../../pages/charts/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ColorPicker } from "@/components/color-picker";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useChartEditor } from '@/contexts/chart-editor-context';

const chartTypes = [
    { type: 'bar' as const, label: 'Bar Chart', icon: BarChart },
    { type: 'line' as const, label: 'Line Chart', icon: LineChart },
    { type: 'area' as const, label: 'Area Chart', icon: TrendingUp },
    { type: 'pie' as const, label: 'Pie Chart', icon: PieChart },
    { type: 'scatter' as const, label: 'Scatter Plot', icon: Target },
    { type: 'radar' as const, label: 'Radar Chart', icon: Radar },
    { type: 'radialBar' as const, label: 'Radial Bar', icon: Circle },
    { type: 'funnel' as const, label: 'Funnel Chart', icon: GitFork },
    { type: 'treemap' as const, label: 'Treemap', icon: LayoutGrid },
    { type: 'composed' as const, label: 'Composed', icon: Layers },
    { type: 'stackedBar' as const, label: 'Stacked Bar', icon: BarChart2 },
    { type: 'stackedArea' as const, label: 'Stacked Area', icon: Activity },
    { type: 'waterfall' as const, label: 'Waterfall', icon: GitBranch },
];

const colorSchemes = [
    ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
    ['#1e40af', '#059669', '#d97706', '#dc2626', '#7c3aed'],
    ['#0ea5e9', '#06b6d4', '#84cc16', '#eab308', '#f97316'],
    ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16'],
    ['#8b5cf6', '#a855f7', '#c084fc', '#ddd6fe', '#e9d5ff'],
    ['#06b6d4', '#0891b2', '#0e7490', '#155e75', '#164e63'],
];

const tooltipFormats = [
    { value: 'default', label: 'Default' },
    { value: 'currency', label: 'Currency ($)' },
    { value: 'percentage', label: 'Percentage (%)' },
    { value: 'decimal', label: 'Decimal (0.00)' },
    { value: 'thousands', label: 'Thousands (K)' },
    { value: 'millions', label: 'Millions (M)' },
    { value: 'custom', label: 'Custom Format' },
];

const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
];

const alignments = [
    { value: 'left', label: 'Left' },
    { value: 'center', label: 'Center' },
    { value: 'right', label: 'Right' }
];

const fontWeights = [
    { value: 'normal', label: 'Regular' },
    { value: 'bold', label: 'Bold' },
    { value: 'light', label: 'Light' },
    { value: 'semibold', label: 'Semi Bold' }
];

const legendPositions = [
    { value: 'top', label: 'Top' },
    { value: 'bottom', label: 'Bottom' },
    { value: 'left', label: 'Left' },
    { value: 'right', label: 'Right' }
];

const animationTypes = [
    { value: 'ease', label: 'Ease' },
    { value: 'ease-in', label: 'Ease In' },
    { value: 'ease-out', label: 'Ease Out' },
    { value: 'ease-in-out', label: 'Ease In Out' },
    { value: 'linear', label: 'Linear' }
];

interface ChartControlsProps {
    cardContentClasses?: string;
}

const defaultCardContentClasses = {
    default: 'max-h-[calc(100vh-300px)] lg:max-h-[calc(100vh-200px)]',
};

export const ChartControls: React.FC<ChartControlsProps> = ({cardContentClasses = defaultCardContentClasses,}) => {
    const { config, setConfig, columns, data, setData, setColumns} = useChartEditor();

    // Chart-specific sample data
    const getSampleDataForChartType = (chartType: string) => {
        switch (chartType) {
            case 'bar':
            case 'line':
            case 'area':
                return {
                    columns: ['Month', 'Sales', 'Profit'],
                    data: [
                        { Month: 'Jan', Sales: 1200, Profit: 300 },
                        { Month: 'Feb', Sales: 1900, Profit: 450 },
                        { Month: 'Mar', Sales: 800, Profit: 200 },
                        { Month: 'Apr', Sales: 1700, Profit: 400 },
                        { Month: 'May', Sales: 2100, Profit: 500 },
                        { Month: 'Jun', Sales: 1500, Profit: 350 }
                    ]
                };
            
            case 'stackedBar':
            case 'stackedArea':
                return {
                    columns: ['Quarter', 'Product A', 'Product B', 'Product C'],
                    data: [
                        { Quarter: 'Q1', 'Product A': 400, 'Product B': 300, 'Product C': 200 },
                        { Quarter: 'Q2', 'Product A': 500, 'Product B': 250, 'Product C': 300 },
                        { Quarter: 'Q3', 'Product A': 300, 'Product B': 400, 'Product C': 250 },
                        { Quarter: 'Q4', 'Product A': 600, 'Product B': 350, 'Product C': 400 }
                    ]
                };

            case 'pie':
            case 'funnel':
                return {
                    columns: ['Category', 'Value'],
                    data: [
                        { Category: 'Desktop', Value: 45 },
                        { Category: 'Mobile', Value: 35 },
                        { Category: 'Tablet', Value: 20 }
                    ]
                };

            case 'scatter':
                return {
                    columns: ['Height', 'Weight'],
                    data: [
                        { Height: 160, Weight: 55 },
                        { Height: 165, Weight: 60 },
                        { Height: 170, Weight: 65 },
                        { Height: 175, Weight: 70 },
                        { Height: 180, Weight: 75 },
                        { Height: 185, Weight: 80 }
                    ]
                };

            case 'radar':
                return {
                    columns: ['Skill', 'John', 'Jane', 'Mike'],
                    data: [
                        { Skill: 'Speed', John: 8, Jane: 6, Mike: 9 },
                        { Skill: 'Strength', John: 7, Jane: 8, Mike: 6 },
                        { Skill: 'Agility', John: 9, Jane: 7, Mike: 8 },
                        { Skill: 'Endurance', John: 6, Jane: 9, Mike: 7 },
                        { Skill: 'Intelligence', John: 8, Jane: 9, Mike: 7 }
                    ]
                };

            case 'radialBar':
                return {
                    columns: ['Metric', 'Score'],
                    data: [
                        { Metric: 'Performance', Score: 85 },
                        { Metric: 'Quality', Score: 92 },
                        { Metric: 'Efficiency', Score: 78 },
                        { Metric: 'Satisfaction', Score: 88 }
                    ]
                };

            case 'waterfall':
                return {
                    columns: ['Stage', 'Amount'],
                    data: [
                        { Stage: 'Starting', Amount: 1000 },
                        { Stage: 'Q1 Sales', Amount: 500 },
                        { Stage: 'Q1 Costs', Amount: -200 },
                        { Stage: 'Q2 Sales', Amount: 300 },
                        { Stage: 'Q2 Costs', Amount: -150 },
                        { Stage: 'Q3 Sales', Amount: 400 },
                        { Stage: 'Q3 Costs', Amount: -100 }
                    ]
                };

            case 'treemap':
                return {
                    columns: ['Region', 'Sales'],
                    data: [
                        { Region: 'North America', Sales: 2500 },
                        { Region: 'Europe', Sales: 1800 },
                        { Region: 'Asia Pacific', Sales: 2200 },
                        { Region: 'Latin America', Sales: 900 },
                        { Region: 'Middle East', Sales: 600 },
                        { Region: 'Africa', Sales: 400 }
                    ]
                };

            case 'composed':
                return {
                    columns: ['Month', 'Revenue', 'Users', 'Conversion'],
                    data: [
                        { Month: 'Jan', Revenue: 4000, Users: 240, Conversion: 16.7 },
                        { Month: 'Feb', Revenue: 3000, Users: 198, Conversion: 15.1 },
                        { Month: 'Mar', Revenue: 5000, Users: 300, Conversion: 16.7 },
                        { Month: 'Apr', Revenue: 4500, Users: 278, Conversion: 16.2 },
                        { Month: 'May', Revenue: 6000, Users: 350, Conversion: 17.1 },
                        { Month: 'Jun', Revenue: 5500, Users: 325, Conversion: 16.9 }
                    ]
                };

            default:
                return {
                    columns: ['Category', 'Value'],
                    data: [
                        { Category: 'A', Value: 400 },
                        { Category: 'B', Value: 300 },
                        { Category: 'C', Value: 200 },
                        { Category: 'D', Value: 278 }
                    ]
                };
        }
    };

    const loadSampleData = (chartType: string) => {
        const sampleData = getSampleDataForChartType(chartType);
        setColumns(sampleData.columns);
        setData(sampleData.data);
        
        toast.success(`Loaded sample data for ${chartTypes.find(ct => ct.type === chartType)?.label || chartType}`);
    };

    // Define chart type categories for better handling
    const singleSeriesCharts = ['pie', 'radialBar', 'funnel', 'treemap'];
    const multiSeriesCharts = ['composed', 'stackedBar', 'stackedArea', 'radar'];
    const axisBasedCharts = ['bar', 'line', 'area', 'scatter', 'composed', 'stackedBar', 'stackedArea', 'waterfall'];

    const handleChartTypeChange = (type: CustomChartConfig['type']) => {
        if (type === '') {
            return;
        }
        
        // Auto-load sample data if no data exists
        const hasData = data && data.length > 0;
        const shouldLoadSample = !hasData;
        
        // Handle single series charts (pie, radialBar, funnel, treemap)
        if (singleSeriesCharts.includes(type)) {
            setConfig({
                ...config,
                type: type,
                series: config.series.length ? [config.series[0]] : []
            });
            
            if (shouldLoadSample) {
                loadSampleData(type);
                return;
            }
            return;
        }
        
        // Handle multi-series charts (composed, stackedBar, stackedArea, radar)
        if (multiSeriesCharts.includes(type)) {
            setConfig({
                ...config,
                type: type,
                // Keep existing series for multi-series charts, but ensure at least one
                series: config.series.length ? config.series : []
            });
            
            if (shouldLoadSample) {
                loadSampleData(type);
                return;
            }
            return;
        }
        
        // Handle single series axis-based charts (bar, line, area, scatter, waterfall)
        if (['bar', 'line', 'area', 'scatter', 'waterfall'].includes(type)) {
            setConfig({
                ...config,
                type: type,
                series: config.series.length ? [config.series[0]] : []
            });
            
            if (shouldLoadSample) {
                loadSampleData(type);
                return;
            }
            return;
        }

        // Default case
        setConfig({...config, type });
        if (shouldLoadSample) {
            loadSampleData(type);
        }
    }

    const seriesColumns = useMemo(
        () => columns.filter(col => col !== config.xAxis),
        [columns, config.xAxis]
    );

    const addSeries = (value: string) => {
        if (config.series.some(sery => sery.dataKey === value)) {
            return;
        }
        
        const defaultSeriesConfig = {
            dataKey: value,
            chartType: getDefaultChartTypeForSeries(config.type),
            type: 'monotone',
            fill: getNextColor(),
            stroke: getNextColor(),
        };

        // Multi-series charts can have multiple series
        if (multiSeriesCharts.includes(config.type)) {
            setConfig({
                ...config,
                series: [...config.series, defaultSeriesConfig]
            });
        } else {
            // Single series charts replace existing series
            setConfig({
                ...config,
                series: [defaultSeriesConfig]
            });
        }
    }

    const getDefaultChartTypeForSeries = (chartType: string) => {
        switch (chartType) {
            case 'bar':
            case 'stackedBar':
                return 'bar';
            case 'line':
                return 'line';
            case 'area':
            case 'stackedArea':
                return 'area';
            case 'scatter':
                return 'scatter';
            case 'pie':
                return 'pie';
            case 'radar':
                return 'radar';
            case 'radialBar':
                return 'radialBar';
            case 'funnel':
                return 'funnel';
            case 'treemap':
                return 'treemap';
            case 'waterfall':
                return 'bar'; // Waterfall typically uses bar-like rendering
            case 'composed':
            default:
                return 'line';
        }
    };

    const getNextColor = () => {
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
        return colors[config.series.length % colors.length];
    };

    const updateSeries = (data: {
        itemIndex: number;
        itemValue: Partial<CustomChartConfig['series'][number]>;
    }) => {
        const updatedSeries = [...config.series];

        // Handle color management more intelligently
        const currentSeries = updatedSeries[data.itemIndex];
        const oldColorValue = currentSeries.fill || currentSeries.stroke || getNextColor();
        
        // For line charts, prefer stroke; for others, prefer fill
        if (data.itemValue.chartType === 'line') {
            updatedSeries[data.itemIndex] = {
                ...currentSeries,
                ...data.itemValue,
                stroke: data.itemValue.stroke || oldColorValue,
                fill: undefined // Remove fill for line charts
            };
        } else {
            updatedSeries[data.itemIndex] = {
                ...currentSeries,
                ...data.itemValue,
                fill: data.itemValue.fill || oldColorValue,
                stroke: data.itemValue.stroke || oldColorValue
            };
        }

        setConfig({
            ...config,
            series: updatedSeries
        })
    };

    const removeSeries = (index: number) => {
        const updatedSeries = [...config.series];
        updatedSeries.splice(index, 1);
        setConfig({
            ...config,
            series: updatedSeries
        })
    };

    // Use the categorized chart types
    const isAxisBasedChart = axisBasedCharts.includes(config.type);
    const isMultiSeriesChart = multiSeriesCharts.includes(config.type);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Chart Configuration</CardTitle>
            </CardHeader>
            <CardContent
                className={`h-full space-y-6 overflow-y-auto ${typeof cardContentClasses !== 'object' ? cardContentClasses : cardContentClasses?.default}`}
            >
                {/* Chart Type */}
                <div>
                    <h4 className="mb-3 text-sm font-semibold">Chart Type</h4>
                    <ToggleGroup
                        type="single"
                        value={config.type}
                        onValueChange={(val) => handleChartTypeChange(val)}
                        className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                    >
                        {chartTypes.map(({ type, label, icon: Icon }) => (
                            <ToggleGroupItem 
                                key={type} 
                                value={type} 
                                className="flex flex-col items-center space-y-1 rounded-lg border py-3 px-2 min-h-[60px] text-center"
                            >
                                <Icon className="h-4 w-4 flex-shrink-0" />
                                <span className="text-xs font-medium leading-tight">{label}</span>
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                </div>

                {/* Theme Selection */}
                <div>
                    <h4 className="mb-3 text-sm font-semibold">Chart Theme</h4>
                    <ToggleGroup
                        type="single"
                        value={config.theme}
                        onValueChange={(val) => setConfig({...config, theme: val as any })}
                        className="grid grid-cols-2 gap-2 sm:grid-cols-3"
                    >
                        {themes.map(({ value, label, icon: Icon }) => (
                            <ToggleGroupItem key={value} value={value} className="flex flex-1 items-center space-x-2 rounded-lg border py-2">
                                <Icon className="h-4 w-4" />
                                <span className="text-sm font-medium">{label}</span>
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                </div>

                {/* Background Color */}
                <div>
                    <h4 className="mb-3 text-sm font-semibold">Background Color</h4>
                    <RadioGroup
                        value={config.backgroundColor ?? 'default'}
                        onValueChange={(value) => setConfig({...config, backgroundColor: value as any })}
                    >
                        <div className="flex items-center gap-3">
                            <RadioGroupItem id="default" value="default"></RadioGroupItem>
                            <label className="text-sm font-medium cursor-pointer" htmlFor="default">
                                Default (Theme Based)
                            </label>
                        </div>
                        <div className="flex items-center gap-3">
                            <RadioGroupItem id="transparent" value="transparent" />
                            <label className="text-sm font-medium cursor-pointer" htmlFor="transparent">
                                Transparent
                            </label>
                        </div>
                        <div className="flex items-center gap-3">
                            <RadioGroupItem id="custom" value="custom" />
                            <label className="text-sm font-medium cursor-pointer" htmlFor="custom">
                                Custom Color
                            </label>
                        </div>
                    </RadioGroup>
                    {config.backgroundColor && !['default', 'transparent'].includes(config.backgroundColor) && (
                        <div className="flex items-center space-x-2 py-2">
                            <ColorPicker value={config.backgroundColor} onChange={(val) => setConfig({...config, backgroundColor: val })} />
                            <Input
                                value={config.backgroundColor}
                                onChange={(e) => setConfig({...config, backgroundColor: e.target.value })}
                                placeholder="#ffffff"
                            />
                        </div>
                    )}
                </div>

                {/* Title Settings */}
                <div className="space-y-4">
                    <h4 className="mb-3 text-sm font-semibold">Title Settings</h4>

                    {/* Chart Title */}
                    <Input value={config.title} onChange={(e) => setConfig({...config, title: e.target.value })} placeholder="Enter chart title" />

                    {/* Title Alignment */}
                    <ToggleGroup
                        type="single"
                        value={config.titleAlignment}
                        onValueChange={(val) => setConfig({...config, titleAlignment: val as any })}
                        className="grid grid-cols-2 gap-2 sm:grid-cols-3"
                    >
                        {alignments.map(({ value, label }) => (
                            <ToggleGroupItem key={value} value={value} className="flex flex-1 items-center space-x-2 rounded-lg border py-2">
                                <span className="text-sm font-medium">{label}</span>
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>

                    {/* Title Color */}
                    <div className="flex items-center space-x-3">
                        <ColorPicker value={config.titleColor} onChange={(val) => setConfig({...config, titleColor: val })} />
                        <Input value={config.titleColor} onChange={(e) => setConfig({...config, titleColor: e.target.value })} placeholder="#000000" />
                    </div>

                    {/* Title Weight */}
                    <ToggleGroup
                        type="single"
                        value={config.titleWeight}
                        onValueChange={(val) => setConfig({...config, titleWeight: val as any })}
                        className="grid grid-cols-2 gap-2 sm:grid-cols-4"
                    >
                        {fontWeights.map(({ value, label }) => (
                            <ToggleGroupItem key={value} value={value} className="flex flex-1 items-center space-x-2 rounded-lg border py-2">
                                <span className="text-sm font-medium">{label}</span>
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>

                    {/* Subtitle */}
                    <Input
                        value={config.subtitle}
                        onChange={(e) => setConfig({...config, subtitle: e.target.value })}
                        placeholder="Enter subtitle (optional)"
                    />
                    <div className="flex items-center space-x-3">
                        <ColorPicker value={config.subtitleColor} onChange={(val) => setConfig({...config, subtitleColor: val })} />
                        <Input value={config.subtitleColor} onChange={(e) => setConfig({...config, subtitleColor: e.target.value })} placeholder="#666666" />
                    </div>
                </div>

                {/* Axis Configuration */}
                {isAxisBasedChart && (
                    <div className="space-y-4">
                        <h4 className="mb-3 text-sm font-semibold">Axis Configuration</h4>
                        <Select value={config.xAxis} onValueChange={(val) => setConfig({...config, xAxis: val })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select X axis column" />
                            </SelectTrigger>
                            <SelectContent>
                                {columns.map((col) => (
                                    <SelectItem key={col} value={col}>
                                        {col}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Input
                            value={config.xAxisLabel || ''}
                            onChange={(e) => setConfig({...config, xAxisLabel: e.target.value })}
                            placeholder="Enter X-axis label (optional)"
                        />

                        <Input
                            value={config.yAxisLabel || ''}
                            onChange={(e) => setConfig({...config, yAxisLabel: e.target.value })}
                            placeholder="Enter Y-axis label (optional)"
                        />

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold">Data to Chart</h4>
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => loadSampleData(config.type)}
                                    className="text-xs"
                                >
                                    Load Sample Data
                                </Button>
                            </div>
                            <Select onValueChange={(value) => addSeries(value)} className={'w-full'}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Data Column" />
                                </SelectTrigger>
                                <SelectContent className="w-full">
                                    {seriesColumns.map((column, index) => (
                                        <SelectItem key={index} value={column}>
                                            {column}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {config.series.map((yaxis, yaxisIndex) => (
                                <div key={yaxisIndex} className="space-y-3 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800/50 relative">
                                    {/* Remove button - positioned absolutely */}
                                    <button
                                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold hover:bg-red-600 flex items-center justify-center"
                                        onClick={() => removeSeries(yaxisIndex)}
                                        aria-label={`Remove ${yaxis.dataKey} series`}
                                    >
                                        ×
                                    </button>

                                    {/* Series name */}
                                    <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 pr-8">
                                        {yaxis.dataKey} Configuration
                                    </h5>

                                    {/* Chart type selector for composed charts */}
                                    {config.type === 'composed' && (
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                Chart Type
                                            </label>
                                            <Select
                                                value={yaxis.chartType}
                                                onValueChange={(val) => updateSeries({ itemIndex: yaxisIndex, itemValue: {chartType: val}})}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select Series Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {chartTypes.filter(chartType => 
                                                        ['bar', 'line', 'area', 'scatter'].includes(chartType.type)
                                                    ).map(({ type, label }) => (
                                                        <SelectItem key={type} value={type}>
                                                            {label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}

                                    {/* Color controls */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                Fill Color
                                            </label>
                                            <div className="flex items-center space-x-2">
                                                <ColorPicker
                                                    value={yaxis.fill}
                                                    onChange={(val) => updateSeries({ itemIndex: yaxisIndex, itemValue: {fill: val}})}
                                                />
                                                <Input
                                                    value={yaxis.fill || ''}
                                                    onChange={(e) => updateSeries({ itemIndex: yaxisIndex, itemValue: {fill: e.target.value}})}
                                                    placeholder="#3b82f6"
                                                    className="text-xs"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                Stroke Color
                                            </label>
                                            <div className="flex items-center space-x-2">
                                                <ColorPicker
                                                    value={yaxis.stroke}
                                                    onChange={(val) => updateSeries({ itemIndex: yaxisIndex, itemValue: {stroke: val}})}
                                                />
                                                <Input
                                                    value={yaxis.stroke || ''}
                                                    onChange={(e) => updateSeries({ itemIndex: yaxisIndex, itemValue: {stroke: e.target.value}})}
                                                    placeholder="#3b82f6"
                                                    className="text-xs"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Non-axis based chart configuration (pie, radar, etc.) */}
                {!isAxisBasedChart && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold">Data to Chart</h4>
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => loadSampleData(config.type)}
                                className="text-xs"
                            >
                                Load Sample Data
                            </Button>
                        </div>
                        <Select onValueChange={(value) => addSeries(value)} className={'w-full'}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Data Column" />
                            </SelectTrigger>
                            <SelectContent className="w-full">
                                {columns.map((column, index) => (
                                    <SelectItem key={index} value={column}>
                                        {column}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {config.series.map((series, seriesIndex) => (
                            <div key={seriesIndex} className="space-y-3 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800/50 relative">
                                {/* Remove button */}
                                <button
                                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold hover:bg-red-600 flex items-center justify-center"
                                    onClick={() => removeSeries(seriesIndex)}
                                    aria-label={`Remove ${series.dataKey} series`}
                                >
                                    ×
                                </button>

                                {/* Series name */}
                                <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 pr-8">
                                    {series.dataKey} Configuration
                                </h5>

                                {/* Color controls */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                        Color
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <ColorPicker
                                            value={series.fill || series.stroke}
                                            onChange={(val) => updateSeries({ itemIndex: seriesIndex, itemValue: {fill: val, stroke: val}})}
                                        />
                                        <Input
                                            value={series.fill || series.stroke || ''}
                                            onChange={(e) => updateSeries({ itemIndex: seriesIndex, itemValue: {fill: e.target.value, stroke: e.target.value}})}
                                            placeholder="#3b82f6"
                                            className="text-xs"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Animation Settings */}
                <div className="space-y-4">
                    <h4 className="mb-3 text-sm font-semibold">Animation Settings</h4>
                    <div className="flex items-center gap-3">
                        <Checkbox 
                            id="enableAnimation" 
                            checked={config.enableAnimation !== false} 
                            onCheckedChange={(checked) => setConfig({...config, enableAnimation: !!checked })} 
                        />
                        <label className="text-sm font-medium cursor-pointer" htmlFor="enableAnimation">
                            Enable Animation
                        </label>
                    </div>
                    
                    {config.enableAnimation !== false && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-2">Animation Duration (ms)</label>
                                <Input
                                    type="number"
                                    value={config.animationDuration || 1000}
                                    onChange={(e) => setConfig({...config, animationDuration: parseInt(e.target.value) || 1000 })}
                                    min={100}
                                    max={5000}
                                    placeholder="1000"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-2">Animation Type</label>
                                <Select 
                                    value={config.animationType || 'ease'} 
                                    onValueChange={(val) => setConfig({...config, animationType: val as any })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {animationTypes.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </>
                    )}
                </div>

                {/* Legend Settings */}
                <div className="space-y-4">
                    <h4 className="mb-3 text-sm font-semibold">Legend Settings</h4>
                    <div className="flex items-center gap-3">
                        <Checkbox
                            id="showLegend"
                            checked={config.showLegend}
                            onCheckedChange={(checked) => setConfig({...config, showLegend: !!checked })}
                        />
                        <label className="text-sm font-medium cursor-pointer" htmlFor="showLegend">
                            Show Legend
                        </label>
                    </div>
                    
                    {config.showLegend && (
                        <div>
                            <label className="block text-sm font-medium mb-2">Legend Position</label>
                            <ToggleGroup
                                type="single"
                                value={config.legendPosition || 'bottom'}
                                onValueChange={(val) => setConfig({...config, legendPosition: val as any })}
                                className="grid grid-cols-2 gap-2 sm:grid-cols-4"
                            >
                                {legendPositions.map(({ value, label }) => (
                                    <ToggleGroupItem key={value} value={value} className="flex flex-1 items-center space-x-2 rounded-lg border py-2">
                                        <span className="text-sm font-medium">{label}</span>
                                    </ToggleGroupItem>
                                ))}
                            </ToggleGroup>
                        </div>
                    )}
                </div>

                {/* Color Schemes */}
                <div>
                    <h4 className="mb-3 text-sm font-semibold">Color Scheme</h4>
                    <div className="space-y-2">
                        {colorSchemes.map((scheme, index) => (
                            <button
                                key={index}
                                onClick={() => setConfig({...config, colors: scheme })}
                                className={`flex items-center space-x-3 w-full p-3 rounded-lg border transition-all duration-200 ${
                                    JSON.stringify(config.colors) === JSON.stringify(scheme)
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                } min-h-[48px]`}
                            >
                                <div className="flex space-x-1 flex-shrink-0">
                                    {scheme.map((color, colorIndex) => (
                                        <div
                                            key={colorIndex}
                                            className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-600 flex-shrink-0"
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                    Scheme {index + 1}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Padding Options */}
                <div className="space-y-4">
                    <h4 className="mb-3 text-sm font-semibold">Padding Options</h4>
                    <RadioGroup value={config.paddingOption} onValueChange={(value) => setConfig({...config, paddingOption: value as any })}>
                        <div className="flex items-center gap-2">
                            <RadioGroupItem id="default" value="default" />
                            <label className="text-sm font-medium cursor-pointer" htmlFor="default">
                                Default
                            </label>
                        </div>
                        <div className="flex items-center gap-2">
                            <RadioGroupItem id="none" value="none" />
                            <label className="text-sm font-medium cursor-pointer" htmlFor="none">
                                None
                            </label>
                        </div>
                        <div className="flex items-center gap-2">
                            <RadioGroupItem id="custom" value="custom" />
                            <label className="text-sm font-medium cursor-pointer" htmlFor="custom">
                                Custom
                            </label>
                        </div>
                    </RadioGroup>
                    {config.paddingOption === 'custom' && (
                        <Input
                            type="number"
                            value={config.customPaddingValue || 0}
                            onChange={(e) => setConfig({...config, customPaddingValue: parseInt(e.target.value) || 0 })}
                            placeholder="Padding value (px)"
                        />
                    )}
                </div>

                {/* Tooltip Settings */}
                <div className="space-y-4">
                    <h4 className="mb-3 text-sm font-semibold">Tooltip Settings</h4>
                    <Select value={config.tooltipFormat || 'default'} onValueChange={(val) => setConfig({...config, tooltipFormat: val as any })}>
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {tooltipFormats.map((fmt) => (
                                <SelectItem key={fmt.value} value={fmt.value}>
                                    {fmt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {config.tooltipFormat === 'custom' && (
                        <Input
                            value={config.tooltipCustomFormat || ''}
                            onChange={(e) => setConfig({...config, tooltipCustomFormat: e.target.value })}
                            placeholder="e.g., ${value} (use {value} as placeholder)"
                        />
                    )}
                </div>

                {/* Display Options */}
                <div className="space-y-3">
                    <h4 className="mb-3 text-sm font-semibold">Display Options</h4>
                    <div className="flex items-center gap-3">
                        <Checkbox id="showGrid" checked={config.showGrid} onCheckedChange={(checked) => setConfig({...config, showGrid: !!checked })} />
                        <label className="text-sm font-medium cursor-pointer" htmlFor="showGrid">
                            Show Grid
                        </label>
                    </div>
                    {isAxisBasedChart && (
                        <>
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="showXAxis"
                                    checked={config.showXAxis}
                                    onCheckedChange={(checked) => setConfig({...config, showXAxis: !!checked })}
                                />
                                <label className="text-sm font-medium cursor-pointer" htmlFor="showXAxis">
                                    Show X-Axis Line
                                </label>
                            </div>
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="showYAxis"
                                    checked={config.showYAxis}
                                    onCheckedChange={(checked) => setConfig({...config, showYAxis: !!checked })}
                                />
                                <label className="text-sm font-medium cursor-pointer" htmlFor="showYAxis">
                                    Show Y-Axis Line
                                </label>
                            </div>
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="showCartesianGrid"
                                    checked={config.showCartesianGrid !== false}
                                    onCheckedChange={(checked) => setConfig({...config, showCartesianGrid: !!checked })}
                                />
                                <label className="text-sm font-medium cursor-pointer" htmlFor="showCartesianGrid">
                                    Show Cartesian Grid
                                </label>
                            </div>
                        </>
                    )}
                    <div className="flex items-center gap-3">
                        <Checkbox
                            id="showTooltip"
                            checked={config.showTooltip !== false}
                            onCheckedChange={(checked) => setConfig({...config, showTooltip: !!checked })}
                        />
                        <label className="text-sm font-medium cursor-pointer" htmlFor="showTooltip">
                            Show Tooltip
                        </label>
                    </div>
                </div>

                {/* Dimensions */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h4 className="mb-2 text-sm font-medium">Width</h4>
                        <Input
                            type="number"
                            value={config.width}
                            onChange={(e) => setConfig({...config, width: parseInt(e.target.value) || 800 })}
                            min={300}
                            max={1200}
                        />
                    </div>
                    <div>
                        <h4 className="mb-2 text-sm font-medium">Height</h4>
                        <Input
                            type="number"
                            value={config.height}
                            onChange={(e) => setConfig({...config, height: parseInt(e.target.value) || 600 })}
                            min={200}
                            max={800}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
