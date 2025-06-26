
import * as React from 'react';

import {
    BarChart,
    LineChart,
    PieChart,
    ScatterChart,
    TrendingUp,
    Sun,
    Moon,
    Monitor,
    Radar,
    Circle,
    GitFork,
    LayoutGrid,
    Layers
} from 'lucide-react';
import { CustomChartConfig } from '../../pages/charts/types';
import { useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ColorPicker } from "@/components/color-picker";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const chartControls = [
    {
        label: 'Type',
        key: 'type',
        useHtmlElement: 'radio-button',
        data: [
            { type: 'bar' as const, label: 'Bar Chart', icon: BarChart },
            { type: 'line' as const, label: 'Line Chart', icon: LineChart },
            { type: 'area' as const, label: 'Area Chart', icon: TrendingUp },
            { type: 'pie' as const, label: 'Pie Chart', icon: PieChart },
            { type: 'scatter' as const, label: 'Scatter Plot', icon: ScatterChart },
            { type: 'radar' as const, label: 'Radar Chart', icon: Radar },
            { type: 'radialBar' as const, label: 'Radial Bar', icon: Circle },
            { type: 'funnel' as const, label: 'Funnel Chart', icon: GitFork },
            { type: 'treemap' as const, label: 'Treemap', icon: LayoutGrid },
            { type: 'composed' as const, label: 'Composed', icon: Layers },
        ],
    },
    {
        label: 'Theme',
        key: 'theme',
        useHtmlElement: 'radio-button',
        data: ['light', 'dark', 'system'],
        supportedCharts: ['bar', 'line', 'area', 'pie', 'scatter', 'radar', 'radialBar', 'funnel', 'treemap', 'composed'],
        unSupportedCharts: [],
    },
    {
        label: 'Background Color',
        key: 'bgColor',
        useHtmlElement: 'radio-button',
        data: ['default', 'transparent', 'custom'],
        supportedCharts: ['bar', 'line', 'area', 'pie', 'scatter', 'radar', 'radialBar', 'funnel', 'treemap', 'composed'],
        unSupportedCharts: [],
    },
    {
        label: 'Title',
        key: 'title',
        useHtmlElement: 'text-input',
        supportedCharts: ['bar', 'line', 'area', 'pie', 'scatter', 'radar', 'radialBar', 'funnel', 'treemap', 'composed'],
        unSupportedCharts: [],
    },
    {
        label: 'Title Alignment',
        key: 'titleAlignment',
        useHtmlElement: 'radio-button',
        data: ['left', 'center', 'right'],
        supportedCharts: ['bar', 'line', 'area', 'pie', 'scatter', 'radar', 'radialBar', 'funnel', 'treemap', 'composed'],
        unSupportedCharts: [],
    },
    {
        label: 'Title Color',
        key: 'titleColor',
        useHtmlElement: 'color-input',
        supportedCharts: ['bar', 'line', 'area', 'pie', 'scatter', 'radar', 'radialBar', 'funnel', 'treemap', 'composed'],
        unSupportedCharts: [],
    },
    {
        label: 'Title Weight',
        key: 'titleWeight',
        useHtmlElement: 'radio-button',
        data: ['regular', 'bold'],
        supportedCharts: ['bar', 'line', 'area', 'pie', 'scatter', 'radar', 'radialBar', 'funnel', 'treemap', 'composed'],
        unSupportedCharts: [],
    },
    {
        label: 'Title Size',
        key: 'titleSize',
        useHtmlElement: 'radio-button',
        data: ['16px', '18px', '20px', '22px'],
        supportedCharts: ['bar', 'line', 'area', 'pie', 'scatter', 'radar', 'radialBar', 'funnel', 'treemap', 'composed'],
        unSupportedCharts: []
    },
    {
        label: 'Sub Title',
        key: 'subTitle',
        useHtmlElement: 'text-input',
        supportedCharts: ['bar', 'line', 'area', 'pie', 'scatter', 'radar', 'radialBar', 'funnel', 'treemap', 'composed'],
        unSupportedCharts: [],
    },
    {
        label: 'Sub Title Alignment',
        key: 'subTitleAlignment',
        useHtmlElement: 'radio-button',
        data: ['left', 'center', 'right'],
        supportedCharts: ['bar', 'line', 'area', 'pie', 'scatter', 'radar', 'radialBar', 'funnel', 'treemap', 'composed'],
        unSupportedCharts: [],
    },
    {
        label: 'Sub Title Color',
        key: 'subTitleColor',
        useHtmlElement: 'color-input',
        supportedCharts: ['bar', 'line', 'area', 'pie', 'scatter', 'radar', 'radialBar', 'funnel', 'treemap', 'composed'],
        unSupportedCharts: [],
    },
    {
        label: 'Sub Title Weight',
        key: 'subTitleWeight',
        useHtmlElement: 'radio-button',
        data: ['regular', 'bold'],
        supportedCharts: ['bar', 'line', 'area', 'pie', 'scatter', 'radar', 'radialBar', 'funnel', 'treemap', 'composed'],
        unSupportedCharts: [],
    },
    {
        label: 'Sub Title Size',
        key: 'subTitleSize',
        useHtmlElement: 'radio-button',
        data: ['16px', '18px', '20px', '22px'],
        supportedCharts: ['bar', 'line', 'area', 'pie', 'scatter', 'radar', 'radialBar', 'funnel', 'treemap', 'composed'],
        unSupportedCharts: [],
    },
]

