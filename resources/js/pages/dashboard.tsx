import AppLayout from '@/layouts/app-layout';
import {type BreadcrumbItem} from '@/types';
import { Deferred, Head } from '@inertiajs/react';
import { FileText, BarChart3, Users, TrendingUp } from 'lucide-react';
import StatsCard from '@/components/stats-card';
import RecentProjects from '@/components/recent-projects';
import ActivityFeed from '@/components/activity-feed';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ projects, statistics}) {
    const stats = [
        {
            name: 'Total Projects',
            value: statistics.projectStats.value,
            change: statistics.projectStats.percentage_change,
            icon: FileText,
        },
        {
            name: 'Active Charts',
            value: statistics.chartStats.value,
            change: statistics.chartStats.percentage_change,
            icon: BarChart3,
        },
        {
            name: 'Team Members',
            value: statistics.teamMemberStats.value,
            change: statistics.teamMemberStats.percentage_change,
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
                        <Deferred data="projects" fallback={<div>Loading...</div>}>
                            <RecentProjects projects={projects} />
                        </Deferred>
                    </div>
                    <ActivityFeed />
                </div>
            </div>
        </AppLayout>
    );
}
