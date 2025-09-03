import { createContext, useContext, useEffect, useState } from 'react';
import { CustomChartConfig } from '@/pages/charts/types';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

interface DataPoint {
    [key: string]: string | number;
}

interface ChartEditorContextType {
    config: CustomChartConfig;
    setConfig: React.Dispatch<React.SetStateAction<CustomChartConfig>>;
    data: DataPoint[];
    setData: React.Dispatch<React.SetStateAction<DataPoint[]>>;
    columns: string[];
    setColumns: React.Dispatch<React.SetStateAction<string[]>>;
    updating: boolean;
    setUpdating: React.Dispatch<React.SetStateAction<boolean>>;
    chart: {
        config: CustomChartConfig;
        data: DataPoint[];
        project_id: number | string;
        uuid: string;
        id: number | string;
    };
    updateChart: (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => void;
}

const ChartEditorContext = createContext<ChartEditorContextType | undefined>(undefined);

export function useChartEditor() {
    const context = useContext(ChartEditorContext);
    if (!context) {
        throw new Error('useChartEditor must be used within a ChartEditorProvider');
    }
    return context;
}

interface ChartEditorProviderProps {
    chart: {
        config: CustomChartConfig;
        data: any[];
        project_id?: number | string;
        uuid?: string;
        id?: number | string;
    };
    children: React.ReactNode;
}

// Default configuration for new chart properties
const getDefaultConfig = (chartConfig: Partial<CustomChartConfig>): CustomChartConfig => {
    return {
        // Basic chart properties
        type: chartConfig.type ?? 'bar',
        title: chartConfig.title ?? '',
        titleAlignment: chartConfig.titleAlignment ?? 'center',
        titleColor: chartConfig.titleColor ?? '#111827',
        titleWeight: chartConfig.titleWeight ?? 'bold',
        subtitle: chartConfig.subtitle ?? '',
        subtitleColor: chartConfig.subtitleColor ?? '#6b7280',

        // Axis configuration
        xAxis: chartConfig.xAxis ?? '',
        yAxis: chartConfig.yAxis ?? '', // Keep for backward compatibility
        xAxisLabel: chartConfig.xAxisLabel ?? '',
        yAxisLabel: chartConfig.yAxisLabel ?? '',

        // Series configuration (new multi-series support)
        series: chartConfig.series ?? [],

        // Tooltip configuration
        tooltipFormat: chartConfig.tooltipFormat ?? 'default',
        tooltipCustomFormat: chartConfig.tooltipCustomFormat ?? '',
        showTooltip: chartConfig.showTooltip ?? true,

        // Colors and styling
        colors: chartConfig.colors ?? ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],

        // Grid and display options
        showGrid: chartConfig.showGrid ?? true,
        grid: chartConfig.grid ?? {
            vertical: true,
            horizontal: true,
            stroke: '#e0e0e0',
            strokeDasharray: '3 3',
            fill: '#fafafa',
            strokeWidth: 1,
        },
        showLegend: chartConfig.showLegend ?? true,
        legendPosition: chartConfig.legendPosition ?? 'bottom',
        showXAxis: chartConfig.showXAxis ?? true,
        showYAxis: chartConfig.showYAxis ?? true,
        showCartesianGrid: chartConfig.showCartesianGrid ?? true,

        // Dimensions
        width: chartConfig.width ?? 800,
        height: chartConfig.height ?? 600,

        // Padding
        paddingOption: chartConfig.paddingOption ?? 'default',
        customPaddingValue: chartConfig.customPaddingValue ?? 20,

        // Theme
        theme: chartConfig.theme ?? 'light',
        backgroundColor: chartConfig.backgroundColor ?? 'default',

        // Animation settings (new)
        enableAnimation: chartConfig.enableAnimation ?? true,
        animationDuration: chartConfig.animationDuration ?? 1000,
        animationType: chartConfig.animationType ?? 'ease',

        // Chart-specific options for special chart types
        // Pie/Radial chart options
        innerRadius: chartConfig.innerRadius ?? 0,
        outerRadius: chartConfig.outerRadius ?? 80,
        startAngle: chartConfig.startAngle ?? 0,
        endAngle: chartConfig.endAngle ?? 360,
        dataKey: chartConfig.dataKey ?? 'value',
        nameKey: chartConfig.nameKey ?? 'name',
        valueKey: chartConfig.valueKey ?? 'value',

        // Radar specific
        radarKeys: chartConfig.radarKeys ?? [],

        // Treemap specific
        aspectRatio: chartConfig.aspectRatio ?? 4/3,

        // Funnel specific
        funnelWidth: chartConfig.funnelWidth ?? 100,
        funnelHeight: chartConfig.funnelHeight ?? 100,

        // Waterfall specific
        waterfallStartValue: chartConfig.waterfallStartValue ?? 0,
        waterfallEndValue: chartConfig.waterfallEndValue ?? 0,
    };
};

