import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Sparkles, FolderOpen, LayoutGrid, Users, Folders, Folder } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import AppLogo from './app-logo';

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const page = usePage();
    const auth = useMemo(() => page.props.auth, [page]);
    const isSubscribedToTeamPlan = useMemo(() => auth.subscription?.plan?.display_name === 'Team', [auth]);

    const folderLinks = page.props.auth.folders.map(folder => {
        return {
            title: folder.name,
            url: route('projects.index', { folder: folder.id, search: '' }),
            icon: Folder,
            isVisible: true,
        };
    })
    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            url: '/dashboard',
            icon: LayoutGrid,
            isVisible: true,
        },
        {
            title: 'Folders',
            url: '#',
            icon: Folders,
            isVisible: true,
            children: folderLinks,
        },
        {
            title: 'Projects',
            url: '/projects',
            icon: FolderOpen,
            isVisible: true,
        },
        {
            title: 'Chart AI',
            url: '/chart-ai',
            icon: Sparkles,
            isVisible: true,
        },
        {
            title: 'Team',
            url: '/team',
            icon: Users,
            isVisible: isSubscribedToTeamPlan,
        }
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
