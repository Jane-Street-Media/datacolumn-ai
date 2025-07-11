import { ChartHeaderActions } from '@/components/chart-editor/chart-header-actions';
import { ChartRenderer } from '@/components/chart-editor/chart-renderer';
import { ChartControls } from '@/components/chart-editor/chart-controls';
import { DataTable } from '@/components/chart-editor/data-table';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { CustomChartConfig } from '@/pages/charts/types';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Projects',
        href: '/projects',
    },
    {
        title: 'Projects',
        href: '/projects',
    },
    {
        title: 'Charts',
        href: '/projects',
    },
    {
        title: 'Chart Editor',
        href: '/projects',
    },
];

export default function ChartEditorX({ chart }) {

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

    const handleConfigChange = (newConfig: CustomChartConfig) => {
        setConfig(newConfig);
    };

    interface DataPoint {
        [key: string]: string | number;
    }

    const [data, setData] = useState<DataPoint[]>(chart.data);
    // setData(sampleData);
    const [columns, setColumns] = useState<string[]>(Object.keys(chart.data[0]));

    const onImportSuccess = (result) => {
        setData(result.data);
        setColumns(result.columns);
        setConfig((prev) => ({
            ...prev,
            xAxis: result.columns[0] || '',
            yAxis: result.columns[1] || '',
        }));
    };

    const handleDataChange = (newData: DataPoint[]) => {
        setData(newData);
    };

    const handleAddRow = () => {
        const newRow: DataPoint = {};
        columns.forEach((col) => {
            newRow[col] = '';
        });
        setData([...data, newRow]);
    };

    const [updating, setUpdating] = useState(false)
    const updateChart = (e) => {
        setUpdating(true)
        e.preventDefault();
        router.patch(route('projects.charts.update', { project: chart.project_id, chart: chart.id }), {
            data: data,
            config: config
        }, {
            onSuccess: (response) => {
                toast.success(response.props.flash.success)
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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <ChartHeaderActions chart={chart} config={config} data={data} columns={columns} handleConfigChange={handleConfigChange} onImportSuccess={(result) => onImportSuccess(result)} onSave={(e) => updateChart(e)} loading={updating}/>

                <Tabs defaultValue="design" className="w-full">
                    <TabsList>
                        <TabsTrigger value="design">Design</TabsTrigger>
                        <TabsTrigger value="data">Data</TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                    <Card>
                        <CardContent>
                            <TabsContent value="design">
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex h-full flex-col p-4 sm:p-6 lg:grid xl:grid-cols-3 lg:gap-6">
                                        <div className="order-2 mb-6 lg:order-1 lg:col-span-2 lg:mb-0">
                                            <ChartRenderer data={data} config={config} />
                                        </div>
                                        <div className="order-1 flex-1 lg:order-2 lg:flex-none">
                                            <div className="h-full">
                                                <ChartControls config={config} columns={columns} onConfigChange={handleConfigChange} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="data">
                                <DataTable data={data} columns={columns} onDataChange={handleDataChange} onAddRow={handleAddRow} />
                            </TabsContent>
                            <TabsContent value="preview">
                                <ChartRenderer data={data} config={config} />
                            </TabsContent>
                        </CardContent>
                    </Card>
                </Tabs>
            </div>
        </AppLayout>
    );
}
