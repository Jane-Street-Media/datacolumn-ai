import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronRight, Folders } from 'lucide-react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const visibleItems = items.filter(item => item.isVisible)
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {visibleItems.map((item) => (
                    item.children ? (
                        <Collapsible key={`c-${item.title}`} className="group/collapsible">
                            <SidebarMenuItem key={item.title}>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                        <span className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90">
                                            <ChevronRight className="h-4 w-4" />
                                        </span>
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.children.map((subItem) => (
                                            <SidebarMenuSubItem key={subItem.title}>
                                                <SidebarMenuButton asChild isActive={subItem.url === page.url} className={'!sidebar-link'}>
                                                    <Link href={subItem.url} prefetch>
                                                        {subItem.icon && <subItem.icon />}
                                                        <span>{subItem.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    ) : (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild isActive={item.url === page.url} className={'!sidebar-link'}>
                                <Link href={item.url} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
