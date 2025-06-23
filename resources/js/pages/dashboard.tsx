import ActivityFeed from '@/components/dashboard/activity-feed';
import QuickActions from '@/components/dashboard/quick-actions';
import RecentProjects from '@/components/dashboard/recent-projects';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import StatsCard from '@/components/stats-card';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Deferred, Head } from '@inertiajs/react';
import { BarChart3, FileText, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ projects, statistics, activityLogs, folders }) {
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
        // {
        //     name: 'This Month',
        //     value: 1,
        //     change: '+25%',
        //     icon: TrendingUp,
        // },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => (
                        <StatsCard key={index} stat={stat} index={index} />
                    ))}
                </div>

                <div className="mb-8 grid grid-cols-3 gap-4 md:grid-cols-3 lg:grid-cols-3">
                    <div className="col-span-2">
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
                            <RecentProjects projects={projects} folders={folders} />
                        </Deferred>
                    </div>
                    <div className="space-y-4">
                        <ActivityFeed activityLogs={activityLogs} />
                        <QuickActions folders={folders}/>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