const chartTypes = [
    { type: 'bar' as const, label: 'Bar Chart', icon: BarChart },
    { type: 'line' as const, label: 'Line Chart', icon: LineChart },
    { type: 'area' as const, label: 'Area Chart', icon: TrendingUp },
    // { type: 'pie' as const, label: 'Pie Chart', icon: PieChart },
    // { type: 'scatter' as const, label: 'Scatter Plot', icon: ScatterChart },
    // { type: 'radar' as const, label: 'Radar Chart', icon: Radar },
    // { type: 'radialBar' as const, label: 'Radial Bar', icon: Circle },
    // { type: 'funnel' as const, label: 'Funnel Chart', icon: GitFork },
    // { type: 'treemap' as const, label: 'Treemap', icon: LayoutGrid },
    // { type: 'composed' as const, label: 'Composed', icon: Layers },
];

const colorSchemes = [
    ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
    ['#1e40af', '#059669', '#d97706', '#dc2626', '#7c3aed'],
    ['#0ea5e9', '#06b6d4', '#84cc16', '#eab308', '#f97316'],
];

const tooltipFormats = [
    { value: 'default', label: 'Default' },
    { value: 'currency', label: 'Currency ($)' },
    { value: 'percentage', label: 'Percentage (%)' },
    { value: 'decimal', label: 'Decimal (0.00)' },
    { value: 'custom', label: 'Custom Format' },
];

const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
]

const alignments = [
    { value: 'left', label: 'Left' },
    { value: 'center', label: 'Center' },
    { value: 'right', label: 'Right' }
];

const fontWeights = [
    { value: 'normal', label: 'Regular' },
    { value: 'bold', label: 'Bold' }
];

const columns = [];


interface ChartControlsProps {
    config: CustomChartConfig;
    onConfigChange: (config: CustomChartConfig) => void;
}

