import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Link, router, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import {
    AreaChart, BarChart,
    BarChart3,
    Calendar,
    Delete,
    Edit, Eye,
    LineChart,
    LoaderCircle,
    MoreHorizontal,
    Users
} from 'lucide-react';
import { FormEventHandler } from 'react';
import { toast } from 'sonner';
import ProjectDialog from '@/components/projects/project-dialog';
import { Badge } from '@/components/ui/badge';

const MotionCard = motion(Card);
const icons = {
    area: AreaChart,
    bar: BarChart,
    line: LineChart
}

export default function ChartCard({ index = 1, chart }) {
    const { delete: destroy, reset, processing } = useForm();
    const ChartIcon = icons[chart.type]

    const deleteChart: FormEventHandler = (e) => {
        e.preventDefault();
        destroy(route('chart.delete', chart.id), {
            onError: (err) => console.error(err),
            onSuccess: (response) => {
                reset('name', 'description'); // Resets form fields if needed
                toast(response.props.flash.success, {
                    description: '🚀 Your chart has been deleted successfully.',
                });
            },
        });
    };

    return (
        <MotionCard className="hover:border-primary" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
            <CardHeader>
                <CardTitle>
                    <div className="from-gradient-from to-gradient-to flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-r">
                        {ChartIcon ? <ChartIcon/> : <BarChart3/>}
                    </div>
                </CardTitle>
                <CardAction className="flex space-x-2">
                    <Link href={route('projects.charts.edit', {
                        project: chart.project_id,
                        chart: chart.id
                    })} className="hover:text-primary" prefetch>
                        <Eye />
                    </Link>
                    <Popover>
                        <PopoverTrigger>
                            <MoreHorizontal />
                        </PopoverTrigger>
                        <PopoverContent>
                            <div className="flex flex-col space-y-2">
                                {/*<ProjectDialog*/}
                                {/*    folders={folders}*/}
                                {/*    project={project}*/}
                                {/*    trigger={*/}
                                {/*        <Button variant="ghost" className="justify-start">*/}
                                {/*            <Edit />*/}
                                {/*            <span>Edit</span>*/}
                                {/*        </Button>*/}
                                {/*    }*/}
                                {/*/>{' '}*/}
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="text-destructive-foreground hover:text-destructive-foreground justify-start"
                                        >
                                            <Delete />
                                            Delete
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action is irreversible. The selected project will be permanently deleted.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={deleteChart} disabled={processing}>
                                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                                Continue
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </PopoverContent>
                    </Popover>
                </CardAction>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <h3 className="text-foreground text-lg font-medium">{chart.title}</h3>
                    <p className="text-secondary-foreground line-clamp-3 text-sm">{chart.description}</p>
                    <Badge className="uppercase">{`${chart.type}`}</Badge>
                </div>
                <div className="mt-4 flex items-center justify-between">
                    <div className="text-secondary-foreground flex items-center text-sm">
                        <Calendar className="h-4 w-4" />
                        <span className="ml-1">{chart.created_at ? format(new Date(chart.created_at), 'dd MMM, yyyy') : ''}</span>
                    </div>
                    <div className="text-secondary-foreground flex items-center text-sm">
                        {ChartIcon ? <ChartIcon/> : <BarChart3/>}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
                <div
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium uppercase ${chart.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-200'
                    }`}
                >
                    {chart.status}
                </div>
            </CardFooter>
        </MotionCard>
    );
}
