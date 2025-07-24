import { LoadingSkeleton } from '@/components/loading-skeleton';
import { PageHeader, PageHeaderAction, PageHeaderDescription, PageHeaderHead, PageHeaderTitle } from '@/components/page-header';
import FolderDialog from '@/components/projects/folder-dialog';
import ProjectCard from '@/components/projects/project-card';
import ProjectDialog from '@/components/projects/project-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Deferred, Head, router } from '@inertiajs/react';
import { BarChart3, FolderOpen, Plus, Search, UserPlus, X, FolderPlus, Filter, Layers3 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Projects',
        href: '/projects',
    },
];

export default function Projects({ folders, projects, statuses }) {
    const [filters, setFilters] = useState({
        search: '',
        folder: '',
    });

    useEffect(() => {
        const debounce = setTimeout(() => {
            const trimmedSearch = filters.search.trim();
            if (trimmedSearch === '' && filters.search !== '') return;
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
        setFilters({ search: '', folder: '' });
        router.reload({
            only: ['projects'],
            data: {
                search: '',
                folder: '',
            },
        });
    };

    const hasActiveFilters = filters.search || filters.folder;
    const selectedFolder = folders?.find(f => f.id === filters.folder);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Projects" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                {/* Enhanced Page Header */}
                <PageHeader>
                    <PageHeaderHead>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20">
                                <BarChart3 className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <PageHeaderTitle>Projects</PageHeaderTitle>
                                <PageHeaderDescription>
                                    Manage your data visualization projects and collaborate with your team.
                                </PageHeaderDescription>
                            </div>
                        </div>
                        
                        <PageHeaderAction>
                            <div className="flex items-center gap-2">
                                <FolderDialog 
                                    trigger={
                                        <Button variant="outline" className="border gap-2">
                                            <FolderPlus className="h-4 w-4" />
                                            <span className="hidden lg:block">New Folder</span>
                                        </Button>
                                    }
                                />
                                <ProjectDialog
                                    folders={folders}
                                    statuses={statuses}
                                    trigger={
                                        <Button variant="ghost" className="border gap-2">
                                            <Plus className="h-4 w-4" />
                                            <span className="hidden lg:block">New Project</span>
                                        </Button>
                                    }
                                />
                            </div>
                        </PageHeaderAction>
                    </PageHeaderHead>
                </PageHeader>

                {/* Enhanced Filters Card */}
                <Card className="shadow-sm">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <CardTitle className="text-base">Search & Filter</CardTitle>
                            {hasActiveFilters && (
                                <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                                    Active
                                </span>
                            )}
                        </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                            {/* Search Input */}
                            <div className="col-span-1 lg:col-span-2">
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search projects by name..."
                                        className="pl-10"
                                        value={filters.search || ''}
                                        onChange={(e) =>
                                            setFilters((prev) => ({
                                                ...prev,
                                                search: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                            </div>

                            {/* Folder Selector */}
                            <div className="col-span-1">
                                <Select
                                    value={filters.folder?.toString() || ''}
                                    onValueChange={(value) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            folder: value ? Number(value) : '',
                                        }))
                                    }
                                >
                                    <SelectTrigger>
                                        <div className="flex items-center gap-2">
                                            <FolderOpen className="h-4 w-4 text-muted-foreground" />
                                            <SelectValue placeholder="All folders" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="">
                                                <div className="flex items-center gap-2">
                                                    <Layers3 className="h-4 w-4" />
                                                    All folders
                                                </div>
                                            </SelectItem>
                                            {folders?.map((folder) => (
                                                <SelectItem key={folder.id} value={String(folder.id)}>
                                                    <div className="flex items-center gap-2">
                                                        <FolderOpen className="h-4 w-4 text-amber-500" />
                                                        {folder.name}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Clear Filters */}
                            <div className="col-span-1 flex justify-end">
                                {hasActiveFilters && (
                                    <Button 
                                        variant="outline" 
                                        onClick={clearFilters}
                                        className="gap-2"
                                    >
                                        <X className="h-4 w-4" />
                                        Clear
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Active Filter Summary */}
                        {hasActiveFilters && (
                            <div className="mt-4 pt-4 border-t">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>Showing results for:</span>
                                    {filters.search && (
                                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                                            "{filters.search}"
                                        </span>
                                    )}
                                    {selectedFolder && (
                                        <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                                            <FolderOpen className="h-3 w-3 mr-1" />
                                            {selectedFolder.name}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Projects Grid */}
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Deferred
                        data="projects"
                        fallback={
                            <div className="col-span-full">
                                <Card>
                                    <CardContent className="p-6">
                                        <LoadingSkeleton />
                                    </CardContent>
                                </Card>
                            </div>
                        }
                    >
                        {projects?.length ? (
                            projects?.map((project, index) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                >
                                    <ProjectCard 
                                        key={project.id} 
                                        index={index} 
                                        project={project} 
                                        folders={folders} 
                                        statuses={statuses}
                                    />
                                </motion.div>
                            ))
                        ) : (
                            <Card className="col-span-full border-2 border-dashed border-muted-foreground/25">
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                                        {hasActiveFilters ? (
                                            <Search className="h-8 w-8 text-muted-foreground" />
                                        ) : (
                                            <BarChart3 className="h-8 w-8 text-muted-foreground" />
                                        )}
                                    </div>
                                    
                                    <h3 className="text-xl font-semibold mb-2">
                                        {hasActiveFilters ? 'No projects found' : 'No projects yet'}
                                    </h3>
                                    
                                    <p className="text-muted-foreground text-center mb-6 max-w-md">
                                        {hasActiveFilters 
                                            ? 'Try adjusting your search terms or changing the selected folder to find what you\'re looking for.'
                                            : 'Create your first project to start building amazing data visualizations and dashboards.'
                                        }
                                    </p>
                                    
                                    <div className="flex items-center gap-3">
                                        {hasActiveFilters ? (
                                            <Button onClick={clearFilters} variant="outline">
                                                <X className="mr-2 h-4 w-4" />
                                                Clear filters
                                            </Button>
                                        ) : (
                                            <>
                                                <FolderDialog 
                                                    trigger={
                                                        <Button variant="outline">
                                                            <FolderPlus className="mr-2 h-4 w-4" />
                                                            Create Folder
                                                        </Button>
                                                    }
                                                />
                                                <ProjectDialog
                                                    folders={folders}
                                                    statuses={statuses}
                                                    trigger={
                                                        <Button>
                                                            <Plus className="mr-2 h-4 w-4" />
                                                            Create Project
                                                        </Button>
                                                    }
                                                />
                                            </>
                                        )}
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
