// src/contexts/AppearanceContext.tsx
import React, {
    createContext,
    ReactNode,
    useContext,
    useCallback,
    useState,
    useEffect,
} from 'react';

export type Appearance = 'light' | 'dark' | 'system';
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

// Helper to actually toggle the CSS class:
const applyTheme = (appearance: Appearance) => {
    const isDark =
        appearance === 'dark' ||
        (appearance === 'system' && mediaQuery.matches);
    document.documentElement.classList.toggle('dark', isDark);
};

interface AppearanceContextType {
    appearance: Appearance;
    setAppearance: (a: Appearance) => void;
}

const AppearanceContext = createContext<AppearanceContextType | undefined>(
    undefined
);

export function AppearanceProvider({ children }: { children: ReactNode }) {
    const [appearance, setAppearance] = useState<Appearance>(() => {
        return (localStorage.getItem('appearance') as Appearance) || 'system';
    });

    // Whenever `appearance` changes, write it and apply it.
    useEffect(() => {
        localStorage.setItem('appearance', appearance);
        applyTheme(appearance);
    }, [appearance]);

    // Listen for system‐theme changes and, if we're in `system` mode, reapply.
    useEffect(() => {
        const onSystemChange = () => {
            if (appearance === 'system') {
                applyTheme('system');
            }
        };
        mediaQuery.addEventListener('change', onSystemChange);
        return () => mediaQuery.removeEventListener('change', onSystemChange);
    }, [appearance]);

    // Also listen for storage events so that if you have multiple tabs,
    // a change in one tab will update the others.
    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (e.key === 'appearance' && e.newValue) {
                setAppearance(e.newValue as Appearance);
            }
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    const updateAppearance = useCallback((a: Appearance) => {
        setAppearance(a);
    }, []);

    return (
        <AppearanceContext.Provider
            value={{ appearance, setAppearance: updateAppearance }}
        >
            {children}
        </AppearanceContext.Provider>
    );
}

export function useAppearanceContext() {
    const ctx = useContext(AppearanceContext);
    if (!ctx)
        throw new Error(
            'useAppearanceContext must be used within <AppearanceProvider>'
        );
    return ctx;
}
