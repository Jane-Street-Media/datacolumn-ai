import AppLayout from '@/layouts/app-layout';
import {type BreadcrumbItem} from '@/types';
import { Head } from '@inertiajs/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import {
    ChartConfig,
} from "@/components/ui/chart"
import { useRef, useState } from 'react';
import { ChartControls } from '@/components/chart-editor/chartControls';
import { CustomChartConfig } from '@/pages/charts/types';
import { ChartHeaderActions } from '@/components/chart-editor/chart-header-actions';
import { ChartRenderer } from '@/components/chart-editor/chart-renderer';
import { DataTable } from '@/components/chart-editor/data-table';

export const description = "An area chart with axes"
const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
]
const chartConfig = {
    desktop: {
        label: "Desktop",
        color: 'green',
    },
    mobile: {
        label: "Mobile",
        color: 'yellow',
    },
} satisfies ChartConfig

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

export default function ChartEditor() {
    const xAxisConfig = useRef({
        allowDuplicatedCategory: true,
        allowDecimals: false,
        hide: false,
        orientation: 'top',
        width: 50,
        height: 50,
        mirror: false,
        padding: { left: 0, right: 0 },
        allowDataOverflow: false,
        reversed: false,
        dataKey: "month",
        label: 'Ullo ka patthasaxs',
        tickLine: true,
        axisLine: true,
        tickMargin: 8,
    });
    const yAxisConfig = useRef({
        allowDuplicatedCategory: true,
        allowDecimals: true,
        hide: false,
        orientation: 'right',
        width: 50,
        height: 1,
        mirror: false,
        type: "number",
        padding: { top: 20, bottom: 20 },
        allowDataOverflow: true,
        reversed: false,
        label: 'tu ho ga',
        tickLine: true,
        axisLine: true,
        tickMargin: 8,
        tickCount: 8,
    });

    const [config, setConfig] = useState<CustomChartConfig>({
        type: 'bar',
        title: '',
        titleAlignment: 'center',
        titleColor: '#111827',
        titleWeight: 'bold',
        subtitle: '',
        subtitleColor: '#6b7280',
        xAxis: 'month',
        yAxis: 'sales',
        xAxisLabel: '',
        yAxisLabel: '',
        tooltipFormat: 'default',
        tooltipCustomFormat: '',
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
        showGrid: true,
        showLegend: true,
        showXAxis: true,
        showYAxis: true,
        width: 800,
        height: 600,
        paddingOption: 'default',
        customPaddingValue: 20,
        theme: 'light',
        backgroundColor: 'default'
    });

    const handleConfigChange = (newConfig: CustomChartConfig) => {
        setConfig(newConfig);

        console.log('config');
        console.log(config);
    };

    interface DataPoint {
        [key: string]: string | number;
    }

    const [data, setData] = useState<DataPoint[]>([
        { month: 'Jan', sales: 4000, profit: 2400 },
        { month: 'Feb', sales: 3000, profit: 1398 },
        { month: 'Mar', sales: 2000, profit: 9800 },
        { month: 'Apr', sales: 2780, profit: 3908 },
        { month: 'May', sales: 1890, profit: 4800 },
        { month: 'Jun', sales: 2390, profit: 3800 },
    ]);
    // setData(sampleData);
    const [columns, setColumns] = useState<string[]>([
        'month',
        'sales',
        'profit'
    ]);

    const onImportSuccess = (result) => {
        setData(result.data);
        setColumns(result.columns);
        setConfig(prev => ({
            ...prev,
            xAxis: result.columns[0] || '',
            yAxis: result.columns[1] || '',
        }));
    }

    const handleDataChange = (newData: DataPoint[]) => {
        setData(newData);
    };

    const handleAddRow = () => {
        const newRow: DataPoint = {};
        columns.forEach(col => {
            newRow[col] = '';
        });
        setData([...data, newRow]);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <ChartHeaderActions config={config} onImportSuccess={(result) => onImportSuccess(result)} />

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
                                    <div className="flex h-full flex-col p-4 sm:p-6 lg:grid lg:grid-cols-3 lg:gap-6">
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
                                <DataTable
                                    data={data}
                                    columns={columns}
                                    onDataChange={handleDataChange}
                                    onAddRow={handleAddRow}
                                />
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
