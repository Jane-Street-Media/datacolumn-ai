import { Logo } from '@/components/Logo';
import { Link, usePage } from '@inertiajs/react';
import React, { useMemo } from 'react';

export default function Footer(){
    const page = usePage()
    const user = useMemo(() => page.props.auth.user, [page])

    const scrollTo = (selector) => {
        const el = document.querySelector(selector)
        if (el) {
            const yOffset = -120 // Adjust for any fixed header height
            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset

            window.scrollTo({ top: y, behavior: 'smooth' })
        }
    }

    return (
        <footer className="bg-foreground dark:bg-gray-950 text-primary-foreground py-8 sm:py-12 transition-colors duration-300 relative z-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                        <Logo showText={false} className="w-8 h-8" />
                        <Link href={route('home')}><span className="text-lg sm:text-xl font-bold">DataColumn.ai</span></Link>
                    </div>
                    <div className="flex items-center space-x-4 sm:space-x-6">
                        <a
                            onClick={(e) => { e.preventDefault(); scrollTo('#pricing') }}
                            className="cursor-pointer text-primary-foreground/80 dark:text-primary-foreground/90 hover:text-primary-foreground transition-colors duration-200"
                        >
                            Pricing
                        </a>
                        <button
                            // onClick={() => navigate('/faq')}
                            className="text-primary-foreground/80 dark:text-primary-foreground/90 hover:text-primary-foreground transition-colors duration-200"
                        >
                            FAQ
                        </button>
                        {user ? (
                            <Link
                                href={route('dashboard')}
                                prefetch
                                className="text-primary-foreground/80 dark:text-primary-foreground/90 hover:text-primary-foreground transition-colors duration-200"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={route('login')}
                                // onClick={handleSignIn}
                                className="text-primary-foreground/80 dark:text-primary-foreground/90 hover:text-primary-foreground transition-colors duration-200"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
                <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-border/10 dark:border-border text-center text-primary-foreground/80 text-sm">
                    <p>&copy; 2025 <Link href={route('home')}>DataColumn.ai</Link>. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
