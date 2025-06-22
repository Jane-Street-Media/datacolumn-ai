import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Plus, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';

export default function RecentProjects({ projects }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>These are the most recent projects you worked on.</CardDescription>
                <CardAction>
                    <Button>
                        <Plus />
                        <span>New Project</span>
                    </Button>
                </CardAction>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {projects.length ? (
                        projects?.map((project, index) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors duration-200 hover:bg-secondary"
                            >
                                {/* LEFT SIDE: icon + text */}
                                <div className="flex flex-1 items-center space-x-4 min-w-0">
                                    {/* icon: never shrink */}
                                    <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-gradient-from to-gradient-to">
                                        <BarChart3 className="h-5 w-5" />
                                    </div>

                                    {/* text: allow truncation */}
                                    <div className="min-w-0">
                                        <h3 className="truncate font-medium text-foreground">
                                            {project.name}
                                        </h3>
                                        <p className="mt-1 truncate text-sm text-secondary-foreground">
                                            {project.description}
                                        </p>
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
                                    <p className="mt-1 text-xs text-secondary-foreground">
                                        {format(new Date(project.created_at), 'MMM d, yyyy')}
                                    </p>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="py-8 text-center">
                            <BarChart3 className="mx-auto mb-4 h-12 w-12" />
                            <p className="mb-4 text-secondary-foreground">No projects yet</p>
                            <Button>
                                Create Your First Project
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
