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

export function ChartEditorProvider({ chart, children }: ChartEditorProviderProps) {
    const [config, setConfig] = useState<CustomChartConfig>({
        type: chart.config.type ?? 'bar',
        title: chart.config.title ?? '',
        titleAlignment: chart.config.titleAlignment ?? 'center',
        titleColor: chart.config.titleColor ?? '#111827',
        titleWeight: chart.config.titleWeight ?? 'bold',
        subtitle: chart.config.subtitle ?? '',
        subtitleColor: chart.config.subtitleColor ?? '#6b7280',
        xAxis: chart.config.xAxis ?? '',
        yAxis: chart.config.yAxis ?? '',
        series: chart.config.series ?? [],
        grid: chart.config.grid ?? [],
        tooltip: chart.config.tooltip ?? [],
        xAxisLabel: chart.config.xAxisLabel ?? '',
        yAxisLabel: chart.config.yAxisLabel ?? '',
        tooltipFormat: chart.config.tooltipFormat ?? 'default',
        tooltipCustomFormat: chart.config.tooltipCustomFormat ?? '',
        colors: chart.config.colors ?? ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
        showGrid: chart.config.showGrid ?? true,
        showLegend: chart.config.showLegend ?? true,
        showXAxis: chart.config.showXAxis ?? true,
        showYAxis: chart.config.showYAxis ?? true,
        width: chart.config.width ?? 800,
        height: chart.config.height ?? 600,
        paddingOption: chart.config.paddingOption ?? 'default',
        customPaddingValue: chart.config.customPaddingValue ?? 20,
        theme: chart.config.theme ?? 'light',
        backgroundColor: chart.config.backgroundColor ?? 'default',
    });

    const [data, setData] = useState<DataPoint[]>(chart.data);
    const [columns, setColumns] = useState<string[]>(Object.keys(chart.data[0]));
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (data.length > 0) {
            setColumns(Object.keys(data[0]));
            if (config.type !== 'composed') {
                setConfig({
                    ...config,
                    xAxis: Object.keys(data[0])[0], // Default to the first column as xAxis
                    series: [{
                        dataKey: Object.keys(data[0])[1], // Default series name to the second column
                        chartType: 'line',
                        type: 'monotone',
                        fill: '#1221c8',
                        stroke: '#1221c8',

                    }]
                })
            }
        } else {
            setColumns([]);
        }
    }, [data]);

    useEffect(() => {
        if (config.xAxis && config.series) {
            const filteredSeries = config.series.filter(series => series.dataKey !== config.xAxis);
            if (!filteredSeries.length) {
                // if all series got empty, add a default series from data which is not xAxis
                const defaultSeriesKey = columns.find(col => col !== config.xAxis);
                if (defaultSeriesKey) {
                    filteredSeries.push({
                        dataKey: defaultSeriesKey,
                        chartType: 'line',
                        type: 'monotone',
                        fill: '#1221c8',
                        stroke: '#1221c8',
                    });
                }
            }
            setConfig({
                ...config,
                series: filteredSeries
            });
        }
    }, [config.xAxis]);

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
        <ChartEditorContext.Provider value={{ config, setConfig, data, setData, columns, setColumns, updating, setUpdating, chart, updateChart }}>
            {children}
        </ChartEditorContext.Provider>
    );
}
