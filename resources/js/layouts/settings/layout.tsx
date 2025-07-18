import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

const sidebarNavItems: any = [
    {
        section: 'Settings',
        items: [
            {
                title: 'Profile',
                url: '/settings/profile',
                icon: null,
            },
            {
                title: 'Password',
                url: '/settings/password',
                icon: null,
            },
            {
                title: 'Appearance',
                url: '/settings/appearance',
                icon: null,
            }
        ]
    },
    {
        section: 'Billing',
        items: [
            {
                title: 'Subscription',
                url: '/settings/subscription',
                icon: null,
            },
            {
                title: 'Invoices',
                url: '/settings/invoices',
                icon: null,
            }
        ]
    }
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const currentPath = window.location.pathname;
    
    return (
        <div className="px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
            <Heading title="Settings" description="Manage your profile and account settings" />
            
            <div className="flex flex-col lg:flex-row lg:space-y-0 lg:space-x-8 xl:space-x-12 gap-6 lg:gap-0">
                {/* Mobile: Horizontal scrolling nav, Desktop: Vertical sidebar */}
                <aside className="w-full lg:w-48">
                    <nav className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-4 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
                        {sidebarNavItems.map((section) => (
                            <div key={section.section} className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-0 min-w-max lg:min-w-0">
                                <h3 className="hidden lg:block mb-2 text-sm font-semibold text-muted-foreground">
                                    {section.section}
                                </h3>
                                <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-1">
                                    {section.items.map((item) => (
                                        <Button
                                            key={item.url}
                                            size="sm"
                                            variant="ghost"
                                            asChild
                                            className={cn(
                                                'justify-start whitespace-nowrap lg:w-full min-h-[44px] lg:min-h-[36px] px-4',
                                                {
                                                    'bg-muted': currentPath === item.url,
                                                }
                                            )}
                                        >
                                            <Link href={item.url} prefetch>
                                                {item.title}
                                            </Link>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </nav>
                </aside>
                
                <div className="flex-1 lg:min-w-0">
                    <section className="w-full space-y-6 sm:space-y-8 lg:space-y-12">
                        {children}
                    </section>
                </div>
            </div>
        </div>
    );
}
