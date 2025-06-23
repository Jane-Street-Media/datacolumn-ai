import InviteMemberDialog from '@/components/InviteMemberDialog';
import { PageHeader, PageHeaderAction, PageHeaderDescription, PageHeaderHead, PageHeaderTitle } from '@/components/page-header';
import StatsCard from '@/components/stats-card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Deferred, Head } from '@inertiajs/react';
import { CrownIcon, MailIcon, ShieldIcon, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Team',
        href: '/team',
    },
];

export default function Team({ roles, statistics }) {
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Teams" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <PageHeader>
                    <PageHeaderHead>
                        <PageHeaderTitle>Team Management</PageHeaderTitle>
                        <PageHeaderDescription>Manage team members, roles, and permissions across your organization.</PageHeaderDescription>
                        <PageHeaderAction>
                            <Deferred data="roles">
                                <InviteMemberDialog roles={roles} />{' '}
                            </Deferred>
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
