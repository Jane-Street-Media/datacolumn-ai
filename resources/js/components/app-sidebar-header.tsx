import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Monitor, Moon, Settings, Sun } from 'lucide-react';
import { useAppearanceContext } from '@/contexts/appearance-context';
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuGroup,
    DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { Link, useForm, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';


export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {

    const { appearance, setAppearance } = useAppearanceContext();
    const getCurrentThemeIcon = () => {
        switch (appearance) {
            case 'light': return Sun;
            case 'dark': return Moon;
            case 'system': return Monitor;
            default: return Sun;
        }
    };

    const CurrentThemeIcon = getCurrentThemeIcon();

    const getInitials = useInitials();

    const { auth } = usePage().props;
    const teams = auth.user.teams;

    const { data, setData, patch} = useForm({
        team_id: auth.user.current_team_id,
    });

    const handleSwitchUserTeam = (value) => {
        setData({ team_id: value });
        patch(route('current-team.update'), {
            only:['teams','flash'],
            onSuccess: (response) => {
                toast.success(response.props.flash.success, {
                    description: 'You\'re now operating with your selected team.',
                });
            },
        });
    };

    return (
        <header className="border-sidebar-border/50 flex h-16 shrink-0 items-center border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex flex-1 items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="flex items-center gap-2">
                <div className="flex items-center space-x-2 md:space-x-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <CurrentThemeIcon className="w-5 h-5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end">
                            <DropdownMenuGroup>
                                <DropdownMenuItem asChild>
                                    <Button variant="ghost" className="w-full justify-start" onClick={() => setAppearance('light')}>
                                        <Sun className="w-5 h-5 mr-2" />
                                        Light
                                    </Button>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Button variant="ghost" className="w-full justify-start" onClick={() => setAppearance('dark')}>
                                        <Moon className="w-5 h-5 mr-2" />
                                        Dark
                                    </Button>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Button variant="ghost" className="w-full justify-start" onClick={() => setAppearance('system')}>
                                        <Monitor className="w-5 h-5 mr-2" />
                                        System
                                    </Button>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Link href={route('profile.edit')} as="button" prefetch>
                        <Settings className="w-5 h-5">
                                Settings
                        </Settings>
                    </Link>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="size-10 rounded-full p-1">
                                <Avatar className="size-8 overflow-hidden rounded-full">
                                    <AvatarFallback
                                        className="rounded-lg bg-secondary text-foreground">
                                        {getInitials('team name')}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end">
                            <DropdownMenuLabel className="p-0 font-normal">
                                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                    Your Teams
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {teams?.map((team) => (
                                <DropdownMenuItem key={team.id} asChild>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start"
                                        onClick={() => handleSwitchUserTeam(team.id)}
                                    >
                                        <span>{team.name}</span>
                                        {auth.user.current_team_id === team.id &&
                                            <Badge className="ml-auto">
                                                active
                                            </Badge>
                                        }
                                    </Button>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
