import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Grid3X3, List, Search, Zap } from 'lucide-react';
import * as React from 'react';
import {
    PageHeader,
    PageHeaderAction,
    PageHeaderDescription,
    PageHeaderHead,
    PageHeaderTitle
} from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProjectCard from '@/components/projects/project-card';
import { Assistant } from '@/components/chart-ai/assistant';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Projects',
        href: '/projects',
    },
];

export default function Projects() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <PageHeader>
                    <PageHeaderHead>
                        <PageHeaderTitle>AI Assistant</PageHeaderTitle>
                        <PageHeaderDescription>
                            Create charts from descriptions, analyze data, and get expert guidance.
                        </PageHeaderDescription>
                        <PageHeaderAction>
                            <div className="flex items-center gap-2">
                                <Badge className="text-lg flex items-center gap-1 border-l-gradient-from border-t-gradient-from border-b-gradient-to border-r-gradient-to text-white bg-gradient-to-r from-gradient-from to-gradient-to">
                                    <Zap size="20" />
                                    AI Ready
                                </Badge>
                            </div>
                        </PageHeaderAction>
                    </PageHeaderHead>
                </PageHeader>

                {/* Removed the grid of feature cards here */}

                <Card className="h-fit">
                    <CardContent>
                        <Assistant />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
