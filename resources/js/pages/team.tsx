import StatsCard from '@/components/stats-card';
import { Button } from '@/components/ui/button';
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
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { CrownIcon, MailIcon, ShieldIcon, Users } from 'lucide-react';
import { UserPlus } from "lucide-react";
import { FormEventHandler } from 'react';

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
                <div className="flex justify-end">
                    <Dialog>
                        <form>
                            <DialogTrigger asChild>
                                <Button className="bg-blue-600 text-white hover:bg-blue-700">
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Invite Member
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Invite Team Member</DialogTitle>
                                    <DialogDescription>
                                        Let’s get someone on board — drop their email below!
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4">
                                    <div className="grid gap-3">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input id="email" name="email" placeholder="xyz.com" />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button type="submit">Invite</Button>
                                </DialogFooter>
                            </DialogContent>
                        </form>
                    </Dialog>
                </div>
                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => (
                        <StatsCard displayChange={false} key={index} stat={stat} index={index} />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