export const ChartControls: React.FC<ChartControlsProps> = ({config, onConfigChange}) => {

    const updateConfig = useCallback((updates: Partial<CustomChartConfig>) => {
        onConfigChange({ ...config, ...updates });
    }, [config, onConfigChange]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Chart Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 h-full max-h-[calc(100vh-300px)] lg:max-h-[calc(100vh-200px)] overflow-y-auto overscroll-contain">
                {/* Chart Type */}
                <div>
                    <h4 className="mb-3 text-sm font-medium">Chart Type</h4>
                    <ToggleGroup
                        type="single"
                        value={config.type}
                        onValueChange={(val) => updateConfig({ type: val })}
                        className="grid grid-cols-2 sm:grid-cols-3 gap-2"
                    >
                        {chartTypes.map(({ type, label, icon: Icon }) => (
                            <ToggleGroupItem
                                key={type}
                                value={type}
                                className="flex items-center space-x-2 py-2 rounded-lg border"
                            >
                                <Icon className="w-4 h-4" />
                                <span className="text-xs font-medium">{label}</span>
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                </div>

                {/* Theme Selection */}
                <div>
                    <h4 className="mb-3 text-sm font-medium">Chart Theme</h4>
                    <ToggleGroup
                        type="single"
                        value={config.theme}
                        onValueChange={(val) => updateConfig({ theme: val as any })}
                        className="grid grid-cols-2 sm:grid-cols-3 gap-2"
                    >
                        {themes.map(({ value, label, icon: Icon }) => (
                            <ToggleGroupItem
                                key={value}
                                value={value}
                                className="flex flex-1 items-center space-x-2 py-2 rounded-lg border"
                            >
                                <Icon className="w-4 h-4" />
                                <span className="text-sm font-medium">{label}</span>
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                </div>

                {/* Background Color */}
                <div>
                    <h4 className="mb-3 text-sm font-medium">Background Color</h4>
                    <RadioGroup
                        value={config.backgroundColor ?? 'default'}
                        onValueChange={(value) => updateConfig({ backgroundColor: value as any })}
                    >
                        <div className="flex items-center gap-3">
                            <RadioGroupItem id="default" value="default">
                            </RadioGroupItem>
                            <label className="text-sm font-medium" htmlFor="default">Default (Theme Based)</label>
                        </div>
                        <div className="flex items-center gap-3">
                            <RadioGroupItem id="transparent" value="transparent" />
                            <label className="text-sm font-medium" htmlFor="transparent">Transparent</label>
                        </div>
                        <div className="flex items-center gap-3">
                            <RadioGroupItem id="custom" value="custom" />
                            <label className="text-sm font-medium" htmlFor="custom">Custom Color</label>
                        </div>
                    </RadioGroup>
                    {config.backgroundColor && !['default', 'transparent'].includes(config.backgroundColor) && (
                        <div className="flex items-center space-x-2 py-2">
                            <ColorPicker
                                value={config.backgroundColor}
                                onChange={(val) => updateConfig({ backgroundColor: val })}
                            />
                            <Input
                                value={config.backgroundColor}
                                onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
                                placeholder="#ffffff"
                            />
                        </div>
                    )}
                </div>

                {/* Title Settings */}
                <div className="space-y-4">
                    <h4 className="mb-3 text-sm font-medium">Title Settings</h4>

                    {/* Chart Title */}
                    <Input
                        value={config.title}
                        onChange={(e) => updateConfig({ title: e.target.value })}
                        placeholder="Enter chart title"
                    />

                    {/* Title Alignment */}
                    <ToggleGroup
                        type="single"
                        value={config.titleAlignment}
                        onValueChange={(val) => updateConfig({ titleAlignment: val as any })}
                        className="grid grid-cols-2 sm:grid-cols-3 gap-2"
                    >
                        {alignments.map(({ value, label }) => (
                            <ToggleGroupItem
                                key={value}
                                value={value}
                                className="flex flex-1 items-center space-x-2 py-2 rounded-lg border"
                            >
                                <span className="text-sm font-medium">{label}</span>
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>

                    {/* Title Color */}
                    <div className="flex items-center space-x-3">
                        <ColorPicker
                            value={config.titleColor}
                            onChange={(val) => updateConfig({ titleColor: val })}
                        />
                        <Input
                            value={config.titleColor}
                            onChange={(e) => updateConfig({ titleColor: e.target.value })}
                            placeholder="#000000"
                        />
                    </div>

                    {/* Title Weight */}
                    <ToggleGroup
                        type="single"
                        value={config.titleWeight}
                        onValueChange={(val) => updateConfig({ titleWeight: val as any })}
                        className="grid grid-cols-2 sm:grid-cols-2 gap-2"
                    >
                        {fontWeights.map(({ value, label }) => (
                            <ToggleGroupItem
                                key={value}
                                value={value}
                                className="flex flex-1 items-center space-x-2 py-2 rounded-lg border"
                            >
                                <span className="text-sm font-medium">{label}</span>
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>

                    {/* Subtitle */}
                    <Input
                        value={config.subtitle}
                        onChange={(e) => updateConfig({ subtitle: e.target.value })}
                        placeholder="Enter subtitle (optional)"
                    />
                    <div className="flex items-center space-x-3">
                        <ColorPicker
                            value={config.subtitleColor}
                            onChange={(val) => updateConfig({ subtitleColor: val })}
                        />
                        <Input
                            value={config.subtitleColor}
                            onChange={(e) => updateConfig({ subtitleColor: e.target.value })}
                            placeholder="#666666"
                        />
                    </div>
                </div>

                {/* Axis Configuration */}
                {!['pie', 'radar', 'radialBar', 'funnel', 'treemap'].includes(config.type) && (
                    <div className="space-y-4">
                        <h4 className="mb-3 text-sm font-medium">Axis Configuration</h4>
                        <Select value={config.xAxis} onValueChange={(val) => updateConfig({ xAxis: val })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select X axis column" />
                            </SelectTrigger>
                            <SelectContent>
                                {columns.map((col) => (
                                    <SelectItem key={col} value={col}>{col}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Input
                            value={config.xAxisLabel || ''}
                            onChange={(e) => updateConfig({ xAxisLabel: e.target.value })}
                            placeholder="Enter X-axis label (optional)"
                        />
                        <Select value={config.yAxis} onValueChange={(val) => updateConfig({ yAxis: val })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Y axis columns" />
                            </SelectTrigger>
                            <SelectContent>
                                {columns.map((col) => (
                                    <SelectItem key={col} value={col}>{col}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Input
                            value={config.yAxisLabel || ''}
                            onChange={(e) => updateConfig({ yAxisLabel: e.target.value })}
                            placeholder="Enter Y-axis label (optional)"
                        />
                    </div>
                )}

                {/* Padding Options */}
                <div className="space-y-4">
                    <h4 className="mb-3 text-sm font-medium">Padding Options</h4>
                    <RadioGroup
                        value={config.paddingOption}
                        onValueChange={(value) => updateConfig({ paddingOption: value as any })}
                    >
                        <div className="flex items-center gap-2">
                            <RadioGroupItem id="default" value="default" />
                            <label className="text-sm font-medium" htmlFor="default">Default</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <RadioGroupItem id="none" value="none" />
                            <label className="text-sm font-medium" htmlFor="none">None</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <RadioGroupItem id="custom" value="custom" />
                            <label className="text-sm font-medium" htmlFor="custom">Custom</label>
                        </div>
                    </RadioGroup>
                    {config.paddingOption === 'custom' && (
                        <Input
                            type="number"
                            value={config.customPaddingValue || 0}
                            onChange={(e) => updateConfig({ customPaddingValue: parseInt(e.target.value) || 0 })}
                            placeholder="Padding value (px)"
                        />
                    )}
                </div>

                {/* Tooltip Settings */}
                <div className="space-y-4">
                    <h4 className="mb-3 text-sm font-medium">Tooltip Settings</h4>
                    <Select
                        value={config.tooltipFormat || 'default'}
                        onValueChange={(val) => updateConfig({ tooltipFormat: val as any })}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {tooltipFormats.map((fmt) => (
                                <SelectItem key={fmt.value} value={fmt.value}>{fmt.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {config.tooltipFormat === 'custom' && (
                        <Input
                            value={config.tooltipCustomFormat || ''}
                            onChange={(e) => updateConfig({ tooltipCustomFormat: e.target.value })}
                            placeholder="e.g., ${value} (use {value} as placeholder)"
                        />
                    )}
                </div>

                {/* Color Schemes */}
                <div className="space-y-4">
                    <h4 className="mb-3 text-sm font-medium">Color Scheme</h4>
                    <ToggleGroup
                        type="single"
                        value={colorSchemes
                            .findIndex(s => JSON.stringify(s) === JSON.stringify(config.colors))
                            .toString()}
                        onValueChange={(val) =>
                            updateConfig({ colors: colorSchemes[parseInt(val, 10)] })
                        }
                        className="flex flex-col flex-1 space-y-2"
                    >
                        {colorSchemes.map((scheme, idx) => (
                            <ToggleGroupItem
                                key={idx}
                                value={idx.toString()}
                                className="flex items-center space-x-2 py-2 rounded-lg border w-full"
                            >
                                <div className="flex space-x-1">
                                    {scheme.map((color, i) => (
                                        <div
                                            key={i}
                                            className="w-6 h-6 rounded-full border"
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                                <span>Scheme {idx + 1}</span>
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                </div>

                {/* Display Options */}
                <div className="space-y-3">
                    <h4 className="mb-3 text-sm font-medium">Display Options</h4>
                    <div className="flex items-center gap-3">
                        <Checkbox
                            id="showGrid"
                            checked={config.showGrid}
                            onCheckedChange={(checked) => updateConfig({ showGrid: !!checked })}
                        />
                        <label className="text-sm font-medium" htmlFor="showGrid">Show Grid</label>
                    </div>
                    <div className="flex items-center gap-3">
                        <Checkbox
                            id="showLegend"
                            checked={config.showLegend}
                            onCheckedChange={(checked) => updateConfig({ showLegend: !!checked })}
                        />
                        <label className="text-sm font-medium" htmlFor="showLegend">Show Legend</label>
                    </div>
                    {!['pie', 'radar', 'radialBar', 'funnel', 'treemap'].includes(config.type) && (
                        <>
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="showXAxis"
                                    checked={config.showXAxis}
                                    onCheckedChange={(checked) => updateConfig({ showXAxis: !!checked })}
                                />
                                <label className="text-sm font-medium" htmlFor="showXAxis">Show X-Axis Line</label>
                            </div>
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="showYAxis"
                                    checked={config.showYAxis}
                                    onCheckedChange={(checked) => updateConfig({ showYAxis: !!checked })}
                                />
                                <label className="text-sm font-medium" htmlFor="showYAxis">Show Y-Axis Line</label>
                            </div>
                        </>
                    )}
                </div>

                {/* Dimensions */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h4 className="mb-2 text-sm font-medium">Width</h4>
                        <Input
                            type="number"
                            value={config.width}
                            onChange={(e) => updateConfig({ width: parseInt(e.target.value) || 800 })}
                            min={300}
                            max={1200}
                        />
                    </div>
                    <div>
                        <h4 className="mb-2 text-sm font-medium">Height</h4>
                        <Input
                            type="number"
                            value={config.height}
                            onChange={(e) => updateConfig({ height: parseInt(e.target.value) || 600 })}
                            min={200}
                            max={800}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
        // <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        //     <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Chart Configuration</h3>
        //
        //     <div className="space-y-6">
        //         {/* Chart Type */}
        //         <div>
        //             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Chart Type</label>
        //             <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        //                 {chartTypes.map(({ type, label, icon: Icon }) => (
        //                     <button
        //                         key={type}
        //                         onClick={() => updateConfig({ type })}
        //                         className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200 ${
        //                             config.type === type
        //                                 ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
        //                                 : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
        //                         }`}
        //                     >
        //                         <Icon className="w-4 h-4" />
        //                         <span className="text-sm font-medium">{label}</span>
        //                     </button>
        //                 ))}
        //             </div>
        //         </div>
        //
        //         {/* Theme Selection */}
        //         <div className="space-y-4">
        //             <h4 className="text-md font-medium text-gray-900 dark:text-white">Chart Theme</h4>
        //             <div className="flex space-x-2">
        //                 {themes.map(({ value, label, icon: Icon }) => (
        //                     <button
        //                         key={value}
        //                         onClick={() => updateConfig({ theme: value as 'light' | 'dark' | 'system' })}
        //                         className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200 ${
        //                             config.theme === value
        //                                 ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
        //                                 : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
        //                         }`}
        //                     >
        //                         <Icon className="w-4 h-4" />
        //                         <span className="text-sm font-medium">{label}</span>
        //                     </button>
        //                 ))}
        //             </div>
        //         </div>
        //
        //         {/* Background Color */}
        //         <div className="space-y-4">
        //             <h4 className="text-md font-medium text-gray-900 dark:text-white">Background Color</h4>
        //             <div className="flex flex-col space-y-3">
        //                 <div className="flex items-center space-x-3">
        //                     <input
        //                         type="radio"
        //                         id="bgDefault"
        //                         checked={!config.backgroundColor || config.backgroundColor === 'default'}
        //                         onChange={() => updateConfig({ backgroundColor: 'default' })}
        //                         className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 focus:ring-blue-500 bg-white dark:bg-gray-700"
        //                     />
        //                     <label htmlFor="bgDefault" className="text-sm text-gray-700 dark:text-gray-300">Default (Theme Based)</label>
        //                 </div>
        //
        //                 <div className="flex items-center space-x-3">
        //                     <input
        //                         type="radio"
        //                         id="bgTransparent"
        //                         checked={config.backgroundColor === 'transparent'}
        //                         onChange={() => updateConfig({ backgroundColor: 'transparent' })}
        //                         className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 focus:ring-blue-500 bg-white dark:bg-gray-700"
        //                     />
        //                     <label htmlFor="bgTransparent" className="text-sm text-gray-700 dark:text-gray-300">Transparent</label>
        //                 </div>
        //
        //                 <div className="flex items-center space-x-3">
        //                     <input
        //                         type="radio"
        //                         id="bgCustom"
        //                         checked={config.backgroundColor !== 'default' && config.backgroundColor !== 'transparent' && !!config.backgroundColor}
        //                         onChange={() => updateConfig({ backgroundColor: config.backgroundColor || '#ffffff' })}
        //                         className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 focus:ring-blue-500 bg-white dark:bg-gray-700"
        //                     />
        //                     <label htmlFor="bgCustom" className="text-sm text-gray-700 dark:text-gray-300">Custom Color</label>
        //                 </div>
        //
        //                 {config.backgroundColor !== 'default' && config.backgroundColor !== 'transparent' && (
        //                     <div className="pl-7">
        //                         <div className="flex items-center space-x-3">
        //                             <input
        //                                 type="color"
        //                                 value={config.backgroundColor || '#ffffff'}
        //                                 onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
        //                                 className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
        //                             />
        //                             <input
        //                                 type="text"
        //                                 value={config.backgroundColor || '#ffffff'}
        //                                 onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
        //                                 className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        //                                 placeholder="#ffffff"
        //                             />
        //                         </div>
        //                     </div>
        //                 )}
        //             </div>
        //         </div>
        //
        //         {/* Title Configuration */}
        //         <div className="space-y-4">
        //             <h4 className="text-md font-medium text-gray-900 dark:text-white">Title Settings</h4>
        //
        //             {/* Chart Title */}
        //             <div>
        //                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Chart Title</label>
        //                 <input
        //                     type="text"
        //                     value={config.title}
        //                     onChange={(e) => updateConfig({ title: e.target.value })}
        //                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        //                     placeholder="Enter chart title"
        //                 />
        //             </div>
        //
        //             {/* Title Alignment */}
        //             <div>
        //                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title Alignment</label>
        //                 <div className="flex space-x-2">
        //                     {alignments.map(({ value, label }) => (
        //                         <button
        //                             key={value}
        //                             onClick={() => updateConfig({ titleAlignment: value as 'left' | 'center' | 'right' })}
        //                             className={`flex-1 px-3 py-2 rounded-lg border transition-all duration-200 text-sm font-medium ${
        //                                 config.titleAlignment === value
        //                                     ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
        //                                     : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
        //                             }`}
        //                         >
        //                             {label}
        //                         </button>
        //                     ))}
        //                 </div>
        //             </div>
        //
        //             {/* Title Color */}
        //             <div>
        //                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title Color</label>
        //                 <div className="flex items-center space-x-3">
        //                     <input
        //                         type="color"
        //                         value={config.titleColor}
        //                         onChange={(e) => updateConfig({ titleColor: e.target.value })}
        //                         className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
        //                     />
        //                     <input
        //                         type="text"
        //                         value={config.titleColor}
        //                         onChange={(e) => updateConfig({ titleColor: e.target.value })}
        //                         className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        //                         placeholder="#000000"
        //                     />
        //                 </div>
        //             </div>
        //
        //             {/* Title Weight */}
        //             <div>
        //                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title Weight</label>
        //                 <div className="flex space-x-2">
        //                     {fontWeights.map(({ value, label }) => (
        //                         <button
        //                             key={value}
        //                             onClick={() => updateConfig({ titleWeight: value as 'normal' | 'bold' })}
        //                             className={`flex-1 px-3 py-2 rounded-lg border transition-all duration-200 text-sm font-medium ${
        //                                 config.titleWeight === value
        //                                     ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
        //                                     : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
        //                             }`}
        //                         >
        //                             {label}
        //                         </button>
        //                     ))}
        //                 </div>
        //             </div>
        //
        //             {/* Subtitle */}
        //             <div>
        //                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subtitle</label>
        //                 <input
        //                     type="text"
        //                     value={config.subtitle}
        //                     onChange={(e) => updateConfig({ subtitle: e.target.value })}
        //                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        //                     placeholder="Enter subtitle (optional)"
        //                 />
        //             </div>
        //
        //             {/* Subtitle Color */}
        //             <div>
        //                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subtitle Color</label>
        //                 <div className="flex items-center space-x-3">
        //                     <input
        //                         type="color"
        //                         value={config.subtitleColor}
        //                         onChange={(e) => updateConfig({ subtitleColor: e.target.value })}
        //                         className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
        //                     />
        //                     <input
        //                         type="text"
        //                         value={config.subtitleColor}
        //                         onChange={(e) => updateConfig({ subtitleColor: e.target.value })}
        //                         className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        //                         placeholder="#666666"
        //                     />
        //                 </div>
        //             </div>
        //         </div>
        //
        //         {/* Axis Configuration */}
        //         {!['pie', 'radar', 'radialBar', 'funnel', 'treemap'].includes(config.type) && (
        //             <div className="space-y-4">
        //                 <h4 className="text-md font-medium text-gray-900 dark:text-white">Axis Configuration</h4>
        //
        //                 <div>
        //                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">X-Axis</label>
        //                     <select
        //                         value={config.xAxis}
        //                         onChange={(e) => updateConfig({ xAxis: e.target.value })}
        //                         className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        //                     >
        //                         <option value="">Select column</option>
        //                         {/*{columns.map((column) => (
        //                             <option key={column} value={column}>{column}</option>
        //                         ))}*/}
        //                     </select>
        //                 </div>
        //
        //                 <div>
        //                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">X-Axis Label</label>
        //                     <input
        //                         type="text"
        //                         value={config.xAxisLabel || ''}
        //                         onChange={(e) => updateConfig({ xAxisLabel: e.target.value })}
        //                         className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        //                         placeholder="Enter X-axis label (optional)"
        //                     />
        //                 </div>
        //
        //                 <div>
        //                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Y-Axis</label>
        //                     <select
        //                         value={config.yAxis}
        //                         onChange={(e) => updateConfig({ yAxis: e.target.value })}
        //                         className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        //                     >
        //                         <option value="">Select column</option>
        //                         {/*{columns.map((column) => (
        //                             <option key={column} value={column}>{column}</option>
        //                         ))}*/}
        //                     </select>
        //                 </div>
        //
        //                 <div>
        //                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Y-Axis Label</label>
        //                     <input
        //                         type="text"
        //                         value={config.yAxisLabel || ''}
        //                         onChange={(e) => updateConfig({ yAxisLabel: e.target.value })}
        //                         className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        //                         placeholder="Enter Y-axis label (optional)"
        //                     />
        //                 </div>
        //             </div>
        //         )}
        //
        //         {/* Padding Configuration */}
        //         <div className="space-y-4">
        //             <h4 className="text-md font-medium text-gray-900 dark:text-white">Padding Options</h4>
        //
        //             <div className="space-y-3">
        //                 <div className="flex items-center space-x-3">
        //                     <input
        //                         type="radio"
        //                         id="paddingDefault"
        //                         checked={config.paddingOption === 'default'}
        //                         onChange={() => updateConfig({ paddingOption: 'default' })}
        //                         className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 focus:ring-blue-500 bg-white dark:bg-gray-700"
        //                     />
        //                     <label htmlFor="paddingDefault" className="text-sm text-gray-700 dark:text-gray-300">Default</label>
        //                 </div>
        //
        //                 <div className="flex items-center space-x-3">
        //                     <input
        //                         type="radio"
        //                         id="paddingNone"
        //                         checked={config.paddingOption === 'none'}
        //                         onChange={() => updateConfig({ paddingOption: 'none' })}
        //                         className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 focus:ring-blue-500 bg-white dark:bg-gray-700"
        //                     />
        //                     <label htmlFor="paddingNone" className="text-sm text-gray-700 dark:text-gray-300">None</label>
        //                 </div>
        //
        //                 <div className="flex items-center space-x-3">
        //                     <input
        //                         type="radio"
        //                         id="paddingCustom"
        //                         checked={config.paddingOption === 'custom'}
        //                         onChange={() => updateConfig({ paddingOption: 'custom' })}
        //                         className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 focus:ring-blue-500 bg-white dark:bg-gray-700"
        //                     />
        //                     <label htmlFor="paddingCustom" className="text-sm text-gray-700 dark:text-gray-300">Custom</label>
        //                 </div>
        //
        //                 {config.paddingOption === 'custom' && (
        //                     <div className="pl-7">
        //                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Padding Value (px)</label>
        //                         <input
        //                             type="number"
        //                             value={config.customPaddingValue || 0}
        //                             onChange={(e) => updateConfig({ customPaddingValue: parseInt(e.target.value) || 0 })}
        //                             className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        //                             min="0"
        //                             max="100"
        //                         />
        //                     </div>
        //                 )}
        //             </div>
        //         </div>
        //
        //         {/* Tooltip Configuration */}
        //         <div className="space-y-4">
        //             <h4 className="text-md font-medium text-gray-900 dark:text-white">Tooltip Settings</h4>
        //
        //             <div>
        //                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tooltip Format</label>
        //                 <select
        //                     value={config.tooltipFormat || 'default'}
        //                     onChange={(e) => updateConfig({ tooltipFormat: e.target.value as CustomChartConfig['tooltipFormat'] })}
        //                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        //                 >
        //                     {tooltipFormats.map((format) => (
        //                         <option key={format.value} value={format.value}>{format.label}</option>
        //                     ))}
        //                 </select>
        //             </div>
        //
        //             {config.tooltipFormat === 'custom' && (
        //                 <div>
        //                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Custom Format</label>
        //                     <input
        //                         type="text"
        //                         value={config.tooltipCustomFormat || ''}
        //                         onChange={(e) => updateConfig({ tooltipCustomFormat: e.target.value })}
        //                         className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        //                         placeholder="e.g., ${value} (use {value} as placeholder)"
        //                     />
        //                     <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        //                         Use {'{value}'} as a placeholder for the actual value
        //                     </p>
        //                 </div>
        //             )}
        //         </div>
        //
        //         {/* Color Schemes */}
        //         <div>
        //             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Color Scheme</label>
        //             <div className="space-y-2">
        //                 {colorSchemes.map((scheme, index) => (
        //                     <button
        //                         key={index}
        //                         onClick={() => updateConfig({ colors: scheme })}
        //                         className={`flex items-center space-x-3 w-full p-3 rounded-lg border transition-all duration-200 ${
        //                             JSON.stringify(config.colors) === JSON.stringify(scheme)
        //                                 ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
        //                                 : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
        //                         }`}
        //                     >
        //                         <div className="flex space-x-1">
        //                             {scheme.map((color, colorIndex) => (
        //                                 <div
        //                                     key={colorIndex}
        //                                     className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-600"
        //                                     style={{ backgroundColor: color }}
        //                                 />
        //                             ))}
        //                         </div>
        //                         <span className="text-sm text-gray-700 dark:text-gray-300">Scheme {index + 1}</span>
        //                     </button>
        //                 ))}
        //             </div>
        //         </div>
        //
        //         {/* Display Options */}
        //         <div className="space-y-3">
        //             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Display Options</label>
        //
        //             <div className="flex items-center space-x-3">
        //                 <input
        //                     type="checkbox"
        //                     id="showGrid"
        //                     checked={config.showGrid}
        //                     onChange={(e) => updateConfig({ showGrid: e.target.checked })}
        //                     className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 bg-white dark:bg-gray-700"
        //                 />
        //                 <label htmlFor="showGrid" className="text-sm text-gray-700 dark:text-gray-300">Show Grid</label>
        //             </div>
        //
        //             <div className="flex items-center space-x-3">
        //                 <input
        //                     type="checkbox"
        //                     id="showLegend"
        //                     checked={config.showLegend}
        //                     onChange={(e) => updateConfig({ showLegend: e.target.checked })}
        //                     className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 bg-white dark:bg-gray-700"
        //                 />
        //                 <label htmlFor="showLegend" className="text-sm text-gray-700 dark:text-gray-300">Show Legend</label>
        //             </div>
        //
        //             {/* Axis Line Options - Only show for non-pie charts */}
        //             {!['pie', 'radar', 'radialBar', 'funnel', 'treemap'].includes(config.type) && (
        //                 <>
        //                     <div className="flex items-center space-x-3">
        //                         <input
        //                             type="checkbox"
        //                             id="showXAxis"
        //                             checked={config.showXAxis}
        //                             onChange={(e) => updateConfig({ showXAxis: e.target.checked })}
        //                             className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 bg-white dark:bg-gray-700"
        //                         />
        //                         <label htmlFor="showXAxis" className="text-sm text-gray-700 dark:text-gray-300">Show X-Axis Line</label>
        //                     </div>
        //
        //                     <div className="flex items-center space-x-3">
        //                         <input
        //                             type="checkbox"
        //                             id="showYAxis"
        //                             checked={config.showYAxis}
        //                             onChange={(e) => updateConfig({ showYAxis: e.target.checked })}
        //                             className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 bg-white dark:bg-gray-700"
        //                         />
        //                         <label htmlFor="showYAxis" className="text-sm text-gray-700 dark:text-gray-300">Show Y-Axis Line</label>
        //                     </div>
        //                 </>
        //             )}
        //         </div>
        //
        //         {/* Dimensions */}
        //         <div className="grid grid-cols-2 gap-4">
        //             <div>
        //                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Width</label>
        //                 <input
        //                     type="number"
        //                     value={config.width}
        //                     onChange={(e) => updateConfig({ width: parseInt(e.target.value) || 800 })}
        //                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        //                     min="300"
        //                     max="1200"
        //                 />
        //             </div>
        //             <div>
        //                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Height</label>
        //                 <input
        //                     type="number"
        //                     value={config.height}
        //                     onChange={(e) => updateConfig({ height: parseInt(e.target.value) || 600 })}
        //                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        //                     min="200"
        //                     max="1200"
        //                 />
        //             </div>
        //         </div>
        //     </div>
        // </div>
    );
};
