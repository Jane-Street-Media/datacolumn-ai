import {Button} from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader, PageHeaderAction, PageHeaderDescription, PageHeaderHead, PageHeaderTitle } from '@/components/page-header';
import { Code, FileImage, Import, Save, Share2, Sun, Upload, Loader2 } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';
import { useDataImport } from '@/hooks/use-data-import';
import { useRef } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useChartExport } from '@/hooks/use-chart-export';
import EmbedDialog from '@/components/chart-editor/embed-dialog';

export function ChartHeaderActions({ config, data, columns, onImportSuccess, onSave, loading } ) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { importCSV, isImporting } = useDataImport();
    const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
            toast.error('Please upload a CSV file');
            return;
        }

        try {
            const result = await importCSV(file);
            onImportSuccess(result)
            toast.success('Data imported successfully!');
        } catch (error) {
            toast.error('Failed to import data. Please check your CSV file.');
        }
    };

    const handleSaveButton = (e) => onSave(e);

    const { exportChart, exportChartAsSVG, exportData } = useChartExport();

    const handleExportChart = async (format: 'png' | 'svg' = 'png') => {
        try {
            if (format === 'svg') {
                await exportChartAsSVG(config.title || 'chart');
                toast.success('Chart exported as SVG successfully!');
            } else {
                await exportChart(config.title || 'chart');
                toast.success('Chart exported as PNG successfully!');
            }
        } catch (error) {
            toast.error(`Failed to export chart as ${format.toUpperCase()}.`);
        }
    };

    return (
        <Card>
            <CardContent>
                <PageHeader className="py-0">
                    <PageHeaderHead>
                        <PageHeaderTitle>Q1 Sales Analysis</PageHeaderTitle>
                        <PageHeaderDescription>Create and customize your data visualizations.</PageHeaderDescription>
                        <PageHeaderAction>
                            <div className="flex items-center gap-2">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileImport}
                                    className="hidden"
                                />
                                <Button onClick={() => fileInputRef.current?.click()}
                                        disabled={isImporting}>
                                    <Import />
                                    <span className={'hidden lg:block'}>Import</span>
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant={'ghost'} className="border">
                                            <Upload />
                                            <span className={'hidden lg:block'}>Export</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="end">
                                        <DropdownMenuItem asChild>
                                            <Button variant="ghost" className="w-full justify-start" onClick={() => handleExportChart('png')}>
                                                <FileImage className="w-4 h-4" />
                                                <span className={'hidden lg:block'}>Export as PNG</span>
                                            </Button>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Button variant="ghost" className="w-full justify-start" onClick={() => handleExportChart('svg')}>
                                                <Code className="w-4 h-4" />
                                                <span className={'hidden lg:block'}>Export as SVG</span>
                                            </Button>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Button variant={'ghost'} className="border" onClick={(e) => handleSaveButton(e)} disabled={loading}>
                                    {loading ? (
                                        <Loader2 className="w-4 h-4 animate-spin"/>
                                    ) : (
                                        <Save />
                                    )}
                                    <span>Save</span>
                                </Button>
                                <EmbedDialog config={config} data={data} columns={columns} />
                            </div>
                        </PageHeaderAction>
                    </PageHeaderHead>
                </PageHeader>
            </CardContent>
        </Card>
    );
}
