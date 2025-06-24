import AppLayout from '@/layouts/app-layout';
import {type BreadcrumbItem} from '@/types';
import { Head } from '@inertiajs/react';
import { Upload, Save, Share2, Import } from 'lucide-react';
import * as React from 'react';
import {
    PageHeader,
    PageHeaderAction,
    PageHeaderDescription,
    PageHeaderHead,
    PageHeaderTitle
} from '@/components/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button';
import ProjectCard from '@/components/projects/project-card';
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { useRef, useState } from 'react';
import { ChartControls } from '@/pages/charts/chartControls';
import { CustomChartConfig } from '@/pages/charts/types';

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
        xAxis: '',
        yAxis: '',
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
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card>
                    <CardContent>
                        <PageHeader className="py-0">
                            <PageHeaderHead>
                                <PageHeaderTitle>Q1 Sales Analysis</PageHeaderTitle>
                                <PageHeaderDescription>Create and customize your data visualizations.</PageHeaderDescription>
                                <PageHeaderAction>
                                    <div className="flex items-center gap-2">
                                        <Button>
                                            <Import />
                                            <span>Import</span>
                                        </Button>
                                        <Button variant={'ghost'} className="border">
                                            <Upload />
                                            <span>Export</span>
                                        </Button>
                                        <Button variant={'ghost'} className="border">
                                            <Save />
                                            <span>Save</span>
                                        </Button>
                                        <Button variant={'ghost'} className="border">
                                            <Share2 />
                                            <span>Share</span>
                                        </Button>
                                    </div>
                                </PageHeaderAction>
                            </PageHeaderHead>
                        </PageHeader>
                    </CardContent>
                </Card>

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
                                    <div className="h-full flex flex-col lg:grid lg:grid-cols-3 lg:gap-6 p-4 sm:p-6">
                                        <div className="lg:col-span-2 order-2 lg:order-1 mb-6 lg:mb-0">
                                            <ChartContainer config={chartConfig} className={'bg-white'}>
                                                <CardHeader>
                                                    <CardTitle>Area Chart</CardTitle>
                                                    <CardDescription>Showing total visitors for the last 6 months</CardDescription>
                                                </CardHeader>
                                                <AreaChart
                                                    accessibilityLayer
                                                    data={chartData}
                                                    margin={{
                                                        left: -20,
                                                        right: 12,
                                                    }}
                                                >
                                                    <CartesianGrid vertical={false} horizontal={true} />
                                                    <XAxis {...xAxisConfig.current} tickFormatter={(value) => String(value).slice(0, 3)} />
                                                    <YAxis {...yAxisConfig.current} />
                                                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                                    <Area
                                                        dataKey="mobile"
                                                        type="natural"
                                                        fill="var(--color-mobile)"
                                                        fillOpacity={0.4}
                                                        stroke="var(--color-mobile)"
                                                        stackId="a"
                                                    />
                                                    <Area
                                                        dataKey="desktop"
                                                        type="natural"
                                                        fill="var(--color-desktop)"
                                                        fillOpacity={0.4}
                                                        stroke="var(--color-desktop)"
                                                        stackId="a"
                                                    />
                                                </AreaChart>
                                            </ChartContainer>
                                        </div>
                                        <div className="order-1 lg:order-2 flex-1 lg:flex-none">
                                            <div className="h-full max-h-[calc(100vh-300px)] lg:max-h-[calc(100vh-200px)] overflow-y-auto overscroll-contain">
                                                <ChartControls
                                                    config={config}
                                                    onConfigChange={handleConfigChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>



                            </TabsContent>
                            <TabsContent value="data">Change your password here.</TabsContent>
                            <TabsContent value="preview">Change your password here.</TabsContent>
                        </CardContent>
                    </Card>
                </Tabs>
            </div>
        </AppLayout>
    );
}
