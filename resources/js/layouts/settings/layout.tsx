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
        <div className="w-full overflow-x-hidden">
            <div className="w-full max-w-none px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
                <div className="w-full max-w-none overflow-x-hidden">
                    <Heading title="Settings" description="Manage your profile and account settings" />
                    
                    <div className="flex flex-col lg:flex-row lg:space-y-0 lg:space-x-8 xl:space-x-12 gap-6 lg:gap-0 w-full max-w-none">
                        {/* Navigation */}
                        <aside className="w-full lg:w-48 min-w-0 flex-shrink-0">
                            <nav className="w-full overflow-x-auto lg:overflow-x-visible -mx-3 px-3 lg:mx-0 lg:px-0">
                                <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-4 pb-2 lg:pb-0 min-w-max lg:min-w-0">
                                    {sidebarNavItems.map((section) => (
                                        <div key={section.section} className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-0">
                                            <h3 className="hidden lg:block mb-2 text-sm font-semibold text-muted-foreground whitespace-nowrap">
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
                                                            'justify-start whitespace-nowrap lg:w-full min-h-[44px] lg:min-h-[36px] px-3 lg:px-4 flex-shrink-0',
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
                                </div>
                            </nav>
                        </aside>
                        
                        {/* Content Area - Strict containment */}
                        <div className="flex-1 min-w-0 w-full max-w-none overflow-x-hidden">
                            <div className="w-full max-w-none overflow-x-hidden">
                                <section className="w-full max-w-none space-y-6 sm:space-y-8 lg:space-y-12 overflow-x-hidden">
                                    <div className="w-full max-w-none overflow-x-hidden">
                                        {children}
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
