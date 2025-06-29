import { Button } from '@/components/ui/button';
import { Code, FileImage, Upload } from 'lucide-react';
import { toast } from 'sonner';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import * as React from 'react';
import { useChartExport } from '@/hooks/use-chart-export';

export default function ExportChart({ title }) {

    const { exportChart, exportChartAsSVG } = useChartExport();

    const handleExportChart = async (format: 'png' | 'svg' = 'png') => {
        try {
            if (format === 'svg') {
                await exportChartAsSVG(title || 'chart');
                toast.success('Chart exported as SVG successfully!');
            } else {
                await exportChart(title || 'chart');
                toast.success('Chart exported as PNG successfully!');
            }
        } catch (error) {
            toast.error(`Failed to export chart as ${format.toUpperCase()}.`);
        }
    };

    return (
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
    );
}
