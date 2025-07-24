import { LoadingSkeleton } from '@/components/loading-skeleton';
import { PageHeader, PageHeaderAction, PageHeaderDescription, PageHeaderHead, PageHeaderTitle } from '@/components/page-header';
import FolderDialog from '@/components/projects/folder-dialog';
import ProjectCard from '@/components/projects/project-card';
import ProjectDialog from '@/components/projects/project-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Deferred, Head, router } from '@inertiajs/react';
import { BarChart3, FolderPlus, Plus, Search, FolderIcon, Filter, X, Layers3, Grid3X3 } from 'lucide-react';
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

    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

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
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20">
                                <Layers3 className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <PageHeaderTitle className="flex items-center gap-2">
                                    Projects
                                    {projects?.length > 0 && (
                                        <Badge variant="secondary" className="text-xs">
                                            {projects.length}
                                        </Badge>
                                    )}
                                </PageHeaderTitle>
                                <PageHeaderDescription>
                                    Organize your data visualization projects and collaborate with your team
                                </PageHeaderDescription>
                            </div>
                        </div>
                        
                        <PageHeaderAction>
                            <div className="flex items-center gap-2">
                                <FolderDialog 
                                    trigger={
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <FolderPlus className="h-4 w-4" />
                                            <span className="hidden sm:inline">New Folder</span>
                                        </Button>
                                    }
                                />
                                <ProjectDialog
                                    folders={folders}
                                    statuses={statuses}
                                    trigger={
                                        <Button size="sm" className="gap-2">
                                            <Plus className="h-4 w-4" />
                                            <span className="hidden sm:inline">New Project</span>
                                        </Button>
                                    }
                                />
                            </div>
                        </PageHeaderAction>
                    </PageHeaderHead>
                </PageHeader>

                {/* Enhanced Filters Card */}
                <Card className="border-l-4 border-l-primary/20">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-muted-foreground" />
                                <CardTitle className="text-sm font-medium">Filters & Search</CardTitle>
                                {hasActiveFilters && (
                                    <Badge variant="outline" className="text-xs">
                                        Active
                                    </Badge>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setViewMode('grid')}
                                    className="h-8 w-8 p-0"
                                >
                                    <Grid3X3 className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setViewMode('list')}
                                    className="h-8 w-8 p-0"
                                >
                                    <Layers3 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                            {/* Search Input */}
                            <div className="col-span-1 lg:col-span-2">
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search projects..."
                                        className="pl-10 h-10"
                                        value={filters.search || ''}
                                        onChange={(e) =>
                                            setFilters((prev) => ({
                                                ...prev,
                                                search: e.target.value,
                                            }))
                                        }
                                    />
                                    {filters.search && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                                            onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    )}
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
                                    <SelectTrigger className="h-10">
                                        <div className="flex items-center gap-2">
                                            <FolderIcon className="h-4 w-4 text-muted-foreground" />
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
                                                        <FolderIcon className="h-4 w-4 text-primary" />
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
                                        size="sm"
                                        onClick={clearFilters}
                                        className="h-10 gap-2"
                                    >
                                        <X className="h-4 w-4" />
                                        Clear
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Active Filter Indicators */}
                        {hasActiveFilters && (
                            <div className="mt-4 pt-4 border-t border-border/50">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm text-muted-foreground">Active filters:</span>
                                    {filters.search && (
                                        <Badge variant="secondary" className="gap-1">
                                            Search: "{filters.search}"
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-auto w-auto p-0 hover:bg-transparent"
                                                onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </Badge>
                                    )}
                                    {selectedFolder && (
                                        <Badge variant="secondary" className="gap-1">
                                            <FolderIcon className="h-3 w-3" />
                                            {selectedFolder.name}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-auto w-auto p-0 hover:bg-transparent"
                                                onClick={() => setFilters(prev => ({ ...prev, folder: '' }))}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Projects Grid/List */}
                <div className={`mb-8 grid gap-4 ${
                    viewMode === 'grid' 
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                        : 'grid-cols-1'
                }`}>
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
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <ProjectCard 
                                        project={project} 
                                        folders={folders} 
                                        statuses={statuses}
                                        viewMode={viewMode}
                                    />
                                </motion.div>
                            ))
                        ) : (
                            <Card className="col-span-full border-dashed border-2">
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                        {hasActiveFilters ? (
                                            <Search className="h-8 w-8 text-muted-foreground" />
                                        ) : (
                                            <BarChart3 className="h-8 w-8 text-muted-foreground" />
                                        )}
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">
                                        {hasActiveFilters ? 'No projects found' : 'No projects yet'}
                                    </h3>
                                    <p className="text-muted-foreground text-center mb-6 max-w-md">
                                        {hasActiveFilters 
                                            ? 'Try adjusting your search or filter criteria to find what you\'re looking for.'
                                            : 'Create your first data visualization project to get started with building charts and dashboards.'
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
