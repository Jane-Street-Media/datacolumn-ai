import {PlaceholderPattern} from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import {type BreadcrumbItem} from '@/types';
import { Deferred, Head } from '@inertiajs/react';
import { FileText, BarChart3, Users, TrendingUp } from 'lucide-react';
import StatsCard from '@/components/stats-card';
import RecentProjects from '@/components/dashboard/recent-projects';
import ActivityFeed from '@/components/dashboard/activity-feed';
import QuickActions from '@/components/dashboard/quick-actions';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const teams = [
    {
        id: '1',
        name: 'Editorial Team',
        description: 'Main editorial and content creation team',
        createdAt: new Date('2024-01-01'),
        createdBy: '1',
        members: [
            {
                id: '1',
                name: 'Sarah Johnson',
                email: 'sarah@datacolumn.ai',
                avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
                role: 'admin',
                department: 'Editorial',
                joinedAt: new Date('2024-01-01'),
                lastActive: new Date(),
                status: 'active'
            },
            {
                id: '2',
                name: 'Michael Chen',
                email: 'michael@datacolumn.ai',
                avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
                role: 'editor',
                department: 'Data Analysis',
                joinedAt: new Date('2024-01-05'),
                lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
                status: 'active'
            },
            {
                id: '3',
                name: 'Emily Rodriguez',
                email: 'emily@datacolumn.ai',
                avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
                role: 'editor',
                department: 'Design',
                joinedAt: new Date('2024-01-10'),
                lastActive: new Date(Date.now() - 30 * 60 * 1000),
                status: 'active'
            }
        ]
    }
];

// const projects = [
//     {
//         id: '1',
//         name: 'Q3 Sales Analysis',
//         description: 'Quarterly sales performance across regions',
//         createdAt: new Date('2024-01-15'),
//         updatedAt: new Date('2024-01-20'),
//         createdBy: '1',
//         collaborators: ['1', '2'],
//         charts: [],
//         datasets: [],
//         tags: ['sales', 'quarterly', 'analysis'],
//         status: 'published'
//     },
//     {
//         id: '2',
//         name: 'Market Research Dashboard',
//         description: 'Consumer behavior insights and trends',
//         createdAt: new Date('2024-01-10'),
//         updatedAt: new Date('2024-01-18'),
//         createdBy: '1',
//         collaborators: ['1'],
//         charts: [],
//         datasets: [],
//         tags: ['market', 'research', 'trends'],
//         status: 'draft'
//     }
// ];

const stats = [
    {
        name: 'Total Projects',
        value: 4,
        change: '+12%',
        changeType: 'positive' as const,
        icon: FileText,
    },
    {
        name: 'Active Charts',
        value: 4,
        change: '+8%',
        changeType: 'positive' as const,
        icon: BarChart3,
    },
    {
        name: 'Team Members',
        value: teams.reduce((acc, t) => acc + t.members.length, 0),
        change: '+2',
        changeType: 'positive' as const,
        icon: Users,
    },
    {
        name: 'This Month',
        value: 1,
        change: '+25%',
        changeType: 'positive' as const,
        icon: TrendingUp,
    },
];

export default function Dashboard({ projects }) {
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
                    <div className="space-y-4">
                        <ActivityFeed />
                        <QuickActions />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
