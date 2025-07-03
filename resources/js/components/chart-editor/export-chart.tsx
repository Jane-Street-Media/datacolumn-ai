import { Button } from '@/components/ui/button';
import { Code, FileImage, Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import * as React from 'react';
import { useChartExport } from '@/hooks/use-chart-export';
import { router, useForm } from '@inertiajs/react';
import { useMemo, useRef, useState } from 'react';

export default function ExportChart({ title, chart }) {

    const { exportChart, exportChartAsSVG } = useChartExport();

    const {data, setData, get} = useForm({})
    const [exporting, setExporting] = useState(false)
    const handleExportChart = (format: 'png' | 'svg' = 'png', e) => {
        e.preventDefault()
        setExporting(true)
        get(route('projects.charts.validate-export', {
            project: chart.project_id,
            chart: chart.id
        }), {
            preserveState: true,
            preserveScroll: true,
            showProgress: false,
            onSuccess: async (response) => {
                if (response.props.flash.success){
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
                    } finally {
                        setExporting(false)
                    }
                }
            },
            onError: (errors) => {
                if (errors.package_restriction){
                    toast.error(errors.package_restriction);
                }
                setExporting(false)
            },
        })

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
                    <Button variant="ghost" className="w-full justify-start" disabled={exporting} onClick={(e) => handleExportChart('png', e)}>
                        {exporting ? (<Loader2 className="w-4 h-4 animate-spin"/>) :  (<FileImage className="w-4 h-4" />)}
                        <span className={'hidden lg:block'}>Export as PNG</span>
                    </Button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Button variant="ghost" className="w-full justify-start" disabled={exporting} onClick={(e) => handleExportChart('svg', e)}>
                        {exporting ? (<Loader2 className="w-4 h-4 animate-spin"/>) :  (<Code className="w-4 h-4" />)}
                        <span className={'hidden lg:block'}>Export as SVG</span>
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
