import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader, PageHeaderAction, PageHeaderDescription, PageHeaderHead, PageHeaderTitle } from '@/components/page-header';
import { Import, Save, Loader2, MoreVertical, FileText, Download, Code } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';
import { useDataImport } from '@/hooks/use-data-import';
import { useRef, useState } from 'react';
import EmbedDialog from '@/components/chart-editor/embed-dialog';
import ExportChart from '@/components/chart-editor/export-chart';
import { useChartEditor } from '@/contexts/chart-editor-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ChartHeaderActions() {
    const { config, setData, setColumns, chart, updateChart, updating } = useChartEditor();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { importCSV, isImporting } = useDataImport();
    const [embedDialogOpen, setEmbedDialogOpen] = useState(false);
    const [exportDialogOpen, setExportDialogOpen] = useState(false);

    const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
            toast.error('Please upload a CSV file');
            return;
        }
        try {
            const result = await importCSV(file);
            console.log('result');
            console.log(result);
            setData(result.data);
            setColumns(result.columns);
            toast.success('Data imported successfully!');
        } catch (error) {
            toast.error('Failed to import data. Please check your CSV file.');
        }
        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSave = async (e: React.MouseEvent) => {
        try {
            await updateChart(e);
            toast.success('Chart saved successfully!');
        } catch (error) {
            toast.error('Failed to save chart');
        }
    };

    return (
        <Card className="border-0 shadow-none md:border md:shadow-sm">
            <CardContent className="p-4 md:p-6">
                <PageHeader className="py-0">
                    <PageHeaderHead>
                        {/* Mobile Layout */}
                        <div className="flex flex-col space-y-4 md:hidden">
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0 pr-4">
                                    <PageHeaderTitle className="text-lg sm:text-xl truncate">
                                        {config.title || 'Q1 Sales Analysis'}
                                    </PageHeaderTitle>
                                    <PageHeaderDescription className="text-xs sm:text-sm line-clamp-2">
                                        Create and customize your data visualizations.
                                    </PageHeaderDescription>
                                </div>
                                
                                {/* Mobile Actions Dropdown */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreVertical className="h-4 w-4" />
                                            <span className="sr-only">More options</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={isImporting}
                                        >
                                            <Import className="mr-2 h-4 w-4" />
                                            Import CSV
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => setExportDialogOpen(true)}
                                        >
                                            <Download className="mr-2 h-4 w-4" />
                                            Export Chart
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={handleSave}
                                            disabled={updating}
                                        >
                                            <Save className="mr-2 h-4 w-4" />
                                            {updating ? 'Saving...' : 'Save Chart'}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => setEmbedDialogOpen(true)}
                                        >
                                            <Code className="mr-2 h-4 w-4" />
                                            Embed
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Mobile Quick Actions - Most Important */}
                            <div className="flex gap-2">
                                <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isImporting}
                                    className="flex-1"
                                >
                                    <Import className="h-4 w-4 mr-1" />
                                    Import
                                </Button>
                                <Button 
                                    size="sm"
                                    onClick={handleSave}
                                    disabled={updating}
                                    className="flex-1"
                                >
                                    {updating ? (
                                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                    ) : (
                                        <Save className="h-4 w-4 mr-1" />
                                    )}
                                    Save
                                </Button>
                            </div>
                        </div>

                        {/* Desktop Layout */}
                        <div className="hidden md:flex md:items-center md:justify-between">
                            <div>
                                <PageHeaderTitle>{config.title || 'Q1 Sales Analysis'}</PageHeaderTitle>
                                <PageHeaderDescription>
                                    Create and customize your data visualizations.
                                </PageHeaderDescription>
                            </div>
                            <PageHeaderAction>
                                <div className="flex items-center gap-2">
                                    <Button 
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isImporting}
                                        variant="outline"
                                    >
                                        {isImporting ? (
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                            <Import className="h-4 w-4 mr-2" />
                                        )}
                                        <span>Import</span>
                                    </Button>
                                    <ExportChart title={config.title} chart={chart} />
                                    <Button 
                                        onClick={handleSave} 
                                        disabled={updating}
                                    >
                                        {updating ? (
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                            <Save className="h-4 w-4 mr-2" />
                                        )}
                                        <span>Save</span>
                                    </Button>
                                    <EmbedDialog />
                                </div>
                            </PageHeaderAction>
                        </div>
                    </PageHeaderHead>
                </PageHeader>

                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileImport}
                    className="hidden"
                    aria-label="Import CSV file"
                />

                {/* Mobile Dialogs - These would need to be modified to accept open/onOpenChange props */}
                {/* You'll need to modify ExportChart and EmbedDialog components to work as controlled components */}
                {/* For now, showing them as desktop-only */}
                <div className="md:hidden">
                    {embedDialogOpen && (
                        <EmbedDialog 
                            // Add these props to EmbedDialog component
                            // open={embedDialogOpen}
                            // onOpenChange={setEmbedDialogOpen}
                        />
                    )}
                    {exportDialogOpen && (
                        <ExportChart 
                            title={config.title} 
                            chart={chart}
                            // Add these props to ExportChart component
                            // open={exportDialogOpen}
                            // onOpenChange={setExportDialogOpen}
                        />
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
