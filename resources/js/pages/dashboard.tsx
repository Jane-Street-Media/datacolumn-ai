import ActivityFeed from '@/components/dashboard/activity-feed';
import QuickActions from '@/components/dashboard/quick-actions';
import RecentProjects from '@/components/dashboard/recent-projects';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import StatsCard from '@/components/stats-card';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Deferred, Head } from '@inertiajs/react';
import { BarChart3, FileText, Loader2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ projects, statistics, activityLogs, folders, roles, flash, projectStatuses }) {
    const stats = [
        {
            name: 'Total Projects',
            value: statistics.projectStats?.value,
            change: statistics.projectStats?.percentage_change,
            icon: FileText,
        },
        {
            name: 'Active Charts',
            value: statistics.chartStats?.value,
            change: statistics.chartStats?.percentage_change,
            icon: BarChart3,
        },
        {
            name: 'Team Members',
            value: statistics.teamMemberStats?.value,
            change: statistics.teamMemberStats?.percentage_change,
            icon: Users,
        },
        {
            name: 'Need to decide what to put here',
            value: 1,
            change: '+25',
            icon: Users,
        }
    ];
    const [message] = useState(flash?.success || flash?.error || null);
    const [hasShown, setHasShown] = useState(false);

    useEffect(() => {
        if (message && !hasShown) {
            if (flash.success) {
                toast.success(flash.success);
            } else if (flash.error) {
                toast.error(flash.error);
            }
            setHasShown(true);
        }
    }, [message, hasShown, flash]);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => (
                        <StatsCard key={index} stat={stat} index={index} />
                    ))}
                </div>

                <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <div className="col-span-1 lg:col-span-2">
                        <Deferred
                            data="projects"
                            fallback={
                                <Card>
                                    <CardContent>
                                        <LoadingSkeleton />
                                    </CardContent>
                                </Card>
                            }
                        >
                            <RecentProjects projects={projects} folders={folders} projectStatuses={projectStatuses} />
                        </Deferred>
                    </div>
                    <div className="space-y-4">
                        <Deferred
                            data="activityLogs"
                            fallback={
                                <Card>
                                    <CardContent>
                                        <Loader2 className="w-10 h-10 animate-spin text-center"/>
                                    </CardContent>
                                </Card>
                            }
                        >
                            <ActivityFeed activityLogs={activityLogs} />
                        </Deferred>
                        <QuickActions folders={folders} roles={roles} projectStatuses={projectStatuses} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
