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
                        <span>Choose your chart style</span>
                    </span>
                </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full sm:max-w-[90vw] lg:max-w-6xl xl:max-w-7xl overflow-hidden flex flex-col">
                {/* Header - Fixed */}
                <DialogHeader className="flex-none px-4 py-6 sm:px-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="space-y-1">
                            <DialogTitle className="text-xl sm:text-2xl font-semibold tracking-tight">
                                Choose your chart style
                            </DialogTitle>
                            <DialogDescription className="text-sm text-muted-foreground">
                                Publication-ready visualizations that look great everywhere.
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
                                        <div className="aspect-[4/3] p-4 sm:p-6 flex items-center justify-center bg-gradient-to-br from-background to-muted/20 overflow-hidden">
                                            <div className="w-full h-full flex items-center justify-center">
                                                {/* Chart Type Illustrations */}
                                                {cfg.type === 'bar' && (
                                                    <svg viewBox="0 0 200 120" className="w-full h-full max-w-[180px] max-h-[108px]">
                                                        <defs>
                                                            <linearGradient id="barGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                                                                <stop offset="0%" stopColor="#8B5CF6" />
                                                                <stop offset="100%" stopColor="#A855F7" />
                                                            </linearGradient>
                                                            <linearGradient id="barGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                                                                <stop offset="0%" stopColor="#06B6D4" />
                                                                <stop offset="100%" stopColor="#0891B2" />
                                                            </linearGradient>
                                                            <linearGradient id="barGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
                                                                <stop offset="0%" stopColor="#10B981" />
                                                                <stop offset="100%" stopColor="#059669" />
                                                            </linearGradient>
                                                            <linearGradient id="barGrad4" x1="0%" y1="0%" x2="0%" y2="100%">
                                                                <stop offset="0%" stopColor="#F59E0B" />
                                                                <stop offset="100%" stopColor="#D97706" />
                                                            </linearGradient>
                                                            <linearGradient id="barGrad5" x1="0%" y1="0%" x2="0%" y2="100%">
                                                                <stop offset="0%" stopColor="#EF4444" />
                                                                <stop offset="100%" stopColor="#DC2626" />
                                                            </linearGradient>
                                                        </defs>
                                                        <rect x="20" y="80" width="25" height="30" fill="url(#barGrad1)" rx="3" />
                                                        <rect x="55" y="60" width="25" height="50" fill="url(#barGrad2)" rx="3" />
                                                        <rect x="90" y="40" width="25" height="70" fill="url(#barGrad3)" rx="3" />
                                                        <rect x="125" y="70" width="25" height="40" fill="url(#barGrad4)" rx="3" />
                                                        <rect x="160" y="50" width="25" height="60" fill="url(#barGrad5)" rx="3" />
                                                        <line x1="15" y1="115" x2="190" y2="115" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />
                                                        <line x1="15" y1="20" x2="15" y2="115" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />
                                                    </svg>
                                                )}
                                                
                                                {cfg.type === 'line' && (
                                                    <svg viewBox="0 0 200 120" className="w-full h-full max-w-[180px] max-h-[108px]">
                                                        <defs>
                                                            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                                                <stop offset="0%" stopColor="#8B5CF6" />
                                                                <stop offset="50%" stopColor="#06B6D4" />
                                                                <stop offset="100%" stopColor="#10B981" />
                                                            </linearGradient>
                                                        </defs>
                                                        <polyline points="20,90 50,60 80,45 110,70 140,35 170,55" 
                                                                  fill="none" stroke="url(#lineGrad)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                        <circle cx="20" cy="90" r="5" fill="#8B5CF6" stroke="#fff" strokeWidth="2" />
                                                        <circle cx="50" cy="60" r="5" fill="#7C3AED" stroke="#fff" strokeWidth="2" />
                                                        <circle cx="80" cy="45" r="5" fill="#06B6D4" stroke="#fff" strokeWidth="2" />
                                                        <circle cx="110" cy="70" r="5" fill="#0891B2" stroke="#fff" strokeWidth="2" />
                                                        <circle cx="140" cy="35" r="5" fill="#10B981" stroke="#fff" strokeWidth="2" />
                                                        <circle cx="170" cy="55" r="5" fill="#059669" stroke="#fff" strokeWidth="2" />
                                                        <line x1="15" y1="100" x2="175" y2="100" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />
                                                        <line x1="15" y1="20" x2="15" y2="100" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />
                                                    </svg>
                                                )}
                                                
                                                {cfg.type === 'area' && (
                                                    <svg viewBox="0 0 200 120" className="w-full h-full max-w-[180px] max-h-[108px]">
                                                        <defs>
                                                            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
                                                                <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.6" />
                                                                <stop offset="100%" stopColor="#10B981" stopOpacity="0.2" />
                                                            </linearGradient>
                                                            <linearGradient id="areaStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                                                                <stop offset="0%" stopColor="#8B5CF6" />
                                                                <stop offset="50%" stopColor="#06B6D4" />
                                                                <stop offset="100%" stopColor="#10B981" />
                                                            </linearGradient>
                                                        </defs>
                                                        <polygon points="20,100 20,70 50,50 80,35 110,60 140,25 170,45 170,100" 
                                                                 fill="url(#areaGradient)" />
                                                        <polyline points="20,70 50,50 80,35 110,60 140,25 170,45" 
                                                                  fill="none" stroke="url(#areaStroke)" strokeWidth="3" />
                                                        <line x1="15" y1="105" x2="175" y2="105" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />
                                                        <line x1="15" y1="20" x2="15" y2="105" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />
                                                    </svg>
                                                )}
                                                
                                                {cfg.type === 'pie' && (
                                                    <svg viewBox="0 0 200 120" className="w-full h-full max-w-[180px] max-h-[108px]">
                                                        <defs>
                                                            <radialGradient id="pieGrad1" cx="50%" cy="40%">
                                                                <stop offset="0%" stopColor="#A855F7" />
                                                                <stop offset="100%" stopColor="#8B5CF6" />
                                                            </radialGradient>
                                                            <radialGradient id="pieGrad2" cx="50%" cy="40%">
                                                                <stop offset="0%" stopColor="#22D3EE" />
                                                                <stop offset="100%" stopColor="#06B6D4" />
                                                            </radialGradient>
                                                            <radialGradient id="pieGrad3" cx="50%" cy="40%">
                                                                <stop offset="0%" stopColor="#34D399" />
                                                                <stop offset="100%" stopColor="#10B981" />
                                                            </radialGradient>
                                                            <radialGradient id="pieGrad4" cx="50%" cy="40%">
                                                                <stop offset="0%" stopColor="#FBBF24" />
                                                                <stop offset="100%" stopColor="#F59E0B" />
                                                            </radialGradient>
                                                        </defs>
                                                        <circle cx="100" cy="60" r="45" fill="url(#pieGrad1)" stroke="#fff" strokeWidth="2" />
                                                        <path d="M 100 60 L 100 15 A 45 45 0 0 1 131.82 39.09 Z" fill="url(#pieGrad2)" stroke="#fff" strokeWidth="2" />
                                                        <path d="M 100 60 L 131.82 39.09 A 45 45 0 0 1 131.82 80.91 Z" fill="url(#pieGrad3)" stroke="#fff" strokeWidth="2" />
                                                        <path d="M 100 60 L 131.82 80.91 A 45 45 0 0 1 100 105 Z" fill="url(#pieGrad4)" stroke="#fff" strokeWidth="2" />
                                                    </svg>
                                                )}
                                                
                                                {cfg.type === 'scatter' && (
                                                    <svg viewBox="0 0 200 120" className="w-full h-full max-w-[180px] max-h-[108px]">
                                                        <circle cx="30" cy="80" r="6" fill="#8B5CF6" stroke="#fff" strokeWidth="2" opacity="0.9" />
                                                        <circle cx="45" cy="65" r="6" fill="#7C3AED" stroke="#fff" strokeWidth="2" opacity="0.9" />
                                                        <circle cx="60" cy="50" r="6" fill="#06B6D4" stroke="#fff" strokeWidth="2" opacity="0.9" />
                                                        <circle cx="75" cy="70" r="6" fill="#0891B2" stroke="#fff" strokeWidth="2" opacity="0.9" />
                                                        <circle cx="90" cy="45" r="6" fill="#10B981" stroke="#fff" strokeWidth="2" opacity="0.9" />
                                                        <circle cx="105" cy="60" r="6" fill="#059669" stroke="#fff" strokeWidth="2" opacity="0.9" />
                                                        <circle cx="120" cy="35" r="6" fill="#F59E0B" stroke="#fff" strokeWidth="2" opacity="0.9" />
                                                        <circle cx="135" cy="55" r="6" fill="#D97706" stroke="#fff" strokeWidth="2" opacity="0.9" />
                                                        <circle cx="150" cy="40" r="6" fill="#EF4444" stroke="#fff" strokeWidth="2" opacity="0.9" />
                                                        <circle cx="165" cy="30" r="6" fill="#DC2626" stroke="#fff" strokeWidth="2" opacity="0.9" />
                                                        <line x1="20" y1="95" x2="175" y2="95" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />
                                                        <line x1="20" y1="20" x2="20" y2="95" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />
                                                    </svg>
                                                )}
                                                
                                                {cfg.type === 'radar' && (
                                                    <svg viewBox="0 0 200 120" className="w-full h-full max-w-[180px] max-h-[108px]">
                                                        <defs>
                                                            <radialGradient id="radarGrad" cx="50%" cy="50%">
                                                                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6" />
                                                                <stop offset="70%" stopColor="#06B6D4" stopOpacity="0.3" />
                                                                <stop offset="100%" stopColor="#10B981" stopOpacity="0.1" />
                                                            </radialGradient>
                                                        </defs>
                                                        <polygon points="100,25 142,45 130,85 70,85 58,45" 
                                                                 fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1" opacity="0.3" />
                                                        <polygon points="100,35 125,48 118,75 82,75 75,48" 
                                                                 fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1" opacity="0.5" />
                                                        <polygon points="100,45 108,50 106,65 94,65 92,50" 
                                                                 fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1" opacity="0.7" />
                                                        <polygon points="100,30 135,50 125,80 75,80 65,50" 
                                                                 fill="url(#radarGrad)" stroke="#8B5CF6" strokeWidth="3" />
                                                        <line x1="100" y1="60" x2="100" y2="25" stroke="hsl(var(--muted-foreground))" strokeWidth="1" opacity="0.4" />
                                                        <line x1="100" y1="60" x2="142" y2="45" stroke="hsl(var(--muted-foreground))" strokeWidth="1" opacity="0.4" />
                                                        <line x1="100" y1="60" x2="130" y2="85" stroke="hsl(var(--muted-foreground))" strokeWidth="1" opacity="0.4" />
                                                        <line x1="100" y1="60" x2="70" y2="85" stroke="hsl(var(--muted-foreground))" strokeWidth="1" opacity="0.4" />
                                                        <line x1="100" y1="60" x2="58" y2="45" stroke="hsl(var(--muted-foreground))" strokeWidth="1" opacity="0.4" />
                                                        <circle cx="100" cy="30" r="3" fill="#8B5CF6" />
                                                        <circle cx="135" cy="50" r="3" fill="#06B6D4" />
                                                        <circle cx="125" cy="80" r="3" fill="#10B981" />
                                                        <circle cx="75" cy="80" r="3" fill="#F59E0B" />
                                                        <circle cx="65" cy="50" r="3" fill="#EF4444" />
                                                    </svg>
                                                )}
                                                
                                                {cfg.type === 'radialBar' && (
                                                    <svg viewBox="0 0 200 120" className="w-full h-full max-w-[180px] max-h-[108px]">
                                                        <defs>
                                                            <linearGradient id="radialGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                                                <stop offset="0%" stopColor="#8B5CF6" />
                                                                <stop offset="100%" stopColor="#A855F7" />
                                                            </linearGradient>
                                                            <linearGradient id="radialGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                                                                <stop offset="0%" stopColor="#06B6D4" />
                                                                <stop offset="100%" stopColor="#22D3EE" />
                                                            </linearGradient>
                                                            <linearGradient id="radialGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
                                                                <stop offset="0%" stopColor="#10B981" />
                                                                <stop offset="100%" stopColor="#34D399" />
                                                            </linearGradient>
                                                        </defs>
                                                        <circle cx="100" cy="60" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" opacity="0.2" />
                                                        <circle cx="100" cy="60" r="32" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" opacity="0.2" />
                                                        <circle cx="100" cy="60" r="24" fill="none" stroke="hsl(var(--muted))" strokeWidth="4" opacity="0.2" />
                                                        <circle cx="100" cy="60" r="40" fill="none" stroke="url(#radialGrad1)" strokeWidth="8" 
                                                                strokeDasharray="188.5" strokeDashoffset="47" transform="rotate(-90 100 60)" strokeLinecap="round" />
                                                        <circle cx="100" cy="60" r="32" fill="none" stroke="url(#radialGrad2)" strokeWidth="6" 
                                                                strokeDasharray="201.1" strokeDashoffset="67" transform="rotate(-90 100 60)" strokeLinecap="round" />
                                                        <circle cx="100" cy="60" r="24" fill="none" stroke="url(#radialGrad3)" strokeWidth="4" 
                                                                strokeDasharray="150.8" strokeDashoffset="50" transform="rotate(-90 100 60)" strokeLinecap="round" />
                                                    </svg>
                                                )}
                                                
                                                {cfg.type === 'funnel' && (
                                                    <svg viewBox="0 0 200 120" className="w-full h-full max-w-[180px] max-h-[108px]">
                                                        <defs>
                                                            <linearGradient id="funnelGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                                                                <stop offset="0%" stopColor="#A855F7" />
                                                                <stop offset="100%" stopColor="#8B5CF6" />
                                                            </linearGradient>
                                                            <linearGradient id="funnelGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                                                                <stop offset="0%" stopColor="#22D3EE" />
                                                                <stop offset="100%" stopColor="#06B6D4" />
                                                            </linearGradient>
                                                            <linearGradient id="funnelGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
                                                                <stop offset="0%" stopColor="#34D399" />
                                                                <stop offset="100%" stopColor="#10B981" />
                                                            </linearGradient>
                                                            <linearGradient id="funnelGrad4" x1="0%" y1="0%" x2="0%" y2="100%">
                                                                <stop offset="0%" stopColor="#FBBF24" />
                                                                <stop offset="100%" stopColor="#F59E0B" />
                                                            </linearGradient>
                                                        </defs>
                                                        <polygon points="50,25 150,25 140,40 60,40" fill="url(#funnelGrad1)" stroke="#fff" strokeWidth="1.5" />
                                                        <polygon points="60,45 140,45 130,60 70,60" fill="url(#funnelGrad2)" stroke="#fff" strokeWidth="1.5" />
                                                        <polygon points="70,65 130,65 120,80 80,80" fill="url(#funnelGrad3)" stroke="#fff" strokeWidth="1.5" />
                                                        <polygon points="80,85 120,85 110,100 90,100" fill="url(#funnelGrad4)" stroke="#fff" strokeWidth="1.5" />
                                                    </svg>
                                                )}
                                                
                                                {cfg.type === 'treemap' && (
                                                    <svg viewBox="0 0 200 120" className="w-full h-full max-w-[180px] max-h-[108px]">
                                                        <defs>
                                                            <linearGradient id="treeGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                                                <stop offset="0%" stopColor="#A855F7" />
                                                                <stop offset="100%" stopColor="#8B5CF6" />
                                                            </linearGradient>
                                                            <linearGradient id="treeGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                                                                <stop offset="0%" stopColor="#22D3EE" />
                                                                <stop offset="100%" stopColor="#06B6D4" />
                                                            </linearGradient>
                                                            <linearGradient id="treeGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
                                                                <stop offset="0%" stopColor="#34D399" />
                                                                <stop offset="100%" stopColor="#10B981" />
                                                            </linearGradient>
                                                            <linearGradient id="treeGrad4" x1="0%" y1="0%" x2="100%" y2="100%">
                                                                <stop offset="0%" stopColor="#FBBF24" />
                                                                <stop offset="100%" stopColor="#F59E0B" />
                                                            </linearGradient>
                                                        </defs>
                                                        <rect x="20" y="20" width="80" height="50" fill="url(#treeGrad1)" rx="4" stroke="#fff" strokeWidth="2" />
                                                        <rect x="110" y="20" width="70" height="30" fill="url(#treeGrad2)" rx="4" stroke="#fff" strokeWidth="2" />
                                                        <rect x="110" y="55" width="70" height="15" fill="url(#treeGrad3)" rx="4" stroke="#fff" strokeWidth="2" />
                                                        <rect x="20" y="75" width="50" height="25" fill="url(#treeGrad4)" rx="4" stroke="#fff" strokeWidth="2" />
                                                        <rect x="75" y="75" width="25" height="25" fill="#EC4899" rx="4" stroke="#fff" strokeWidth="2" />
                                                        <rect x="110" y="75" width="35" height="25" fill="#F97316" rx="4" stroke="#fff" strokeWidth="2" />
                                                        <rect x="150" y="75" width="30" height="25" fill="#84CC16" rx="4" stroke="#fff" strokeWidth="2" />
                                                    </svg>
                                                )}
                                                
                                                {cfg.type === 'composed' && (
                                                    <svg viewBox="0 0 200 120" className="w-full h-full max-w-[180px] max-h-[108px]">
                                                        <defs>
                                                            <linearGradient id="compGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                                                                <stop offset="0%" stopColor="#A855F7" />
                                                                <stop offset="100%" stopColor="#8B5CF6" />
                                                            </linearGradient>
                                                            <linearGradient id="compGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                                                                <stop offset="0%" stopColor="#06B6D4" />
                                                                <stop offset="100%" stopColor="#10B981" />
                                                            </linearGradient>
                                                        </defs>
                                                        <rect x="25" y="70" width="20" height="30" fill="url(#compGrad1)" rx="3" />
                                                        <rect x="55" y="50" width="20" height="50" fill="url(#compGrad1)" rx="3" />
                                                        <rect x="85" y="60" width="20" height="40" fill="url(#compGrad1)" rx="3" />
                                                        <rect x="115" y="40" width="20" height="60" fill="url(#compGrad1)" rx="3" />
                                                        <rect x="145" y="65" width="20" height="35" fill="url(#compGrad1)" rx="3" />
                                                        <polyline points="35,80 65,55 95,45 125,65 155,35" 
                                                                  fill="none" stroke="url(#compGrad2)" strokeWidth="4" strokeLinecap="round" />
                                                        <circle cx="35" cy="80" r="4" fill="#06B6D4" stroke="#fff" strokeWidth="2" />
                                                        <circle cx="65" cy="55" r="4" fill="#0891B2" stroke="#fff" strokeWidth="2" />
                                                        <circle cx="95" cy="45" r="4" fill="#0E7490" stroke="#fff" strokeWidth="2" />
                                                        <circle cx="125" cy="65" r="4" fill="#10B981" stroke="#fff" strokeWidth="2" />
                                                        <circle cx="155" cy="35" r="4" fill="#059669" stroke="#fff" strokeWidth="2" />
                                                        <line x1="20" y1="105" x2="175" y2="105" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />
                                                        <line x1="20" y1="30" x2="20" y2="105" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />
                                                    </svg>
                                                )}
                                                
                                                {cfg.type === 'stackedBar' && (
                                                    <svg viewBox="0 0 200 120" className="w-full h-full max-w-[180px] max-h-[108px]">
                                                        <defs>
                                                            <linearGradient id="stackGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                                                                <stop offset="0%" stopColor="#A855F7" />
                                                                <stop offset="100%" stopColor="#8B5CF6" />
                                                            </linearGradient>
                                                            <linearGradient id="stackGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                                                                <stop offset="0%" stopColor="#22D3EE" />
                                                                <stop offset="100%" stopColor="#06B6D4" />
                                                            </linearGradient>
                                                        </defs>
                                                        <rect x="30" y="60" width="25" height="25" fill="url(#stackGrad1)" rx="3" />
                                                        <rect x="30" y="85" width="25" height="15" fill="url(#stackGrad2)" rx="3" />
                                                        <rect x="65" y="40" width="25" height="35" fill="url(#stackGrad1)" rx="3" />
                                                        <rect x="65" y="75" width="25" height="25" fill="url(#stackGrad2)" rx="3" />
                                                        <rect x="100" y="50" width="25" height="30" fill="url(#stackGrad1)" rx="3" />
                                                        <rect x="100" y="80" width="25" height="20" fill="url(#stackGrad2)" rx="3" />
                                                        <rect x="135" y="35" width="25" height="40" fill="url(#stackGrad1)" rx="3" />
                                                        <rect x="135" y="75" width="25" height="25" fill="url(#stackGrad2)" rx="3" />
                                                        <line x1="25" y1="105" x2="170" y2="105" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />
                                                        <line x1="25" y1="30" x2="25" y2="105" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />
                                                    </svg>
                                                )}
                                                
                                                {cfg.type === 'stackedArea' && (
                                                    <svg viewBox="0 0 200 120" className="w-full h-full max-w-[180px] max-h-[108px]">
                                                        <defs>
                                                            <linearGradient id="stackedGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                                                                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
                                                                <stop offset="100%" stopColor="#A855F7" stopOpacity="0.4" />
                                                            </linearGradient>
                                                            <linearGradient id="stackedGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                                                                <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.8" />
                                                                <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.4" />
                                                            </linearGradient>
                                                        </defs>
                                                        <polygon points="30,90 30,60 60,50 90,45 120,65 150,35 170,45 170,90" fill="url(#stackedGradient1)" />
                                                        <polygon points="30,60 30,45 60,35 90,30 120,50 150,20 170,30 170,45 150,35 120,65 90,45 60,50" fill="url(#stackedGradient2)" />
                                                        <polyline points="30,60 60,50 90,45 120,65 150,35 170,45" fill="none" stroke="#8B5CF6" strokeWidth="2" />
                                                        <polyline points="30,45 60,35 90,30 120,50 150,20 170,30" fill="none" stroke="#06B6D4" strokeWidth="2" />
                                                        <line x1="25" y1="95" x2="175" y2="95" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />
                                                        <line x1="25" y1="15" x2="25" y2="95" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />
                                                    </svg>
                                                )}
                                                
                                                {cfg.type === 'waterfall' && (
                                                    <svg viewBox="0 0 200 120" className="w-full h-full max-w-[180px] max-h-[108px]">
                                                        <defs>
                                                            <linearGradient id="waterfallPos" x1="0%" y1="0%" x2="0%" y2="100%">
                                                                <stop offset="0%" stopColor="#34D399" />
                                                                <stop offset="100%" stopColor="#10B981" />
                                                            </linearGradient>
                                                            <linearGradient id="waterfallNeg" x1="0%" y1="0%" x2="0%" y2="100%">
                                                                <stop offset="0%" stopColor="#F87171" />
                                                                <stop offset="100%" stopColor="#EF4444" />
                                                            </linearGradient>
                                                        </defs>
                                                        <rect x="25" y="80" width="20" height="20" fill="url(#waterfallPos)" rx="3" stroke="#fff" strokeWidth="1" />
                                                        <rect x="55" y="60" width="20" height="20" fill="url(#waterfallPos)" rx="3" stroke="#fff" strokeWidth="1" />
                                                        <rect x="85" y="70" width="20" height="10" fill="url(#waterfallNeg)" rx="3" stroke="#fff" strokeWidth="1" />
                                                        <rect x="115" y="50" width="20" height="20" fill="url(#waterfallPos)" rx="3" stroke="#fff" strokeWidth="1" />
                                                        <rect x="145" y="45" width="20" height="25" fill="url(#waterfallPos)" rx="3" stroke="#fff" strokeWidth="1" />
                                                        <line x1="45" y1="80" x2="55" y2="80" stroke="#06B6D4" strokeWidth="2" strokeDasharray="3,3" />
                                                        <line x1="75" y1="60" x2="85" y2="70" stroke="#06B6D4" strokeWidth="2" strokeDasharray="3,3" />
                                                        <line x1="105" y1="70" x2="115" y2="70" stroke="#06B6D4" strokeWidth="2" strokeDasharray="3,3" />
                                                        <line x1="135" y1="50" x2="145" y2="70" stroke="#06B6D4" strokeWidth="2" strokeDasharray="3,3" />
                                                        <line x1="20" y1="105" x2="175" y2="105" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />
                                                        <line x1="20" y1="40" x2="20" y2="105" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />
                                                    </svg>
                                                )}
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
