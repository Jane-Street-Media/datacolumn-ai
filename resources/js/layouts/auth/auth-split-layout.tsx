import AppLogoIcon from '@/components/app-logo-icon';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    const { name, quote } = usePage<SharedData>().props;

    return (
        <div className="bg-muted relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0" />
                <Link href={route('home')} className="relative z-20 flex items-center text-lg font-medium">
                    <AppLogoIcon className="mr-2 size-8 fill-current text-white" />
                    {name}
                </Link>
            </div>
            <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
                <div className="flex w-full max-w-md flex-col gap-6">
                    <Link href={route('home')} className="flex items-center gap-2 self-center font-medium">
                        <div className="flex h-9 w-9 items-center justify-center">
                            <AppLogoIcon className="size-9 fill-current text-black dark:text-white" />
                        </div>
                    </Link>

                    <div className="flex flex-col gap-6">
                        <Card className="rounded-xl">
                            <CardHeader className="px-10 pt-8 pb-0 text-center">
                                <CardTitle className="text-xl">{title}</CardTitle>
                                <CardDescription>{description}</CardDescription>
                            </CardHeader>
                            <CardContent className="px-10 py-8">{children}</CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
