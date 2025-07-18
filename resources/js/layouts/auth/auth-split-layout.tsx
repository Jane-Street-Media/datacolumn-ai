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
        <div className="bg-gradient-to-br from-background via-card to-secondary text-white flex items-center justify-center p-2 sm:p-4 transition-colors duration-300 min-h-screen">
            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
                
                {/* Hero Section - Better mobile spacing and reordering */}
                <div className="text-center lg:text-left px-2 sm:px-4 lg:px-0 order-2 lg:order-1 py-4 lg:py-0">
                    <Link href={route('home')}
                        className="flex items-center space-x-2 text-card-foreground mb-4 sm:mb-6 lg:mb-8 mx-auto lg:mx-0 transition-colors duration-200 hover:text-foreground text-sm sm:text-base"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to home</span>
                    </Link>

                    <div className="flex items-center justify-center lg:justify-start mb-4 sm:mb-6 lg:mb-8">
                        <Logo className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16" />
                    </div>

                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-3 sm:mb-4 lg:mb-6 leading-tight transition-colors duration-300">
                        AI-Powered Data
                        <br />
                        <span className="bg-gradient-to-r from-gradient-from to-gradient-to bg-clip-text text-transparent">
                            Visualization Platform
                        </span>
                    </h2>

                    <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-foreground mb-4 sm:mb-6 lg:mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0 transition-colors duration-300">
                        Transform your data into compelling stories with AI assistance.
                        Perfect for journalists, analysts, and content creators who need
                        professional visualizations fast.
                    </p>

                    <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4 text-center max-w-xs sm:max-w-sm mx-auto lg:mx-0">
                        <div className="p-2 sm:p-3 lg:p-4 bg-card rounded-lg sm:rounded-xl backdrop-blur-sm border-card-border border transition-colors duration-300">
                            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gradient-from mb-1">AI</div>
                            <div className="text-xs sm:text-sm text-foreground">Powered</div>
                        </div>
                        <div className="p-2 sm:p-3 lg:p-4 bg-card rounded-lg sm:rounded-xl backdrop-blur-sm border-card-border border transition-colors duration-300">
                            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gradient-to mb-1">50+</div>
                            <div className="text-xs sm:text-sm text-foreground">Chart Types</div>
                        </div>
                        <div className="p-2 sm:p-3 lg:p-4 bg-card rounded-lg sm:rounded-xl backdrop-blur-sm border-card-border border transition-colors duration-300">
                            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 mb-1">Teams</div>
                            <div className="text-xs sm:text-sm text-foreground">Collaboration</div>
                        </div>
                    </div>
                </div>

                {/* Auth Form Section - Mobile optimized, appears first on mobile */}
                <div className="flex min-h-[70vh] lg:min-h-svh flex-col items-center justify-center gap-4 sm:gap-6 p-3 sm:p-6 lg:p-10 order-1 lg:order-2">
                    <div className="flex w-full max-w-md flex-col gap-4 sm:gap-6">
                        {/* Logo - Only shown on desktop in this position */}
                        <Link href={route('home')} className="hidden lg:flex items-center gap-2 self-center font-medium">
                            <div className="flex h-9 w-9 items-center justify-center">
                                <AppLogoIcon className="size-9 fill-current text-black dark:text-white" />
                            </div>
                        </Link>

                        <div className="flex flex-col gap-4 sm:gap-6">
                            <Card className="rounded-xl shadow-lg border border-white/10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
                                <CardHeader className="px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6 lg:pt-8 pb-0 text-center">
                                    <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-white">{title}</CardTitle>
                                    {description && (
                                        <CardDescription className="text-sm sm:text-base mt-1 sm:mt-2">{description}</CardDescription>
                                    )}
                                </CardHeader>
                                <CardContent className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-8">{children}</CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
