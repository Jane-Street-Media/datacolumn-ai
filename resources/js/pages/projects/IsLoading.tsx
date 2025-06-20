import * as React from 'react';

const IsLoading: React.FC = () => {
    return (
        <>
            <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                <span className="ml-2 text-gray-600 dark:text-gray-300">Loading project...</span>
            </div>
        </>
    );
};

export default IsLoading;
