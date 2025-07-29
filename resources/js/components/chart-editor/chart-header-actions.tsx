import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
        <>
            {/* Add global style to prevent horizontal scroll */}
            <style jsx global>{`
                @media (max-width: 767px) {
                    body {
                        overflow-x: hidden !important;
                    }
                    .max-w-full {
                        max-width: 100% !important;
                    }
                }
            `}</style>

            <Card className="border-0 shadow-none md:border md:shadow-sm overflow-hidden">
                <CardContent className="p-4 md:p-6">
                    {/* Mobile Layout - Force contain width */}
                    <div className="md:hidden w-full max-w-full overflow-hidden">
                        <div className="space-y-3 max-w-full px-0">
                            <div className="flex items-start justify-between gap-2 max-w-full">
                                <div className="flex-1 min-w-0 overflow-hidden">
                                    <h1 className="text-base font-semibold truncate max-w-full">
                                        {config.title || 'Q1 Sales Analysis'}
                                    </h1>
                                    <p className="text-xs text-muted-foreground truncate max-w-full">
                                        Create and customize your data visualizations.
                                    </p>
                                </div>
                                
                                {/* Mobile Actions Dropdown */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
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

                            {/* Mobile Quick Actions */}
                            <div className="flex gap-2 w-full max-w-full">
                                <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isImporting}
                                    className="flex-1 min-w-0"
                                >
                                    <Import className="h-4 w-4 mr-1 flex-shrink-0" />
                                    <span className="truncate">Import</span>
                                </Button>
                                <Button 
                                    size="sm"
                                    onClick={handleSave}
                                    disabled={updating}
                                    className="flex-1 min-w-0"
                                >
                                    {updating ? (
                                        <Loader2 className="h-4 w-4 mr-1 animate-spin flex-shrink-0" />
                                    ) : (
                                        <Save className="h-4 w-4 mr-1 flex-shrink-0" />
                                    )}
                                    <span className="truncate">Save</span>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden md:block">
                        <div className="flex items-center justify-between gap-4">
                            <div className="min-w-0">
                                <h2 className="text-2xl font-bold">{config.title || 'Q1 Sales Analysis'}</h2>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Create and customize your data visualizations.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
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
                        </div>
                    </div>

                    {/* Hidden file input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        onChange={handleFileImport}
                        className="hidden"
                        aria-label="Import CSV file"
                    />

                    {/* Mobile Dialogs */}
                    <div className="md:hidden">
                        <ExportChart 
                            title={config.title} 
                            chart={chart}
                            open={exportDialogOpen}
                            onOpenChange={setExportDialogOpen}
                            variant="dialog"
                        />
                        <EmbedDialog 
                            open={embedDialogOpen}
                            onOpenChange={setEmbedDialogOpen}
                        />
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
