import {Button} from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader, PageHeaderAction, PageHeaderDescription, PageHeaderHead, PageHeaderTitle } from '@/components/page-header';
import { Import, Save, Loader2 } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';
import { useDataImport } from '@/hooks/use-data-import';
import { useRef } from 'react';
import EmbedDialog from '@/components/chart-editor/embed-dialog';
import ExportChart from '@/components/chart-editor/export-chart';

export function ChartHeaderActions({ chart, config, data, columns, handleConfigChange, onImportSuccess, onSave, loading } ) {
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
                                <ExportChart title={config.title} chart={chart}/>
                                <Button variant={'ghost'} className="border" onClick={(e) => handleSaveButton(e)} disabled={loading}>
                                    {loading ? (
                                        <Loader2 className="w-4 h-4 animate-spin"/>
                                    ) : (
                                        <Save />
                                    )}
                                    <span>Save</span>
                                </Button>
                                <EmbedDialog chart={chart} config={config} data={data} columns={columns} handleConfigChange={handleConfigChange} />
                            </div>
                        </PageHeaderAction>
                    </PageHeaderHead>
                </PageHeader>
            </CardContent>
        </Card>
    );
}
