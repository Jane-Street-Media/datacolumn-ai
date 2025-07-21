import { LoadingSkeleton } from '@/components/loading-skeleton';
import { PageHeader, PageHeaderAction, PageHeaderDescription, PageHeaderHead, PageHeaderTitle } from '@/components/page-header';
import FolderDialog from '@/components/projects/folder-dialog';
import ChartCard from '@/components/projects/charts/chart-card';
import ProjectDialog from '@/components/projects/project-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Deferred, Head, router, useForm } from '@inertiajs/react';
import { BarChart, BarChart3, FolderOpen, LineChart, Loader2, Search, UserPlus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import ProjectCard from '@/components/projects/project-card';
import { toast } from 'sonner';
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { CreateChart } from '@/components/create-chart';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Charts',
        href: '#',
    },
];

export default function ChartIndex({ charts, project }) {
    const [filters, setFilters] = useState({
        search: '',
    });

    useEffect(() => {
        const debounce = setTimeout(() => {
            router.reload({
                only: ['charts'],
                data: {
                    search: filters.search,
                },
            });
        }, 300);

        return () => clearTimeout(debounce);
    }, [filters]);

    const {data, setData, post, processing} = useForm({})
    const createChart = (e) => {
        e.preventDefault()
        post(route('projects.charts.store', project.id), {
            showProgress: false,
            onError: (errors) => {
                if(errors.package_restriction){
                    toast.error(errors.package_restriction)
                }
            },
        })
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <PageHeader>
                    <PageHeaderHead>
                        <PageHeaderTitle>Charts</PageHeaderTitle>
                        <PageHeaderDescription>Manage your data visualization projects and collaborate with your team.</PageHeaderDescription>
                        <PageHeaderAction>
                            <div className="flex items-center gap-2">
                                <CreateChart />
                                        {/*<Button variant="ghost" className="border" onClick={(e) => createChart(e)}>*/}
                                        {/*    {processing ? (*/}
                                        {/*        <>*/}
                                        {/*            <Loader2 className="w-5 h-5 animate-spin"/>*/}
                                        {/*            Processing...*/}
                                        {/*        </>*/}
                                        {/*    ) : (*/}
                                        {/*        <span className="flex items-center">*/}
                                        {/*            <BarChart className="mr-2 h-4 w-4" />*/}
                                        {/*            <span>Create a chart</span>*/}
                                        {/*        </span>*/}
                                        {/*    ) }*/}
                                        {/*</Button>*/}
                            </div>
                        </PageHeaderAction>
                    </PageHeaderHead>
                </PageHeader>

                <Card>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-4 md:grid-cols-3 lg:grid-cols-3">
                            <div className="col-span-2 flex items-center gap-4">
                                <div className="relative flex max-w-2xl items-center">
                                    <Search className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 transform" />
                                    <Input
                                        placeholder="Your search..."
                                        className="pl-8"
                                        value={filters.search}
                                        onChange={(e) => setFilters((prev) => ({
                                                ...prev,
                                                search: e.target.value.trim(),
                                            }))
                                        }
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-4">

                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Deferred
                        data="charts"
                        fallback={
                            <Card>
                                <CardContent>
                                    <LoadingSkeleton />
                                </CardContent>
                            </Card>
                        }
                    >
                        {charts?.length ? (
                            charts?.map((chart, index) => <ChartCard key={chart.id} index={index} chart={chart} />)
                        ) : (
                            <Card className="col-span-3">
                                <CardHeader>
                                </CardHeader>
                                <CardContent>
                                    <div className="py-8 text-center">
                                        <BarChart3 className="mx-auto mb-4 h-12 w-12" />
                                        <p className="text-secondary-foreground mb-4">No charts yet</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </Deferred>
                </div>
            </div>
        </AppLayout>
    );
}
