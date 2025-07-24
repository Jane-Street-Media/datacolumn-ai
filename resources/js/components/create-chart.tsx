import {
    BarChart
} from 'lucide-react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ChartRenderer } from '@/components/chart-editor/chart-renderer';
import React, { useState, useEffect } from 'react';
import { ChartEditorProvider } from '@/contexts/chart-editor-context';
import { useAppearanceContext } from '@/contexts/appearance-context';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';

export const chartConfigs: (ChartConfig & {
    data: any[];
    titleFontSize: number;
    subtitleFontSize: number;
    xAxisLabelFontSize: number;
    yAxisLabelFontSize: number;
})[] = [
    // 1. Bar Chart
    {
        type: 'bar',
        title: 'Sample Bar Chart',
        titleAlignment: 'center',
        titleColor: '#333333',
        titleWeight: 'bold',
        titleFontSize: 14,
        subtitle: 'Bar Chart Example',
        subtitleColor: '#666666',
        subtitleFontSize: 12,
        xAxis: 'category',
        yAxis: 'value',
        xAxisLabel: 'Category',
        yAxisLabel: 'Value',
        xAxisLabelFontSize: 10,
        yAxisLabelFontSize: 10,
        series: [{ dataKey: 'value', name: 'Value' }],
        tooltipFormat: 'default',
        showTooltip: true,
        colors: ['#8884d8', '#82ca9d', '#ffc658'],
        showGrid: true,
        grid: { vertical: true, horizontal: true, stroke: '#e0e0e0', strokeDasharray: '3 3', fill: '#fafafa', strokeWidth: 1 },
        showLegend: false,
        legendPosition: 'bottom',
        showXAxis: true,
        showYAxis: true,
        showCartesianGrid: true,
        width: 400,
        height: 250,
        paddingOption: 'small',
        theme: 'light',
        backgroundColor: 'default',
        enableAnimation: true,
        animationDuration: 500,
        animationType: 'ease-out',
        data: Array.from({ length: 6 }, (_, i) => ({
            category: `Item ${i + 1}`,
            value: Math.round(30 + Math.random() * 60)
        })),
    },

    // 2. Line Chart
    {
        type: 'line',
        title: 'Sample Line Chart',
        titleAlignment: 'left',
        titleColor: '#222222',
        titleWeight: 'semibold',
        titleFontSize: 14,
        subtitle: 'Line Chart Example',
        subtitleColor: '#555555',
        subtitleFontSize: 12,
        xAxis: 'category',
        yAxis: 'value',
        xAxisLabel: 'Point',
        yAxisLabel: 'Value',
        xAxisLabelFontSize: 10,
        yAxisLabelFontSize: 10,
        series: [{ dataKey: 'value', name: 'Value' }],
        tooltipFormat: 'decimal',
        showTooltip: true,
        colors: ['#82ca9d'],
        showGrid: true,
        grid: { vertical: true, horizontal: false, stroke: '#e0e0e0', strokeDasharray: '3 3', fill: '#fafafa', strokeWidth: 1 },
        showLegend: false,
        legendPosition: 'bottom',
        showXAxis: true,
        showYAxis: true,
        showCartesianGrid: true,
        width: 400,
        height: 250,
        paddingOption: 'small',
        theme: 'light',
        backgroundColor: 'default',
        enableAnimation: true,
        animationDuration: 400,
        animationType: 'ease-in-out',
        data: Array.from({ length: 6 }, (_, i) => ({
            category: `P${i + 1}`,
            value: Math.round(20 + Math.random() * 70)
        })),
    },

    // 3. Area Chart
    {
        type: 'area',
        title: 'Sample Area Chart',
        titleAlignment: 'center',
        titleColor: '#333333',
        titleWeight: 'bold',
        titleFontSize: 14,
        subtitle: 'Area Chart Example',
        subtitleColor: '#666666',
        subtitleFontSize: 12,
        xAxis: 'category',
        yAxis: 'value',
        xAxisLabel: 'Point',
        yAxisLabel: 'Value',
        xAxisLabelFontSize: 10,
        yAxisLabelFontSize: 10,
        series: [{ dataKey: 'value', name: 'Value' }],
        tooltipFormat: 'decimal',
        showTooltip: true,
        colors: ['#8884d8'],
        showGrid: true,
        grid: { vertical: false, horizontal: true, stroke: '#e0e0e0', strokeDasharray: '3 3', fill: '#fafafa', strokeWidth: 1 },
        showLegend: false,
        legendPosition: 'bottom',
        showXAxis: true,
        showYAxis: true,
        showCartesianGrid: true,
        width: 400,
        height: 250,
        paddingOption: 'small',
        theme: 'light',
        backgroundColor: 'default',
        enableAnimation: true,
        animationDuration: 600,
        animationType: 'ease-out',
        data: Array.from({ length: 6 }, (_, i) => ({
            category: `P${i + 1}`,
            value: Math.round(25 + Math.random() * 65)
        })),
    },

    // 4. Pie Chart
    {
        type: 'pie',
        title: 'Sample Pie Chart',
        titleAlignment: 'center',
        titleColor: '#333333',
        titleWeight: 'bold',
        titleFontSize: 14,
        subtitle: 'Pie Chart Example',
        subtitleColor: '#666666',
        subtitleFontSize: 12,
        xAxis: '',
        yAxis: '',
        xAxisLabel: '',
        yAxisLabel: '',
        xAxisLabelFontSize: 0,
        yAxisLabelFontSize: 0,
        series: [{ dataKey: 'value', name: 'Value' }],
        tooltipFormat: 'percentage',
        showTooltip: true,
        colors: ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'],
        showGrid: false,
        grid: { vertical: false, horizontal: false, stroke: '#e0e0e0', strokeDasharray: '3 3', fill: '#fafafa', strokeWidth: 1 },
        showLegend: true,
        legendPosition: 'right',
        showXAxis: false,
        showYAxis: false,
        showCartesianGrid: false,
        width: 400,
        height: 250,
        paddingOption: 'small',
        theme: 'light',
        backgroundColor: 'transparent',
        enableAnimation: true,
        animationDuration: 700,
        animationType: 'ease-in',
        innerRadius: 50,
        outerRadius: 70,
        startAngle: 0,
        endAngle: 360,
        data: Array.from({ length: 4 }, (_, i) => ({
            name: `Slice ${i + 1}`,
            value: Math.round(20 + Math.random() * 60)
        })),
    },

    // 5. Scatter Plot
    {
        type: 'scatter',
        title: 'Sample Scatter Plot',
        titleAlignment: 'left',
        titleColor: '#222222',
        titleWeight: 'semibold',
        titleFontSize: 14,
        subtitle: 'Scatter Plot Example',
        subtitleColor: '#555555',
        subtitleFontSize: 12,
        xAxis: 'x',
        yAxis: 'y',
        xAxisLabel: 'X Value',
        yAxisLabel: 'Y Value',
        xAxisLabelFontSize: 10,
        yAxisLabelFontSize: 10,
        series: [{ dataKey: 'y', name: 'Y Value' }],
        tooltipFormat: 'decimal',
        showTooltip: true,
        colors: ['#ff7300'],
        showGrid: true,
        grid: { vertical: true, horizontal: true, stroke: '#e0e0e0', strokeDasharray: '3 3', fill: '#fafafa', strokeWidth: 1 },
        showLegend: false,
        legendPosition: 'bottom',
        showXAxis: true,
        showYAxis: true,
        showCartesianGrid: true,
        width: 400,
        height: 250,
        paddingOption: 'small',
        theme: 'light',
        backgroundColor: 'default',
        enableAnimation: true,
        animationDuration: 500,
        animationType: 'linear',
        data: Array.from({ length: 6 }, (_, i) => ({
            x: Math.round(15 + i * 8 + Math.random() * 8),
            y: Math.round(20 + i * 5 + Math.random() * 12)
        })),
    },

    // 6. Radar Chart
    {
        type: 'radar',
        title: 'Sample Radar Chart',
        titleAlignment: 'center',
        titleColor: '#333333',
        titleWeight: 'bold',
        titleFontSize: 14,
        subtitle: 'Radar Chart Example',
        subtitleColor: '#666666',
        subtitleFontSize: 12,
        xAxis: '',
        yAxis: '',
        xAxisLabel: '',
        yAxisLabel: '',
        xAxisLabelFontSize: 0,
        yAxisLabelFontSize: 0,
        series: [{ dataKey: 'value', name: 'Value' }],
        tooltipFormat: 'default',
        showTooltip: true,
        colors: ['#8884d8', '#82ca9d'],
        showGrid: false,
        grid: { vertical: true, horizontal: true, stroke: '#e0e0e0', strokeDasharray: '3 3', fill: '#fafafa', strokeWidth: 1 },
        showLegend: true,
        legendPosition: 'bottom',
        showXAxis: false,
        showYAxis: false,
        showCartesianGrid: false,
        width: 400,
        height: 250,
        paddingOption: 'small',
        theme: 'light',
        backgroundColor: 'default',
        enableAnimation: true,
        animationDuration: 600,
        animationType: 'ease-in-out',
        radarKeys: ['value'],
        data: Array.from({ length: 6 }, (_, i) => ({
            subject: `Metric ${i + 1}`,
            value: Math.round(30 + Math.random() * 60)
        })),
    },

    // 7. Radial Bar
    {
        type: 'radialBar',
        title: 'Sample Radial Bar',
        titleAlignment: 'center',
        titleColor: '#333333',
        titleWeight: 'bold',
        titleFontSize: 14,
        subtitle: 'Radial Bar Example',
        subtitleColor: '#666666',
        subtitleFontSize: 12,
        xAxis: '',
        yAxis: '',
        xAxisLabel: '',
        yAxisLabel: '',
        xAxisLabelFontSize: 0,
        yAxisLabelFontSize: 0,
        series: [{ dataKey: 'value', name: 'Value' }],
        tooltipFormat: 'default',
        showTooltip: true,
        colors: ['#82ca9d', '#ff7300', '#ffc658'],
        showGrid: false,
        grid: { vertical: false, horizontal: false, stroke: '#e0e0e0', strokeDasharray: '3 3', fill: '#fafafa', strokeWidth: 1 },
        showLegend: true,
        legendPosition: 'bottom',
        showXAxis: false,
        showYAxis: false,
        showCartesianGrid: false,
        width: 400,
        height: 250,
        paddingOption: 'small',
        theme: 'light',
        backgroundColor: 'transparent',
        enableAnimation: true,
        animationDuration: 700,
        animationType: 'ease-in',
        innerRadius: 40,
        outerRadius: 100,
        startAngle: 90,
        endAngle: -270,
        data: Array.from({ length: 3 }, (_, i) => ({
            name: `Arc ${i + 1}`,
            value: Math.round(30 + Math.random() * 60)
        })),
    },

    // 8. Funnel Chart (fixed format)
    {
        type: 'funnel',
        title: 'Sample Funnel Chart',
        titleAlignment: 'center',
        titleColor: '#333333',
        titleWeight: 'bold',
        titleFontSize: 14,
        subtitle: 'Funnel Chart Example',
        subtitleColor: '#666666',
        subtitleFontSize: 12,
        xAxis: '',
        yAxis: '',
        xAxisLabel: '',
        yAxisLabel: '',
        xAxisLabelFontSize: 0,
        yAxisLabelFontSize: 0,
        series: [{ dataKey: 'value', name: 'Value' }],
        tooltipFormat: 'default',
        showTooltip: true,
        colors: ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'],
        showGrid: false,
        grid: { vertical: false, horizontal: false, stroke: '#e0e0e0', strokeDasharray: '3 3', fill: '#fafafa', strokeWidth: 1 },
        showLegend: true,
        legendPosition: 'right',
        showXAxis: false,
        showYAxis: false,
        showCartesianGrid: false,
        width: 400,
        height: 250,
        paddingOption: 'small',
        theme: 'light',
        backgroundColor: 'default',
        enableAnimation: true,
        animationDuration: 800,
        animationType: 'ease-out',
        funnelWidth: 180,
        funnelHeight: 350,
        dataKey: 'value',
        nameKey: 'name',
        data: Array.from({ length: 5 }, (_, i) => ({
            name: `Step ${i + 1}`,
            value: 1000 - i * 150
        })),
    },

    // 9. Treemap
    {
        type: 'treemap',
        title: 'Sample Treemap',
        titleAlignment: 'center',
        titleColor: '#333333',
        titleWeight: 'bold',
        titleFontSize: 14,
        subtitle: 'Treemap Example',
        subtitleColor: '#666666',
        subtitleFontSize: 12,
        xAxis: '',
        yAxis: '',
        xAxisLabel: '',
        yAxisLabel: '',
        xAxisLabelFontSize: 0,
        yAxisLabelFontSize: 0,
        series: [{ dataKey: 'value', name: 'Value' }],
        tooltipFormat: 'default',
        showTooltip: true,
        colors: ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'],
        showGrid: false,
        grid: { vertical: false, horizontal: false, stroke: '#e0e0e0', strokeDasharray: '3 3', fill: '#fafafa', strokeWidth: 1 },
        showLegend: false,
        legendPosition: 'bottom',
        showXAxis: false,
        showYAxis: false,
        showCartesianGrid: false,
        width: 400,
        height: 250,
        paddingOption: 'small',
        theme: 'light',
        backgroundColor: 'default',
        enableAnimation: true,
        animationDuration: 500,
        animationType: 'ease-out',
        dataKey: 'value',
        nameKey: 'name',
        valueKey: 'value',
        aspectRatio: 1.5,
        data: Array.from({ length: 6 }, (_, i) => ({
            name: `Node ${i + 1}`,
            value: 1000 - i * 120
        })),
    },

    // 10. Composed Chart (Bar + Line)
    {
        type: 'composed',
        title: 'Sample Composed Chart',
        titleAlignment: 'center',
        titleColor: '#333333',
        titleWeight: 'bold',
        titleFontSize: 14,
        subtitle: 'Bar + Line Example',
        subtitleColor: '#666666',
        subtitleFontSize: 12,
        xAxis: 'category',
        yAxis: 'value',
        xAxisLabel: 'Cat',
        yAxisLabel: 'Val',
        xAxisLabelFontSize: 10,
        yAxisLabelFontSize: 10,
        series: [
            { dataKey: 'valueBar', name: 'Bar', chartType: 'bar' },
            { dataKey: 'valueLine', name: 'Line', chartType: 'line' },
        ],
        tooltipFormat: 'default',
        showTooltip: true,
        colors: ['#8884d8', '#82ca9d'],
        showGrid: true,
        grid: { vertical: true, horizontal: true, stroke: '#e0e0e0', strokeDasharray: '3 3', fill: '#fafafa', strokeWidth: 1 },
        showLegend: true,
        legendPosition: 'bottom',
        showXAxis: true,
        showYAxis: true,
        showCartesianGrid: true,
        width: 400,
        height: 250,
        paddingOption: 'small',
        theme: 'light',
        backgroundColor: 'default',
        enableAnimation: true,
        animationDuration: 600,
        animationType: 'ease-in-out',
        data: Array.from({ length: 6 }, (_, i) => ({
            category: `C${i + 1}`,
            valueBar: Math.round(25 + Math.random() * 65),
            valueLine: Math.round(20 + Math.random() * 70),
        })),
    },

    // 11. Stacked Bar
    {
        type: 'stackedBar',
        title: 'Sample Stacked Bar Chart',
        titleAlignment: 'center',
        titleColor: '#333333',
        titleWeight: 'bold',
        titleFontSize: 14,
        subtitle: 'Stacked Bar Example',
        subtitleColor: '#666666',
        subtitleFontSize: 12,
        xAxis: 'category',
        yAxis: 'value',
        xAxisLabel: 'Cat',
        yAxisLabel: 'Val',
        xAxisLabelFontSize: 10,
        yAxisLabelFontSize: 10,
        series: [
            { dataKey: 'value1', name: 'Series 1' },
            { dataKey: 'value2', name: 'Series 2' },
        ],
        tooltipFormat: 'default',
        showTooltip: true,
        colors: ['#8884d8', '#82ca9d'],
        showGrid: true,
        grid: { vertical: true, horizontal: true, stroke: '#e0e0e0', strokeDasharray: '3 3', fill: '#fafafa', strokeWidth: 1 },
        showLegend: true,
        legendPosition: 'top',
        showXAxis: true,
        showYAxis: true,
        showCartesianGrid: true,
        width: 400,
        height: 250,
        paddingOption: 'small',
        theme: 'light',
        backgroundColor: 'default',
        enableAnimation: true,
        animationDuration: 500,
        animationType: 'ease-out',
        data: Array.from({ length: 6 }, (_, i) => ({
            category: `G${i + 1}`,
            value1: Math.round(20 + Math.random() * 60),
            value2: Math.round(15 + Math.random() * 35),
        })),
    },

    // 12. Stacked Area
    {
        type: 'stackedArea',
        title: 'Sample Stacked Area Chart',
        titleAlignment: 'center',
        titleColor: '#333333',
        titleWeight: 'bold',
        titleFontSize: 14,
        subtitle: 'Stacked Area Example',
        subtitleColor: '#666666',
        subtitleFontSize: 12,
        xAxis: 'category',
        yAxis: 'value',
        xAxisLabel: 'Cat',
        yAxisLabel: 'Val',
        xAxisLabelFontSize: 10,
        yAxisLabelFontSize: 10,
        series: [
            { dataKey: 'value1', name: 'Series 1' },
            { dataKey: 'value2', name: 'Series 2' },
        ],
        tooltipFormat: 'decimal',
        showTooltip: true,
        colors: ['#8884d8', '#82ca9d'],
        showGrid: true,
        grid: { vertical: false, horizontal: true, stroke: '#e0e0e0', strokeDasharray: '3 3', fill: '#fafafa', strokeWidth: 1 },
        showLegend: true,
        legendPosition: 'bottom',
        showXAxis: true,
        showYAxis: true,
        showCartesianGrid: true,
        width: 400,
        height: 250,
        paddingOption: 'small',
        theme: 'light',
        backgroundColor: 'default',
        enableAnimation: true,
        animationDuration: 600,
        animationType: 'ease-in-out',
        data: Array.from({ length: 6 }, (_, i) => ({
            category: `D${i + 1}`,
            value1: Math.round(25 + Math.random() * 55),
            value2: Math.round(20 + Math.random() * 50),
        })),
    },

    // 13. Waterfall Chart
    {
        type: 'waterfall',
        title: 'Sample Waterfall Chart',
        titleAlignment: 'left',
        titleColor: '#222222',
        titleWeight: 'semibold',
        titleFontSize: 14,
        subtitle: 'Waterfall Example',
        subtitleColor: '#555555',
        subtitleFontSize: 12,
        xAxis: 'name',
        yAxis: 'amount',
        xAxisLabel: 'Step',
        yAxisLabel: 'Amount',
        xAxisLabelFontSize: 10,
        yAxisLabelFontSize: 10,
        series: [{ dataKey: 'amount', name: 'Amount' }],
        tooltipFormat: 'currency',
        showTooltip: true,
        colors: ['#82ca9d', '#ff7300'],
        showGrid: true,
        grid: { vertical: true, horizontal: true, stroke: '#e0e0e0', strokeDasharray: '3 3', fill: '#fafafa', strokeWidth: 1 },
        showLegend: false,
        legendPosition: 'bottom',
        showXAxis: true,
        showYAxis: true,
        showCartesianGrid: true,
        width: 400,
        height: 250,
        paddingOption: 'small',
        theme: 'light',
        backgroundColor: 'default',
        enableAnimation: true,
        animationDuration: 700,
        animationType: 'ease-out',
        waterfallStartValue: 0,
        waterfallEndValue: 0, // ChartRenderer will compute running total
        data: Array.from({ length: 6 }, (_, i) => ({
            name: `Step ${i + 1}`,
            amount: (i % 2 === 0 ? 1 : -1) * Math.round(20 + Math.random() * 60)
        })),
    },
];

