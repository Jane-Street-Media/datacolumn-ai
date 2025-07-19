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
            <div className="flex h-full flex-1 flex-col gap-2 sm:gap-4 rounded-xl p-2 sm:p-4">
                <PageHeader>
                    <PageHeaderHead>
                        <PageHeaderTitle className="text-lg sm:text-xl md:text-2xl lg:text-3xl">
                            AI Assistant
                        </PageHeaderTitle>
                        <PageHeaderDescription className="text-sm sm:text-base text-muted-foreground">
                            Create charts from descriptions, analyze data, and get expert guidance.
                        </PageHeaderDescription>
                        <PageHeaderAction>
                            <div className="flex items-center gap-2">
                                <Badge className="text-xs sm:text-sm lg:text-base flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1.5 border-l-gradient-from border-t-gradient-from border-b-gradient-to border-r-gradient-to text-white bg-gradient-to-r from-gradient-from to-gradient-to">
                                    <Zap size="16" className="sm:w-5 sm:h-5" />
                                    <span className="hidden xs:inline">AI Ready</span>
                                    <span className="xs:hidden">AI</span>
                                </Badge>
                            </div>
                        </PageHeaderAction>
                    </PageHeaderHead>
                </PageHeader>
                
                {/* Main Assistant Card */}
                <Card className="flex-1 min-h-0">
                    <CardContent className="p-2 sm:p-4 md:p-6 h-full">
                        <div className="h-full">
                            <Assistant />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
