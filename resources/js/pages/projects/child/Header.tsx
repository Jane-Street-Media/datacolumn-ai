import { ArrowLeft, Download, Upload } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';

type ProjectProps = {
    project: object
}

const Header: React.Fc<ProjectProps> = ({project}) => {
    return (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 flex-shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => route('projects.index')}
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors duration-200"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{project.name}</h1>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Create and customize your data visualizations</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3">

                    <Button
                        type={'button'}
                        variant="outline"
                    >
                        <Upload className="w-4 h-4" />
                        <span className="hidden sm:inline">Import CSV</span>
                        <span className="sm:hidden">Import</span>
                    </Button>

                    <div className="relative">
                        <Button
                            type={'button'}
                            variant={'outline'}
                        >
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Export Chart</span>
                            <span className="sm:hidden">Export</span>
                        </Button>

                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                            <Button
                                type={'button'}
                                className="flex items-center space-x-2 w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm"
                            >
                                <FileImage className="w-4 h-4" />
                                <span>Export as PNG</span>
                            </Button>
                            <button
                                onClick={() => handleExportChart('svg')}
                                className="flex items-center space-x-2 w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm"
                            >
                                <Code className="w-4 h-4" />
                                <span>Export as SVG</span>
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleSaveProject}
                        disabled={isSaving}
                        className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200 text-sm"
                    >
                        {isSaving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save Project'}</span>
                        <span className="sm:hidden">Save</span>
                    </button>

                    <button
                        onClick={handleShareProject}
                        className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm"
                    >
                        <Share2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Share</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
