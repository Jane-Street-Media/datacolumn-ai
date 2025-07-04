import { ChartEditorProvider, useChartEditor } from '@/contexts/chart-editor-context';
import { CustomChartConfig } from './types';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { ChartHeaderActions } from '@/components/chart-editor/chart-header-actions';
import { Tabs } from '@radix-ui/react-tabs';
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { ChartRenderer } from '@/components/chart-editor/chart-renderer';
import { ChartControls } from '@/components/chart-editor/chart-controls';
import { DataTable } from '@/components/chart-editor/data-table';

interface ChartEditorProps {
    chart: {
        config: CustomChartConfig;
        data: any[];
        project_id: number | string;
        uuid: string;
        id: number | string;
    };
}

export default function ChartEditor({ chart }: ChartEditorProps) {
    return (
        <ChartEditorProvider chart={chart}>
            <ChartEditorContent />
        </ChartEditorProvider>
    );
}

function ChartEditorContent() {
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <ChartHeaderActions />
                <Tabs defaultValue="design" className="w-full">
                    <TabsList>
                        <TabsTrigger value="design">Design</TabsTrigger>
                        <TabsTrigger value="data">Data</TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                    <Card className="mt-2">
                        <CardContent>
                            <TabsContent value="design">
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex h-full flex-col p-4 sm:p-6 lg:grid xl:grid-cols-3 lg:gap-6">
                                        <div className="order-2 mb-6 lg:order-1 lg:col-span-2 lg:mb-0">
                                            <ChartRenderer />
                                        </div>
                                        <div className="order-1 flex-1 lg:order-2 lg:flex-none">
                                            <div className="h-full">
                                                <ChartControls />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="data">
                                <DataTable />
                            </TabsContent>
                            <TabsContent value="preview">
                                <ChartRenderer />
                            </TabsContent>
                        </CardContent>
                    </Card>
                </Tabs>
            </div>
        </AppLayout>
    );
}
