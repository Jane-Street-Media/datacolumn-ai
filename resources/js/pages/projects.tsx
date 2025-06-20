import { LoadingSkeleton } from '@/components/loading-skeleton';
import { PageHeader, PageHeaderAction, PageHeaderDescription, PageHeaderHead, PageHeaderTitle } from '@/components/page-header';
import FolderDialog from '@/components/projects/folder-dialog';
import ProjectCard from '@/components/projects/project-card';
import ProjectDialog from '@/components/projects/project-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Deferred, Head, router } from '@inertiajs/react';
import {
    Search,
    X
} from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Projects',
        href: '/projects',
    },
];

export default function Projects({ folders, projects }) {
    const [filters, setFilters] = useState({
        search: '',
        folder: '',
    });

    useEffect(() => {
        if (filters.search === '' && filters.folder === '') return;

        const debounce = setTimeout(() => {
            router.reload({
                only: ['projects'],
                data: {
                    search: filters.search,
                    folder: filters.folder,
                },
            });
        }, 300);

        return () => clearTimeout(debounce);
    }, [filters]);


    const clearFilters = () => {
        setFilters({ search: null, folder: null });
        router.reload({
            only: ['projects'],
            data: {
                search: '',
                folder: '',
            },
        });
    };


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
                                    <Input
                                        placeholder="Your search..."
                                        className="pl-8"
                                        value={filters.search}
                                        onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value.trim() }))}
                                    />
                                </div>

                                <Select
                                    value={filters.folder?.toString() || ''}
                                    onValueChange={(value) =>
                                        setFilters((prev) => ({ ...prev, folder: Number(value) }))
                                    }
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select a folder" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {folders.map((folder) => (
                                                <SelectItem key={folder.id} value={String(folder.id)}>
                                                    {folder.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center justify-end gap-4">
                                <Button variant="destructive" onClick={()=>clearFilters()}>
                                    <X />
                                    Clear
                                </Button>

                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Deferred
                        data="projects"
                        fallback={
                            <Card>
                                <CardContent>
                                    <LoadingSkeleton />
                                </CardContent>
                            </Card>
                        }
                    >
                        {projects?.map((project, index) => <ProjectCard key={project.id} index={index} project={project} folders={folders} />)}{' '}
                    </Deferred>
                </div>
            </div>
        </AppLayout>
    );
}
