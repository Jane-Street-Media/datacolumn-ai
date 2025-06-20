import * as React from 'react';
import { Link } from '@inertiajs/react';

const NotFound: React.FC = () => {
    return (
        <>
            <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Page Not Found</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">The page you're looking for doesn't exist.</p>
                    <Link
                        href={route('projects.index')}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                    >
                        Go Back
                    </Link>
                </div>
            </div>
        </>
    );
};

export default NotFound;
