import { Button } from '@/components/ui/button';
import { Code, FileImage, Loader2, Upload, Download } from 'lucide-react';
import { toast } from 'sonner';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import * as React from 'react';
import { useChartExport } from '@/hooks/use-chart-export';
import { useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

interface ExportChartProps {
    title: string;
    chart?: any;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    variant?: 'dropdown' | 'dialog';
    triggerClassName?: string;
}

export default function ExportChart({ 
    title, 
    chart,
    open, 
    onOpenChange,
    variant = 'dropdown',
    triggerClassName
}: ExportChartProps) {
    const { exportChart, exportChartAsSVG } = useChartExport();
    const { get } = useForm({});
    const [exporting, setExporting] = useState(false);
    const [exportingFormat, setExportingFormat] = useState<'png' | 'svg' | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    
    // Use controlled state if provided, otherwise manage internally
    const isControlled = open !== undefined;
    const isOpen = isControlled ? open : dropdownOpen;
    const setIsOpen = isControlled ? onOpenChange! : setDropdownOpen;

    const handleExportChart = async (format: 'png' | 'svg', e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        setExporting(true);
        setExportingFormat(format);
        
        get(route('projects.charts.validate-export'), {
            preserveState: true,
            preserveScroll: true,
            showProgress: false,
            onSuccess: async (response) => {
                if (response.props.flash.success) {
                    try {
                        if (format === 'svg') {
                            await exportChartAsSVG(title || 'chart');
                            toast.success('Chart exported as SVG successfully!');
                        } else {
                            await exportChart(title || 'chart');
                            toast.success('Chart exported as PNG successfully!');
                        }
                        // Close the dropdown/dialog after successful export
                        setIsOpen(false);
                    } catch (error) {
                        toast.error(`Failed to export chart as ${format.toUpperCase()}.`);
                    } finally {
                        setExporting(false);
                        setExportingFormat(null);
                    }
                }
            },
            onError: (errors) => {
                if (errors.package_restriction) {
                    toast.error(errors.package_restriction);
                }
                setExporting(false);
                setExportingFormat(null);
            },
        });
    };

    // Mobile Dialog Variant
    if (variant === 'dialog') {
        return (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Export Chart</DialogTitle>
                        <DialogDescription>
                            Choose a format to export your chart
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-3 py-4">
                        <Button
                            variant="outline"
                            className="w-full justify-start h-auto py-4"
                            disabled={exporting}
                            onClick={(e) => handleExportChart('png', e)}
                        >
                            <div className="flex items-center gap-3 w-full">
                                {exporting && exportingFormat === 'png' ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <FileImage className="h-5 w-5 text-blue-600" />
                                )}
                                <div className="text-left">
                                    <div className="font-medium">Export as PNG</div>
                                    <div className="text-sm text-muted-foreground">
                                        High-quality image format
                                    </div>
                                </div>
                            </div>
                        </Button>
                        
                        <Button
                            variant="outline"
                            className="w-full justify-start h-auto py-4"
                            disabled={exporting}
                            onClick={(e) => handleExportChart('svg', e)}
                        >
                            <div className="flex items-center gap-3 w-full">
                                {exporting && exportingFormat === 'svg' ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Code className="h-5 w-5 text-purple-600" />
                                )}
                                <div className="text-left">
                                    <div className="font-medium">Export as SVG</div>
                                    <div className="text-sm text-muted-foreground">
                                        Scalable vector format
                                    </div>
                                </div>
                            </div>
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    // Desktop Dropdown Variant (default)
    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button 
                    variant="ghost" 
                    className={triggerClassName || "border"}
                    disabled={exporting}
                >
                    {exporting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Download className="h-4 w-4" />
                    )}
                    <span className="hidden lg:block">Export</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                    disabled={exporting}
                    onClick={(e) => handleExportChart('png', e)}
                    className="cursor-pointer"
                >
                    <div className="flex items-center gap-2 w-full">
                        {exporting && exportingFormat === 'png' ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <FileImage className="h-4 w-4" />
                        )}
                        <span>Export as PNG</span>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem 
                    disabled={exporting}
                    onClick={(e) => handleExportChart('svg', e)}
                    className="cursor-pointer"
                >
                    <div className="flex items-center gap-2 w-full">
                        {exporting && exportingFormat === 'svg' ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Code className="h-4 w-4" />
                        )}
                        <span>Export as SVG</span>
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
