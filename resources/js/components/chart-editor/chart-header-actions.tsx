import {Button} from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader, PageHeaderAction, PageHeaderDescription, PageHeaderHead, PageHeaderTitle } from '@/components/page-header';
import { Import, Save, Share2, Upload } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';
import { useDataImport } from '@/hooks/use-data-import';
import { useRef } from 'react';


export function ChartHeaderActions({ onImportSuccess } ) {
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
                                    <span>Import</span>
                                </Button>
                                <Button variant={'ghost'} className="border">
                                    <Upload />
                                    <span>Export</span>
                                </Button>
                                <Button variant={'ghost'} className="border">
                                    <Save />
                                    <span>Save</span>
                                </Button>
                                <Button variant={'ghost'} className="border">
                                    <Share2 />
                                    <span>Share</span>
                                </Button>
                            </div>
                        </PageHeaderAction>
                    </PageHeaderHead>
                </PageHeader>
            </CardContent>
        </Card>
    );
}
