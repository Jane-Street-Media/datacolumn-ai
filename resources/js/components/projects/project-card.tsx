import ProjectDialog from '@/components/projects/project-dialog';
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
import { useForm, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { BarChart3, Calendar, Delete, Edit, Eye, LoaderCircle, MoreHorizontal, Users } from 'lucide-react';
import { FormEventHandler } from 'react';
import { toast } from 'sonner';

const MotionCard = motion(Card);
export default function ProjectCard({ index = 1, project, folders, statuses }) {
    const { delete: destroy, reset, processing } = useForm();

    const deleteProject: FormEventHandler = (e) => {
        e.preventDefault();
        destroy(route('project.delete', project.id), {
            onError: (err) => console.error(err),
            onSuccess: (response) => {
                reset('name', 'description'); // Resets form fields if needed
                toast(response.props.flash.success, {
                    description: '🚀 Your project has been deleted successfully.',
                });
            },
        });
    }

    return (
        <MotionCard className="hover:border-primary" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
            <CardHeader>
                <CardTitle>
                    <div className="from-gradient-from to-gradient-to flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-r">
                        <BarChart3 className="h-5 w-5" />
                    </div>
                </CardTitle>
                <CardAction className="flex space-x-2">
                    <Link href={route('projects.charts.index', project.id)} className="hover:text-primary" prefetch>
                        <Eye />
                    </Link>
                    <Popover>
                        <PopoverTrigger>
                            <MoreHorizontal />
                        </PopoverTrigger>
                        <PopoverContent>
                            <div className="flex flex-col space-y-2">
                                <ProjectDialog
                                    folders={folders}
                                    project={project}
                                    statuses={statuses}
                                    trigger={
                                        <Button variant="ghost" className="justify-start">
                                            <Edit />
                                            <span>Edit</span>
                                        </Button>
                                    }
                                />{' '}
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
                                            <AlertDialogAction onClick={deleteProject} disabled={processing}>
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
                    <h3 className="text-foreground text-lg font-medium">{project.name}</h3>
                    <p className="text-secondary-foreground line-clamp-3 text-sm">{project.description}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                    <div className="text-secondary-foreground flex items-center text-sm">
                        <Calendar className="h-4 w-4" />
                        <span className="ml-1">{project.created_at ? format(new Date(project.created_at), 'dd MMM, yyyy') : ''}</span>
                    </div>
                    <div className="text-secondary-foreground flex items-center text-sm">
                        <BarChart3 className="h-4 w-4" />
                        <span className="ml-1">{project.charts_count} Charts</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
                <div
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium uppercase ${project.status === 'published'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-200'
                    }`}
                >
                    {project.status}
                </div>

                <div className="text-secondary-foreground flex items-center text-sm">
                    <Users className="h-4 w-4" />
                    <span className="ml-1">2</span>
                </div>
            </CardFooter>
        </MotionCard>
    );
}