export function CreateChart({ project }) {
    const [selectedType, setSelectedType] = useState<typeof chartConfigs[number]['type']>(
        chartConfigs[0].type
    );

    const { appearance } = useAppearanceContext();

    useEffect(() => {
        setData(chartConfigs.find(c => c.type === selectedType))
    }, [selectedType])

    const { data, setData, post, processing } = useForm({})
    
    const createChart = () => {
        post(route('projects.charts.store', project.id), {
            showProgress: false,
            onError: (errors) => {
                if (errors.package_restriction) {
                    toast.error(errors.package_restriction)
                }
            },
        })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" className="border hover:bg-accent/50 transition-colors duration-200">
                    <span className="flex items-center gap-2">
                        <BarChart className="h-4 w-4" />
                        <span>Create a Chart</span>
                    </span>
                </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full sm:max-w-[90vw] lg:max-w-6xl xl:max-w-7xl overflow-hidden flex flex-col">
                {/* Header - Fixed */}
                <DialogHeader className="flex-none px-4 py-6 sm:px-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="space-y-1">
                            <DialogTitle className="text-xl sm:text-2xl font-semibold tracking-tight">
                                Choose a Chart
                            </DialogTitle>
                            <DialogDescription className="text-sm text-muted-foreground">
                                Select from a variety of charts supported by datacolumn.ai
                            </DialogDescription>
                        </div>
                        
                        {/* Desktop Create Button */}
                        <div className="hidden sm:flex">
                            <Button 
                                onClick={createChart} 
                                disabled={processing}
                                className="min-w-[100px] h-10 font-medium"
                            >
                                {processing ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Creating...
                                    </div>
                                ) : (
                                    'Create Chart'
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogHeader>

                {/* Chart Grid - Scrollable */}
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                    <RadioGroup
                        value={selectedType}
                        onValueChange={setSelectedType}
                        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                    >
                        {chartConfigs.map((cfg) => {
                            const isSelected = cfg.type === selectedType;
                            return (
                                <div 
                                    key={cfg.type} 
                                    className={`
                                        group relative overflow-hidden rounded-xl border-2 transition-all duration-200 cursor-pointer
                                        ${isSelected 
                                            ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-md scale-[1.02]' 
                                            : 'border-border bg-card hover:border-primary/50 hover:bg-accent/30 hover:shadow-sm hover:scale-[1.01]'
                                        }
                                    `}
                                >
                                    <RadioGroupItem 
                                        value={cfg.type} 
                                        id={cfg.type} 
                                        className="sr-only" 
                                    />
                                    
                                    {/* Selection Indicator */}
                                    {isSelected && (
                                        <div className="absolute top-2 right-2 z-10 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                            <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                                        </div>
                                    )}
                                    
                                    <label 
                                        className="block w-full h-full cursor-pointer" 
                                        htmlFor={cfg.type}
                                    >
                                        {/* Chart Preview Container */}
                                        <div className="aspect-[4/3] p-2 sm:p-3 flex items-center justify-center bg-gradient-to-br from-background to-muted/20 overflow-hidden">
                                            <div className="w-full h-full flex items-center justify-center relative">
                                                <ChartEditorProvider 
                                                    chart={{ 
                                                        config: { 
                                                            ...cfg, 
                                                            theme: appearance,
                                                            // Chart-specific optimizations
                                                            ...(cfg.type === 'pie' && {
                                                                width: 300,
                                                                height: 200,
                                                                innerRadius: 30,
                                                                outerRadius: 80,
                                                                showLegend: false,
                                                                title: '',
                                                                subtitle: ''
                                                            }),
                                                            ...(cfg.type === 'radialBar' && {
                                                                width: 280,
                                                                height: 200,
                                                                innerRadius: 20,
                                                                outerRadius: 80,
                                                                showLegend: false,
                                                                title: '',
                                                                subtitle: ''
                                                            }),
                                                            ...(cfg.type === 'funnel' && {
                                                                width: 300,
                                                                height: 200,
                                                                funnelWidth: 120,
                                                                funnelHeight: 180,
                                                                showLegend: false,
                                                                title: '',
                                                                subtitle: ''
                                                            }),
                                                            ...(cfg.type === 'treemap' && {
                                                                width: 300,
                                                                height: 200,
                                                                title: '',
                                                                subtitle: ''
                                                            }),
                                                            ...(cfg.type === 'radar' && {
                                                                width: 280,
                                                                height: 200,
                                                                showLegend: false,
                                                                title: '',
                                                                subtitle: ''
                                                            }),
                                                            // Standard charts optimizations
                                                            ...(['bar', 'line', 'area', 'scatter', 'composed', 'stackedBar', 'stackedArea', 'waterfall'].includes(cfg.type) && {
                                                                width: 320,
                                                                height: 200,
                                                                titleFontSize: 11,
                                                                subtitleFontSize: 9,
                                                                xAxisLabelFontSize: 8,
                                                                yAxisLabelFontSize: 8,
                                                                title: cfg.type.charAt(0).toUpperCase() + cfg.type.slice(1).replace(/([A-Z])/g, ' $1'),
                                                                subtitle: '',
                                                                showLegend: cfg.series && cfg.series.length > 1
                                                            }),
                                                            paddingOption: 'none'
                                                        }, 
                                                        data: cfg.data 
                                                    }}
                                                >
                                                    <div className="flex items-center justify-center w-full h-full">
                                                        <div className={`
                                                            flex items-center justify-center
                                                            ${['pie', 'radialBar', 'radar'].includes(cfg.type) ? 'w-[280px] h-[200px]' : 
                                                              cfg.type === 'funnel' ? 'w-[300px] h-[200px]' : 
                                                              'w-[320px] h-[200px]'}
                                                        `}>
                                                            <ChartRenderer />
                                                        </div>
                                                    </div>
                                                </ChartEditorProvider>
                                            </div>
                                        </div>
                                        
                                        {/* Chart Type Label */}
                                        <div className="px-3 py-2 sm:px-4 sm:py-3 border-t bg-background/50 backdrop-blur">
                                            <h3 className="font-medium text-sm sm:text-base text-center capitalize tracking-tight">
                                                {cfg.type.replace(/([A-Z])/g, ' $1').trim()}
                                            </h3>
                                        </div>
                                    </label>
                                </div>
                            );
                        })}
                    </RadioGroup>
                </div>

                {/* Mobile Footer - Fixed */}
                <div className="sm:hidden flex-none px-4 py-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <Button 
                        onClick={createChart} 
                        disabled={processing}
                        className="w-full h-12 font-medium text-base"
                        size="lg"
                    >
                        {processing ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Creating Chart...
                            </div>
                        ) : (
                            'Create Chart'
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
