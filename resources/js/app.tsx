import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { route as routeFn } from 'ziggy-js';
import { useEffect } from 'react';

declare global {
    const route: typeof routeFn;
}

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        const AppWithLogout = () => {
            useEffect(() => {
                const logoutUrl = route('browser-logout');
                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

                const sendLogoutRequest = async () => {
                    try {
                        await fetch(logoutUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-TOKEN': csrfToken || '',
                                'X-Requested-With': 'XMLHttpRequest',
                            },
                            body: JSON.stringify({ browser_closed: true }),
                            keepalive: true
                        });
                    } catch (error) {
                        console.error('Logout request failed:', error);
                    }
                };

                const handleVisibilityChange = () => {
                    if (document.visibilityState === 'hidden') {
                        sendLogoutRequest();
                    }
                };

                const handleUnload = () => {
                    sendLogoutRequest();
                };

                window.addEventListener('visibilitychange', handleVisibilityChange);
                window.addEventListener('pagehide', handleUnload);
                window.addEventListener('unload', handleUnload);

                return () => {
                    window.removeEventListener('visibilitychange', handleVisibilityChange);
                    window.removeEventListener('pagehide', handleUnload);
                    window.removeEventListener('unload', handleUnload);
                };
            }, []);

            return <App {...props} />;
        };

        root.render(<AppWithLogout />);
    },
    progress: {
        color: '#4B5563',
    },
});