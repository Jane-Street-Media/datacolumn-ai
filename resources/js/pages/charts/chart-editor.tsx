import { ChartEditorProvider, useChartEditor } from '@/contexts/chart-editor-context';
import { CustomChartConfig } from './types';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { ChartHeaderActions } from '@/components/chart-editor/chart-header-actions';
import { Tabs } from '@radix-ui/react-tabs';
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { ChartRenderer } from '@/components/chart-editor/chart-renderer';
import { ChartControls } from '@/components/chart-editor/chart-controls';
import { DataTable } from '@/components/chart-editor/data-table';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Settings2, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface ChartEditorProps {
    chart: {
        config: CustomChartConfig;
        data: any[];
        project_id: number | string;
        uuid: string;
        id: number | string;
    };
}

export default function ChartEditor({ chart }: ChartEditorProps) {
    return (
        <ChartEditorProvider chart={chart}>
            <ChartEditorContent />
        </ChartEditorProvider>
    );
}

function ChartEditorContent() {
    const [activeTab, setActiveTab] = useState('design');
    const [isMobile, setIsMobile] = useState(false);
    const [controlsOpen, setControlsOpen] = useState(false);
    
    // Detect mobile screen size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Projects',
            href: '/projects',
        },
        {
            title: 'Charts',
            href: `/projects/${chart?.project_id}/charts`,
        },
        {
            title: 'Chart Editor',
            href: '#',
        },
    ];

    // Mobile-specific layout for design tab
    const MobileDesignLayout = () => (
        <div className="flex flex-col h-full">
            {/* Chart Preview - Takes most of the screen */}
            <div className="flex-1 min-h-0 mb-4">
                <Card className="h-full">
                    <CardContent className="p-2 h-full">
                        <ChartRenderer />
                    </CardContent>
                </Card>
            </div>
            
            {/* Controls Button - Fixed at bottom */}
            <Sheet open={controlsOpen} onOpenChange={setControlsOpen}>
                <SheetTrigger asChild>
                    <Button 
                        variant="outline" 
                        className="w-full"
                        size="lg"
                    >
                        <Settings2 className="mr-2 h-4 w-4" />
                        Chart Settings
                    </Button>
                </SheetTrigger>
                <SheetContent 
                    side="bottom" 
                    className="h-[80vh] rounded-t-xl"
                >
                    <SheetHeader className="pb-4">
                        <SheetTitle>Chart Configuration</SheetTitle>
                    </SheetHeader>
                    <div className="overflow-y-auto h-[calc(100%-60px)]">
                        <ChartControls cardContentClasses="p-0" />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );

    // Desktop layout for design tab
    const DesktopDesignLayout = () => (
        <div className="flex h-full flex-col gap-4 lg:grid xl:grid-cols-3 lg:gap-6">
            <div className="order-2 lg:order-1 lg:col-span-2">
                <ChartRenderer />
            </div>
            <div className="order-1 flex-1 lg:order-2 lg:flex-none">
                <div className="h-full">
                    <ChartControls cardContentClasses="max-h-[calc(100vh-400px)] lg:max-h-[calc(100vh-300px)]" />
                </div>
            </div>
        </div>
    );

    return (
        <AppLayout 
            breadcrumbs={breadcrumbs}
            className={cn(
                "flex flex-col h-full",
                isMobile && "pb-0" // Remove padding on mobile for full height
            )}
        >
            <Head title="Chart Editor" />
            <div className={cn(
                "flex h-full flex-1 flex-col gap-4",
                isMobile ? "p-2" : "rounded-xl p-4"
            )}>
                <ChartHeaderActions />
                
                <Tabs 
                    value={activeTab} 
                    onValueChange={setActiveTab}
                    className="w-full flex-1 flex flex-col"
                >
                    {/* Mobile-optimized tabs */}
                    <TabsList className={cn(
                        "grid w-full",
                        isMobile ? "grid-cols-3 h-12" : "grid-cols-3 w-[400px]"
                    )}>
                        <TabsTrigger 
                            value="design"
                            className={cn(
                                isMobile && "text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                            )}
                        >
                            Design
                        </TabsTrigger>
                        <TabsTrigger 
                            value="data"
                            className={cn(
                                isMobile && "text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                            )}
                        >
                            Data
                        </TabsTrigger>
                        <TabsTrigger 
                            value="preview"
                            className={cn(
                                isMobile && "text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                            )}
                        >
                            Preview
                        </TabsTrigger>
                    </TabsList>
                    
                    {/* Design Tab */}
                    <TabsContent 
                        value="design" 
                        className={cn(
                            "mt-2 flex-1",
                            isMobile && "h-0" // Force height calculation on mobile
                        )}
                    >
                        <Card className={cn(
                            "h-full",
                            isMobile && "border-0 shadow-none"
                        )}>
                            <CardContent className={cn(
                                isMobile ? "p-0 h-full" : "p-2 sm:p-4 lg:p-6 h-full"
                            )}>
                                <div className="flex-1 overflow-hidden h-full">
                                    {isMobile ? <MobileDesignLayout /> : <DesktopDesignLayout />}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    
                    {/* Data Tab */}
                    <TabsContent 
                        value="data" 
                        className={cn(
                            "mt-2 flex-1",
                            isMobile && "h-0"
                        )}
                    >
                        <Card className={cn(
                            isMobile && "border-0 shadow-none h-full"
                        )}>
                            <CardContent className={cn(
                                isMobile ? "p-2 h-full overflow-auto" : "p-2 sm:p-4 lg:p-6"
                            )}>
                                <DataTable />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    
                    {/* Preview Tab */}
                    <TabsContent 
                        value="preview" 
                        className={cn(
                            "mt-2 flex-1",
                            isMobile && "h-0"
                        )}
                    >
                        <Card className={cn(
                            isMobile && "border-0 shadow-none h-full"
                        )}>
                            <CardContent className={cn(
                                isMobile ? "p-2 h-full" : "p-2 sm:p-4 lg:p-6"
                            )}>
                                <div className={cn(
                                    "h-full flex flex-col",
                                    isMobile && "gap-2"
                                )}>
                                    <div className="flex-1 min-h-0">
                                        <ChartRenderer />
                                    </div>
                                    {isMobile && (
                                        <div className="flex gap-2 pt-2">
                                            <Button variant="outline" size="sm" className="flex-1">
                                                Export
                                            </Button>
                                            <Button variant="outline" size="sm" className="flex-1">
                                                Share
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
