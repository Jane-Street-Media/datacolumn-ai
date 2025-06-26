import InviteMemberDialog from '@/components/InviteMemberDialog';
import TeamMemberCard from '@/components/Teams/team-member-card';
import { PageHeader, PageHeaderAction, PageHeaderDescription, PageHeaderHead, PageHeaderTitle } from '@/components/page-header';
import StatsCard from '@/components/stats-card';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Deferred, Head, router } from '@inertiajs/react';
import { CrownIcon, MailIcon, Search, ShieldIcon, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import TeamInvitationCard from '@/components/Teams/team-invitation-card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Team',
        href: '/team',
    },
];

export default function Team({ roles, statistics, teamUsers ,teamInvitations}) {
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

    const [filters, setFilters] = useState({
        search: '',
    });

    useEffect(() => {
        const debounce = setTimeout(() => {
            router.reload({
                only: ['teamUsers'],
                data: {
                    search: filters.search,
                },
            });
        }, 300);

        return () => clearTimeout(debounce);
    }, [filters]);

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
                                <InviteMemberDialog roles={roles} />
                            </Deferred>
                        </PageHeaderAction>
                    </PageHeaderHead>
                </PageHeader>

                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => (
                        <StatsCard displayChange={false} key={index} stat={stat} index={index} />
                    ))}
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                            <h1 className="text-xl font-semibold">Team Users</h1>
                        <div className="grid">
                            <div className="col-span-4 flex items-center justify-end gap-4">
                                <div className="relative flex max-w-2xl items-center">
                                    <Search className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 transform" />
                                    <Input
                                        placeholder="Your search..."
                                        className="pl-8"
                                        value={filters.search}
                                        onChange={(e) =>
                                            setFilters((prev) => ({
                                                ...prev,
                                                search: e.target.value.trim(),
                                            }))
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        </div>
                        <Separator className="my-2" />
                    </CardHeader>
                    <CardContent>
                        {teamUsers?.map((user, index) => <TeamMemberCard key={user.id} index={index} user={user} roles={roles} />)}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                            <h1 className="text-xl font-semibold">Team Invitations</h1>
                        </div>
                        <Separator className="my-2" />
                    </CardHeader>
                    <CardContent>
                        {teamInvitations?.map((invitation, index) => <TeamInvitationCard key={invitation.id} index={index} invitation={invitation} />)}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
