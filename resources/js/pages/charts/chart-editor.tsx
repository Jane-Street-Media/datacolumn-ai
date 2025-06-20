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
import { Card, CardContent } from '@/components/ui/card';

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
                            <TabsContent value="design">Make changes to your account here.</TabsContent>
                            <TabsContent value="data">Change your password here.</TabsContent>
                            <TabsContent value="preview">Change your password here.</TabsContent>
                        </CardContent>
                    </Card>
                </Tabs>
            </div>
        </AppLayout>
    );
}
