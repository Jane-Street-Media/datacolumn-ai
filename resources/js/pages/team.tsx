import InviteMemberDialog from '@/components/InviteMemberDialog';
import { PageHeader, PageHeaderAction, PageHeaderDescription, PageHeaderHead, PageHeaderTitle } from '@/components/page-header';
import StatsCard from '@/components/stats-card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Deferred, Head } from '@inertiajs/react';
import { CrownIcon, MailIcon, Search, ShieldIcon, Trash2, Users, X } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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
                        <div className="grid">
                            <div className="col-span-4 flex items-center gap-4 justify-end">
                                <div className="relative flex max-w-2xl items-center">
                                    <Search className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 transform" />
                                    <Input
                                        placeholder="Your search..."
                                        className="pl-8"
                                    />
                                </div>
                            </div>
                        </div>
                        <Separator className="my-2" />
                    </CardHeader>
                    <CardContent>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="flex items-center justify-between p-4 rounded-xl border"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${
                                        'active' === 'active' ? 'bg-green-500' :
                                            'pending' === 'pending' ? 'bg-yellow-500' : 'bg-gray-400'
                                    }`} />
                                </div>

                                <div>
                                    <h3 className="font-medium text-foreground">{'Aamish'}</h3>
                                    <p className="text-sm text-secondary-foreground">{'aamishirfan2662@gmail.com'}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="text-right">
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Change role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value={'editor'}>
                                                    editor
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <Badge>
                                        {'active'}
                                    </Badge>
                                </div>

                                <div className="text-right text-sm text-muted-foreground">
                                    <p>Joined {format(new Date('2024-12-12'), 'MMM d, yyyy')}</p>
                                    <p className="text-xs">
                                        Last active {format(new Date('2024-12-12'), 'MMM d, h:mm a')}
                                    </p>
                                </div>

                                <Button variant="ghost">
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                            </div>
                        </motion.div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
