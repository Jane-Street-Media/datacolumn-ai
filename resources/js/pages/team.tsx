import StatsCard from '@/components/stats-card';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { CrownIcon, MailIcon, ShieldIcon, Users } from 'lucide-react';
import {type BreadcrumbItem} from '@/types';
import { Deferred, Head } from '@inertiajs/react';
import { FileText, BarChart3, UserPlus } from 'lucide-react';
import * as React from 'react';
import {
    PageHeader,
    PageHeaderAction,
    PageHeaderDescription,
    PageHeaderHead,
    PageHeaderTitle
} from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import RecentProjects from '@/components/dashboard/recent-projects';
import ActivityFeed from '@/components/dashboard/activity-feed';
import QuickActions from '@/components/dashboard/quick-actions';
import InviteMemberDialog from '@/components/InviteMemberDialog';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Team',
        href: '/team',
    },
];

export default function Team({ statistics }) {
    const stats = [
        {
            name: 'Total Members',
            value: statistics.totalMembersStats?.value,
            change: statistics.totalMembersStats?.percentage_change,
            icon: Users,
        },
        {
            name: 'Active Members',
            value: statistics.activeMembersStats?.value,
            change: statistics.activeMembersStats?.percentage_change,
            icon: ShieldIcon,
        },
        {
            name: 'Admins',
            value: statistics.adminStats?.value,
            change: statistics.adminStats?.percentage_change,
            icon: CrownIcon,
        },
        {
            name: 'Pending',
            value: statistics.pendingMemberStats?.value,
            change: statistics.pendingMemberStats?.percentage_change,
            icon: MailIcon,
        },
        // {
        //     name: 'This Month',
        //     value: 1,
        //     change: '+25%',
        //     icon: TrendingUp,
        // },
    ];

    // const submit: FormEventHandler = (e) => {
    //     e.preventDefault();
    //     post(route('register'), {
    //         onFinish: () => reset('password', 'password_confirmation'),
    //     });
    // };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Teams" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">

                <PageHeader>
                    <PageHeaderHead>
                        <PageHeaderTitle>Team Management</PageHeaderTitle>
                        <PageHeaderDescription>Manage team members, roles, and permissions across your organization.</PageHeaderDescription>
                        <PageHeaderAction>
                           <InviteMemberDialog/>
                        </PageHeaderAction>
                    </PageHeaderHead>
                </PageHeader>

                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => (
                        <StatsCard displayChange={false} key={index} stat={stat} index={index} />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
