import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Monitor, Moon, Settings, Sun } from 'lucide-react';
import { useAppearanceContext } from '@/contexts/appearance-context';


export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {

    const { appearance } = useAppearanceContext();
    const getCurrentThemeIcon = () => {
        switch (appearance) {
            case 'light': return Sun;
            case 'dark': return Moon;
            case 'system': return Monitor;
            default: return Sun;
        }
    };

    const CurrentThemeIcon = getCurrentThemeIcon();

    return (
        <header className="border-sidebar-border/50 flex h-16 shrink-0 items-center border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex flex-1 items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="flex items-center gap-2">
                <div className="flex items-center space-x-2 md:space-x-4">
                    <CurrentThemeIcon className="w-5 h-5" />
                    <Settings className="w-5 h-5" />
                </div>
            </div>
        </header>
    );
}
