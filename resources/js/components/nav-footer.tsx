import { Icon } from '@/components/icon';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { type ComponentPropsWithoutRef } from 'react';
import { toast } from 'sonner';

export function NavFooter({
    items,
    className,
    ...props
}: ComponentPropsWithoutRef<typeof SidebarGroup> & {
    items: NavItem[];
}) {
    const { auth } = usePage().props;
    const teams = auth.user.teams;
    const { data, setData, patch, processing, errors, reset } = useForm({
        team_id: auth.user.current_team_id,
    });

        console.log(auth , 'this is auth')
    const handleTeamChange = (value) => {
        setData(data.team_id = value)
        patch(route('current-team.update'), {
            onSuccess: (response) => {
                toast(response.props.flash.success, {
                    description: 'Team is switched',
                });
            },
        });
    };
    return (
        <>
            <Label htmlFor="folder">Switch Team</Label>
            <Select value={String(data.team_id)} onValueChange={handleTeamChange}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a Team" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {teams?.map((team) => (
                            <SelectItem key={team.id} value={String(team.id)}>
                                {team.name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
            <SidebarGroup {...props} className={`group-data-[collapsible=icon]:p-0 ${className || ''}`}>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {items.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    className="text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-100"
                                >
                                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                                        {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                        <span>{item.title}</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </>
    );
}