// Helper function to get default chart type for series based on main chart type
const getDefaultSeriesChartType = (chartType: string) => {
    switch (chartType) {
        case 'stackedBar':
            return 'bar';
        case 'stackedArea':
            return 'area';
        case 'scatter':
            return 'scatter';
        case 'pie':
        case 'radar':
        case 'radialBar':
        case 'funnel':
        case 'treemap':
            return 'line'; // Default fallback
        default:
            return 'line';
    }
};

export function ChartEditorProvider({ chart, children }: ChartEditorProviderProps) {
    const [config, setConfig] = useState<CustomChartConfig>(getDefaultConfig(chart.config));
    const [data, setData] = useState<DataPoint[]>(chart.data);
    const [columns, setColumns] = useState<string[]>(chart.data.length > 0 ? Object.keys(chart.data[0]) : []);
    const [updating, setUpdating] = useState(false);

    // Initialize data and columns when component mounts or data changes
    useEffect(() => {
        if (data.length > 0) {
            console.log('datadatadatadata');
            console.log(data);
            const newColumns = Object.keys(data[0]);
            console.log('newColumnsnewColumns');
            console.log(newColumns);
            setColumns(newColumns);

            // Auto-configure chart if not already configured
            if (!config.xAxis && newColumns.length > 0) {
                const defaultXAxis = newColumns[0];
                const defaultSeriesKey = newColumns.length > 1 ? newColumns[1] : newColumns[0];

                // For non-composed charts, set up default configuration
                console.log('config.type !== \'composed\' && config.series.length === 0');
                console.log(config.type !== 'composed' && config.series.length === 0);
                if (config.type !== 'composed' && config.series.length === 0) {
                    setConfig(prevConfig => ({
                        ...prevConfig,
                        xAxis: defaultXAxis,
                        series: [{
                            dataKey: defaultSeriesKey,
                            chartType: getDefaultSeriesChartType(prevConfig.type),
                            type: 'monotone',
                            fill: prevConfig.colors[0] || '#3b82f6',
                            stroke: prevConfig.colors[0] || '#3b82f6',
                        }]
                    }));
                }
            }
        } else {
            setConfig(prevConfig => ({
                ...prevConfig,
                xAxis: '',
                series: []
            }));
            setColumns([]);
        }
    }, [data]);

    // Clean up series when xAxis changes to prevent conflicts
    useEffect(() => {
        if (config.xAxis && config.series.length > 0) {
            const filteredSeries = config.series.filter(series => series.dataKey !== config.xAxis);

            // If all series were filtered out, add a default one
            if (filteredSeries.length === 0) {
                const defaultSeriesKey = columns.find(col => col !== config.xAxis);
                if (defaultSeriesKey) {
                    filteredSeries.push({
                        dataKey: defaultSeriesKey,
                        chartType: getDefaultSeriesChartType(config.type),
                        type: 'monotone',
                        fill: config.colors[0] || '#3b82f6',
                        stroke: config.colors[0] || '#3b82f6',
                    });
                }
            }

            // Only update if series actually changed
            if (filteredSeries.length !== config.series.length ||
                filteredSeries.some((series, index) => series.dataKey !== config.series[index]?.dataKey)) {
                setConfig(prevConfig => ({
                    ...prevConfig,
                    series: filteredSeries
                }));
            }
        }
    }, [config.xAxis, columns]);

    // Handle chart type changes and adjust series accordingly
    useEffect(() => {
        if (config.series.length > 0) {
            const needsUpdate = config.series.some(series => {
                const expectedType = getDefaultSeriesChartType(config.type);
                return series.chartType !== expectedType && !['composed'].includes(config.type);
            });

            if (needsUpdate && !['composed', 'stackedBar', 'stackedArea'].includes(config.type)) {
                // For single-series charts, update the chart type of existing series
                const updatedSeries = config.series.map(series => ({
                    ...series,
                    chartType: getDefaultSeriesChartType(config.type)
                }));

                setConfig(prevConfig => ({
                    ...prevConfig,
                    series: updatedSeries
                }));
            }
        }
    }, [config.type]);

    const updateChart = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
        setUpdating(true);
        e.preventDefault();
        router.patch(route('projects.charts.update', { project: chart.project_id, chart: chart.id }), {
            data: data,
            config: config
        }, {
            onSuccess: (response) => {
                if (response?.props?.flash?.success) {
                    toast.success((response.props.flash as { success?: string }).success)
                }
            },
            onError: (errors) => {
                if(errors.error){
                    toast.error(errors.error)
                }
                if(errors.package_restriction){
                    toast.error(errors.package_restriction)
                }
            },
            onFinish: () => setUpdating(false)
        })
    };

    return (
        <ChartEditorContext.Provider value={{
            config,
            setConfig,
            data,
            setData,
            columns,
            setColumns,
            updating,
            setUpdating,
            chart,
            updateChart
        }}>
            {children}
        </ChartEditorContext.Provider>
    );
}
