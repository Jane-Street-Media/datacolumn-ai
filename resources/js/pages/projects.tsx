import { PageHeader, PageHeaderAction, PageHeaderDescription, PageHeaderHead, PageHeaderTitle } from '@/components/page-header';
import FolderDialog from '@/components/projects/folder-dialog';
import ProjectCard from '@/components/projects/project-card';
import ProjectDialog from '@/components/projects/project-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Grid3X3, List, Search } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Projects',
        href: '/projects',
    },
];

export default function Projects({ folders,projects }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <PageHeader>
                    <PageHeaderHead>
                        <PageHeaderTitle>Projects</PageHeaderTitle>
                        <PageHeaderDescription>Manage your data visualization projects and collaborate with your team.</PageHeaderDescription>
                        <PageHeaderAction>
                            <div className="flex items-center gap-2">
                                <FolderDialog />
                                <ProjectDialog folders={folders} />
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
                                    <Input placeholder="Your search..." className="pl-8" />
                                </div>

                                <Select>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select a folder" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Fruits</SelectLabel>
                                            <SelectItem value="apple">Apple</SelectItem>
                                            <SelectItem value="banana">Banana</SelectItem>
                                            <SelectItem value="blueberry">Blueberry</SelectItem>
                                            <SelectItem value="grapes">Grapes</SelectItem>
                                            <SelectItem value="pineapple">Pineapple</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center justify-end gap-4">
                                <Button variant="ghost">
                                    <Grid3X3 />
                                </Button>
                                <Button variant="ghost">
                                    <List />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project, index) => (
                        <ProjectCard key={project.id} index={index} project={project} />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
