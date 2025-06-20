import AppLayout from '@/layouts/app-layout';
import {type BreadcrumbItem} from '@/types';
import { Head } from '@inertiajs/react';
import * as React from 'react';
import IsLoading from '@/pages/projects/IsLoading';
import NotFound from '@/pages/projects/NotFound';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Projects',
        href: '/projects',
    },
    {
        title: 'Projects',
        href: route('projects.show', { project: 1 }),
    },
];

const isLoading = false;

export default function Projects({project}: { project: object }) {

    if (isLoading) {
        return  (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard" />
                <IsLoading />
            </AppLayout>
        );
    }

    if (!project) {
        return  (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard" />
                <NotFound />
            </AppLayout>
        );
    }


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />





        </AppLayout>
    );
}
