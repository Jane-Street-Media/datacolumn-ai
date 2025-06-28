import ProjectDialog from '@/components/projects/project-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { BarChart3, Plus } from 'lucide-react';

export default function RecentProjects({ projects, folders }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>These are the most recent projects you worked on.</CardDescription>
                {projects?.length > 0 && (
                    <CardAction>
                        <ProjectDialog
                            folders={folders}
                            trigger={
                                <Button>
                                    <Plus />
                                    <span className={'hidden lg:block'}>New Project</span>
                                </Button>
                            }
                        />
                    </CardAction>
                )}
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {projects?.length  ? (
                        projects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="hover:bg-secondary flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors duration-200"
                            >
                                {/* LEFT SIDE: icon + text */}
                                <div className="flex min-w-0 flex-1 items-center space-x-4">
                                    {/* icon: never shrink */}
                                    <div className="from-gradient-from to-gradient-to flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-r">
                                        <BarChart3 className="h-5 w-5" />
                                    </div>

                                    {/* text: allow truncation */}
                                    <div className="min-w-0">
                                        <h3 className="text-foreground truncate font-medium">{project.name}</h3>
                                        <p className="text-secondary-foreground mt-1 truncate text-sm">{project.description}</p>
                                    </div>
                                </div>

                                {/* RIGHT SIDE: status & date */}
                                <div className="ml-4 flex-shrink-0 text-right">
                                    <div
                                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                            project.status === 'published'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                        }`}
                                    >
                                        {project.status}
                                    </div>
                                    <p className="text-secondary-foreground mt-1 text-xs">{format(new Date(project.created_at), 'MMM d, yyyy')}</p>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="py-8 text-center">
                            <BarChart3 className="mx-auto mb-4 h-12 w-12" />
                            <p className="text-secondary-foreground mb-4">No projects yet</p>
                            <ProjectDialog
                                folders={folders}
                                trigger={
                                    <Button>Create Your First Project</Button>
                                }
                            />
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
