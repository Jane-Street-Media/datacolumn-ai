import AppLogoIcon from '@/components/app-logo-icon';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/Logo';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    const { name, quote } = usePage<SharedData>().props;

    return (
        <div className="bg-gradient-to-br from-background via-card to-secondary text-white flex items-center justify-center p-4 transition-colors duration-300">
            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">


                <div className="text-center lg:text-left px-4 lg:px-0">
                    <Link href={route('home')}
                        className={`flex items-center space-x-2 text-card-foreground mb-6 lg:mb-8 mx-auto lg:mx-0 transition-colors duration-200`}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to home</span>
                    </Link>

                    <div className="flex items-center justify-center lg:justify-start mb-6 lg:mb-8">
                        <Logo className="w-12 h-12 sm:w-16 sm:h-16" />
                    </div>

                    <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 lg:mb-6 leading-tight transition-colors duration-300`}>
                        AI-Powered Data
                        <br />
                        <span className="bg-gradient-to-r from-gradient-from to-gradient-to bg-clip-text text-transparent">
                            Visualization Platform
                        </span>
                    </h2>

                    <p className={`text-lg sm:text-xl text-foreground mb-6 lg:mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0 transition-colors duration-300`}>
                        Transform your data into compelling stories with AI assistance.
                        Perfect for journalists, analysts, and content creators who need
                        professional visualizations fast.
                    </p>

                    <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center max-w-sm mx-auto lg:mx-0">
                        <div className={`p-3 sm:p-4 bg-card rounded-xl backdrop-blur-sm border-card-border border transition-colors duration-300`}>
                            <div className="text-xl sm:text-2xl font-bold text-gradient-from mb-1">AI</div>
                            <div className={`text-xs sm:text-sm text-foreground`}>Powered</div>
                        </div>
                        <div className={`p-3 sm:p-4 bg-card rounded-xl backdrop-blur-sm border-card-border border transition-colors duration-300`}>
                            <div className="text-xl sm:text-2xl font-bold text-gradient-to mb-1">50+</div>
                            <div className={`text-xs sm:text-sm text-foreground`}>Chart Types</div>
                        </div>
                        <div className={`p-3 sm:p-4 bg-card rounded-xl backdrop-blur-sm border-card-border border transition-colors duration-300`}>
                            <div className="text-xl sm:text-2xl font-bold text-green-600 mb-1">Teams</div>
                            <div className={`text-xs sm:text-sm text-foreground`}>Collaboration</div>
                        </div>
                    </div>
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
        </div>
    );
}
