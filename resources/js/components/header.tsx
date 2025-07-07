import { motion } from 'framer-motion';
import { Monitor, Moon, Sun } from 'lucide-react';
import { Logo } from '@/components/Logo';
import React, { useMemo, useState } from 'react';
import {
    Menu,
    X
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.js';
import { Button } from '@/components/ui/button.js';
import { useAppearanceContext } from '@/contexts/appearance-context.js';
import { Link, usePage } from '@inertiajs/react';
import AppLogo from '@/components/app-logo';


export default function Header(){
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showThemeMenu, setShowThemeMenu] = useState(false);
    const { appearance, setAppearance } = useAppearanceContext();
    const page = usePage()
    const user = useMemo(() => page.props.auth.user, [page])

    const getCurrentThemeIcon = () => {
        switch (appearance) {
            case 'light': return Sun;
            case 'dark': return Moon;
            case 'system': return Monitor;
            default: return Sun;
        }
    };

    const CurrentThemeIcon = getCurrentThemeIcon();

    const scrollTo = (selector) => {
        const el = document.querySelector(selector)
        if (el) {
            const yOffset = -120 // Adjust for any fixed header height
            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset

            window.scrollTo({ top: y, behavior: 'smooth' })
        }
    }
    return (
        <header className="bg-background backdrop-blur-sm border-b border-border sticky top-0 z-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" prefetch>
                        <Logo />
                    </Link>
                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        <a
                            onClick={(e) => { e.preventDefault(); scrollTo('#pricing') }}
                            className="cursor-pointer text-foreground hover:text-secondary-foreground font-medium transition-colors duration-200"
                        >
                            Pricing
                        </a>
                        {user ? (
                            <Link
                                href={route('dashboard')}
                                prefetch
                                className="text-foreground hover:text-secondary-foreground font-medium transition-colors duration-200"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={route('login')}
                                className="text-foreground hover:text-secondary-foreground font-medium transition-colors duration-200"
                            >
                                Sign In
                            </Link>
                        )}


                        {/* Theme Toggle */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <CurrentThemeIcon className="w-5 h-5 cursor-pointer" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <DropdownMenuGroup>
                                    <DropdownMenuItem asChild>
                                        <Button variant="ghost" className="w-full justify-start" onClick={() => setAppearance('light')}>
                                            <Sun className="w-5 h-5 mr-2" />
                                            Light
                                        </Button>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Button variant="ghost" className="w-full justify-start" onClick={() => setAppearance('dark')}>
                                            <Moon className="w-5 h-5 mr-2" />
                                            Dark
                                        </Button>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Button variant="ghost" className="w-full justify-start" onClick={() => setAppearance('system')}>
                                            <Monitor className="w-5 h-5 mr-2" />
                                            System
                                        </Button>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>


                        <Link
                            href={route('login')}
                            className="bg-primary/90 hover:bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                        >
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center space-x-2">
                        {/* Mobile Theme Toggle */}
                        <div className="relative">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <CurrentThemeIcon className="w-5 h-5" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end">
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem asChild>
                                            <Button variant="ghost" className="w-full justify-start" onClick={() => setAppearance('light')}>
                                                <Sun className="w-5 h-5 mr-2" />
                                                Light
                                            </Button>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Button variant="ghost" className="w-full justify-start" onClick={() => setAppearance('dark')}>
                                                <Moon className="w-5 h-5 mr-2" />
                                                Dark
                                            </Button>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Button variant="ghost" className="w-full justify-start" onClick={() => setAppearance('system')}>
                                                <Monitor className="w-5 h-5 mr-2" />
                                                System
                                            </Button>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 text-secondary-foreground hover:text-foreground transition-colors duration-200"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="md:hidden border-t border-border py-4 space-y-4"
                    >
                        <Link
                            href={route('pricing')}
                            className="block w-full text-left text-secondary-foreground hover:text-foreground font-medium py-2"
                        >
                            Pricing
                        </Link>
                        <Link
                            href={route('login')}
                            className="block w-full text-left text-secondary-foreground hover:text-foreground font-medium py-2"
                        >
                            Sign In
                        </Link>
                        <Link
                            href={route('pricing')}
                            className="w-full bg-primary/90 hover:bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                        >
                            Get Started
                        </Link>
                    </motion.div>
                )}
            </div>
        </header>


    )
}
