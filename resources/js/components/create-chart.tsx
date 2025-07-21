import {
    Activity,
    BarChart, BarChart2,
    Circle, GitBranch,
    GitFork,
    Layers,
    LayoutGrid,
    LineChart,
    PieChart,
    Radar,
    Target,
    TrendingUp
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
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ChartRenderer } from '@/components/chart-editor/chart-renderer';
import React, { useState } from 'react';
import { ChartEditorProvider } from '@/contexts/chart-editor-context';

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
        paddingOption: 'default',
        theme: 'light',
        backgroundColor: 'default',
        enableAnimation: true,
        animationDuration: 500,
        animationType: 'ease-out',
        data: Array.from({ length: 10 }, (_, i) => ({
            category: `Item ${i + 1}`,
            value: Math.round(20 + Math.random() * 80)
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
        paddingOption: 'default',
        theme: 'light',
        backgroundColor: 'default',
        enableAnimation: true,
        animationDuration: 400,
        animationType: 'ease-in-out',
        data: Array.from({ length: 10 }, (_, i) => ({
            category: `P${i + 1}`,
            value: Math.round(10 + Math.random() * 90)
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
        paddingOption: 'default',
        theme: 'light',
        backgroundColor: 'default',
        enableAnimation: true,
        animationDuration: 600,
        animationType: 'ease-out',
        data: Array.from({ length: 10 }, (_, i) => ({
            category: `P${i + 1}`,
            value: Math.round(5 + Math.random() * 95)
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
        paddingOption: 'none',
        theme: 'light',
        backgroundColor: 'transparent',
        enableAnimation: true,
        animationDuration: 700,
        animationType: 'ease-in',
        innerRadius: 50,
        outerRadius: 70,
        startAngle: 0,
        endAngle: 360,
        data: Array.from({ length: 10 }, (_, i) => ({
            name: `Slice ${i + 1}`,
            value: Math.round(5 + Math.random() * 95)
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
        paddingOption: 'default',
        theme: 'light',
        backgroundColor: 'default',
        enableAnimation: true,
        animationDuration: 500,
        animationType: 'linear',
        data: Array.from({ length: 10 }, (_, i) => ({
            x: Math.round(10 + i * 5 + Math.random() * 10),
            y: Math.round(10 + i * 3 + Math.random() * 15)
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
        paddingOption: 'default',
        theme: 'light',
        backgroundColor: 'default',
        enableAnimation: true,
        animationDuration: 600,
        animationType: 'ease-in-out',
        radarKeys: ['value'],
        data: Array.from({ length: 10 }, (_, i) => ({
            subject: `Metric ${i + 1}`,
            value: Math.round(20 + Math.random() * 80)
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
        paddingOption: 'none',
        theme: 'light',
        backgroundColor: 'transparent',
        enableAnimation: true,
        animationDuration: 700,
        animationType: 'ease-in',
        innerRadius: 40,
        outerRadius: 100,
        startAngle: 90,
        endAngle: -270,
        data: Array.from({ length: 10 }, (_, i) => ({
            name: `Arc ${i + 1}`,
            value: Math.round(10 + Math.random() * 90)
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
        paddingOption: 'none',
        theme: 'light',
        backgroundColor: 'default',
        enableAnimation: true,
        animationDuration: 800,
        animationType: 'ease-out',
        funnelWidth: 180,
        funnelHeight: 350,
        dataKey: 'value',
        nameKey: 'name',
        data: Array.from({ length: 10 }, (_, i) => ({
            name: `Step ${i + 1}`,
            value: 1600 - i * 100
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
        paddingOption: 'default',
        theme: 'light',
        backgroundColor: 'default',
        enableAnimation: true,
        animationDuration: 500,
        animationType: 'ease-out',
        dataKey: 'value',
        nameKey: 'name',
        valueKey: 'value',
        aspectRatio: 1.5,
        data: Array.from({ length: 10 }, (_, i) => ({
            name: `Node ${i + 1}`,
            value: 1600 - i * 100
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
            { dataKey: 'valueBar', name: 'Bar' },
            { dataKey: 'valueLine', name: 'Line' },
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
        paddingOption: 'default',
        theme: 'light',
        backgroundColor: 'default',
        enableAnimation: true,
        animationDuration: 600,
        animationType: 'ease-in-out',
        data: Array.from({ length: 10 }, (_, i) => ({
            category: `C${i + 1}`,
            valueBar: Math.round(20 + Math.random() * 80),
            valueLine: Math.round(10 + Math.random() * 90),
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
        paddingOption: 'default',
        theme: 'light',
        backgroundColor: 'default',
        enableAnimation: true,
        animationDuration: 500,
        animationType: 'ease-out',
        data: Array.from({ length: 10 }, (_, i) => ({
            category: `G${i + 1}`,
            value1: Math.round(10 + Math.random() * 90),
            value2: Math.round(5 + Math.random() * 45),
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
        paddingOption: 'default',
        theme: 'light',
        backgroundColor: 'default',
        enableAnimation: true,
        animationDuration: 600,
        animationType: 'ease-in-out',
        data: Array.from({ length: 10 }, (_, i) => ({
            category: `D${i + 1}`,
            value1: Math.round(15 + Math.random() * 85),
            value2: Math.round(10 + Math.random() * 70),
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
        paddingOption: 'default',
        theme: 'light',
        backgroundColor: 'default',
        enableAnimation: true,
        animationDuration: 700,
        animationType: 'ease-out',
        waterfallStartValue: 0,
        waterfallEndValue: 0, // ChartRenderer will compute running total
        data: Array.from({ length: 10 }, (_, i) => ({
            name: `Step ${i + 1}`,
            amount: (i % 2 === 0 ? 1 : -1) * Math.round(10 + Math.random() * 90)
        })),
    },
];


export function CreateChart() {

    const [selectedType, setSelectedType] = useState<typeof chartConfigs[number]['type']>(
        chartConfigs[0].type
    );

    const selectedConfig = chartConfigs.find(c => c.type === selectedType)!;

    return <>
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button variant="ghost" className="border">
                                                <span className="flex items-center">
                                                    <BarChart className="mr-2 h-4 w-4" />
                                                    <span>Create a chart</span>
                                                </span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="h-screen w-screen max-w-screen min-w-full overflow-y-auto">
                    <DialogHeader className="h-fit">
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you&apos;re
                            done.
                        </DialogDescription>
                    </DialogHeader>

                    {/*define a grid with */}

                    <RadioGroup
                        value={selectedType}
                        onValueChange={setSelectedType}
                        className={`grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4`}
                    >
                        {chartConfigs.map(cfg => (
                            <div key={cfg.type} className="border">
                                <RadioGroupItem value={cfg.type} id={cfg.type} className="hidden" />
                                <label className="text-sm font-medium cursor-pointer" htmlFor="{cfg.type}">
                                    {/*{cfg.type}*/}
                                    <ChartEditorProvider chart={{ config: cfg, data: cfg.data }}>
                                        <ChartRenderer />
                                    </ChartEditorProvider>
                                </label>
                            </div>
                        ))}
                    </RadioGroup>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    </>
}
