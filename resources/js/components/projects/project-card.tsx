import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BarChart3, Calendar, Edit, MoreHorizontal, Trash2, Users } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';


const MotionCard = motion(Card)

export default function ProjectCard({index = 1}) {
    return (
        <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <CardHeader>
                <CardTitle>
                    <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                        <BarChart3 className="h-5 w-5" />
                    </div>
                </CardTitle>
                <CardAction>
                    <Popover>
                        <PopoverTrigger>
                            <MoreHorizontal />
                        </PopoverTrigger>
                        <PopoverContent>
                            <div className="flex flex-col space-y-2">
                                <Button variant="ghost" className="justify-start">
                                    <Edit />
                                    <span>Edit</span>
                                </Button>
                                <Button variant="ghost" className="justify-start text-destructive-foreground hover:text-destructive-foreground">
                                    <Trash2 />
                                    <span>Delete</span>
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </CardAction>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <h3 className="text-lg font-medium text-foreground">Project Name</h3>
                    <p className="text-sm text-secondary-foreground">
                        This is a brief description of the project. It provides an overview of what the project is about.
                    </p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm flex items-center text-secondary-foreground">
                        <Calendar className="w-4 h-4"/>
                        <span className="ml-1">12 April, 2025</span>
                    </div>
                    <div className="text-sm flex items-center text-secondary-foreground">
                        <BarChart3 className="w-4 h-4"/>
                        <span className="ml-1">2 Charts</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
                <div
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        'published' === 'published'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}
                >
                    {'published'}
                </div>

                <div className="text-sm flex items-center text-secondary-foreground">
                    <Users className="w-4 h-4"/>
                    <span className="ml-1">2</span>
                </div>
            </CardFooter>
        </MotionCard>
    );
}
