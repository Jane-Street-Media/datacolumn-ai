import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Upload, FileText, Trash2, Download } from 'lucide-react';
// import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChartEditor } from '@/contexts/chart-editor-context';
import { memo, useState, useRef } from 'react';
import { toast } from 'sonner';

const DataTableComponent: React.FC = () => {
    const { data, setData, columns, setColumns } = useChartEditor();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // Pagination state
    const [page, setPage] = useState(0);
    const rowsPerPage = 30; // Change as needed

    const handleCellEdit = (rowIndex: number, column: string, value: string) => {
        const newData = [...data];
        newData[rowIndex] = { ...newData[rowIndex], [column]: value };
        setData(newData);
    };

    const onAddRow = () => {
        const newRow: any = {};
        columns.forEach((col) => {
            newRow[col] = '';
        });
        setData([...data, newRow]);
    };

    const clearData = () => {
        setData([]);
        setColumns([]);
        toast.success('Data cleared successfully');
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Check if it's a CSV file
        if (!file.name.toLowerCase().endsWith('.csv')) {
            toast.error('Please upload a CSV file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const csvContent = e.target?.result as string;
                const parsedData = parseCSV(csvContent);
                
                if (parsedData.length === 0) {
                    toast.error('CSV file appears to be empty');
                    return;
                }

                // Extract columns from the first row (headers)
                const newColumns = Object.keys(parsedData[0]);
                setColumns(newColumns);
                setData(parsedData);
                
                toast.success(`Successfully imported ${parsedData.length} rows with ${newColumns.length} columns`);
            } catch (error) {
                console.error('Error parsing CSV:', error);
                toast.error('Error parsing CSV file. Please check the format.');
            }
        };

        reader.onerror = () => {
            toast.error('Error reading file');
        };

        reader.readAsText(file);
        
        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const parseCSV = (csvContent: string) => {
        const lines = csvContent.trim().split('\n');
        if (lines.length === 0) return [];

        // Parse headers
        const headers = parseCSVRow(lines[0]);
        
        // Parse data rows
        const dataRows = lines.slice(1).map(line => {
            const values = parseCSVRow(line);
            const row: any = {};
            
            headers.forEach((header, index) => {
                row[header.trim()] = values[index]?.trim() || '';
            });
            
            return row;
        });

        return dataRows;
    };

    const parseCSVRow = (row: string): string[] => {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < row.length; i++) {
            const char = row[i];
            const nextChar = row[i + 1];
            
            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    // Handle escaped quotes
                    current += '"';
                    i++; // Skip next quote
                } else {
                    // Toggle quote state
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                // End of field
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        
        // Add the last field
        result.push(current);
        return result;
    };

    const downloadCSV = () => {
        if (data.length === 0) {
            toast.error('No data to download');
            return;
        }

        const csvContent = generateCSV();
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'chart-data.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            toast.success('CSV downloaded successfully');
        }
    };

    const generateCSV = (): string => {
        // Create headers row
        const headers = columns.join(',');
        
        // Create data rows
        const rows = data.map(row => {
            return columns.map(col => {
                const value = row[col] || '';
                // Escape quotes and wrap in quotes if contains comma or quote
                if (value.includes(',') || value.includes('"') || value.includes('\n')) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            }).join(',');
        });
        
        return [headers, ...rows].join('\n');
    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    // Pagination logic
    const paginatedData = data.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
    const pageCount = Math.ceil(data.length / rowsPerPage);

    return (
        <>
            {/* Action Buttons */}
            <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                    <button 
                        onClick={triggerFileUpload}
                        className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-50"
                    >
                        <Upload className="w-4 h-4" />
                        <span>Upload CSV</span>
                    </button>
                    
                    {data.length > 0 && (
                        <>
                            <button 
                                onClick={downloadCSV}
                                className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-50"
                            >
                                <Download className="w-4 h-4" />
                                <span>Download CSV</span>
                            </button>
                            
                            <button 
                                onClick={clearData}
                                className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-50 text-red-600 hover:text-red-700"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>Clear Data</span>
                            </button>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {data.length > 0 && (
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {data.length} rows • {columns.length} columns
                        </span>
                    )}
                    
                    <button onClick={onAddRow} disabled={columns.length === 0} className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50">
                        <Plus className="w-4 h-4" />
                        <span>Add Row</span>
                    </button>
                </div>
            </div>

            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".csv"
                style={{ display: 'none' }}
            />

            {/* Data Table or Empty State */}
            {data.length === 0 && columns.length === 0 ? (
                <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center">
                    <FileText className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        No data uploaded
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                        Upload a CSV file to get started, or manually add data using the table below.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <button onClick={triggerFileUpload} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            <Upload className="w-4 h-4" />
                            Upload CSV File
                        </button>
                        <span className="text-gray-400">or</span>
                        <button 
                            onClick={() => {
                                setColumns(['Column 1', 'Column 2', 'Column 3']);
                                onAddRow();
                            }}
                            className="px-4 py-2 border rounded hover:bg-gray-50"
                        >
                            Start with Empty Table
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <Table>
                        <TableCaption>
                            {data.length > 0 ? 'Your imported data. Click on any cell to edit.' : 'Add some data to get started.'}
                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableHead key={column} className="w-[100px] font-semibold">
                                        {column}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedData.map((rowData, index) => (
                                <TableRow key={index}>
                                    {columns.map((column) => (
                                        <TableCell key={`${column}-${index}`} className="p-1">
                                            <Input 
                                                className="!bg-transparent border-none shadow-none h-8 px-2 focus:bg-white dark:focus:bg-gray-800 focus:border focus:border-blue-500"
                                                value={rowData[column] || ''}
                                                onChange={(e) => handleCellEdit(page * rowsPerPage + index, column, e.target.value)}
                                                placeholder="Enter value..."
                                            />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    {pageCount > 1 && (
                        <div className="flex justify-between items-center mt-4 gap-2">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, data.length)} of {data.length} rows
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <button disabled={page === 0} onClick={() => setPage(0)} className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50">
                                    First
                                </button>
                                <button disabled={page === 0} onClick={() => setPage(page - 1)} className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50">
                                    Prev
                                </button>
                                <span className="flex items-center gap-1 text-sm">
                                    Page
                                    <input
                                        type="number"
                                        min={1}
                                        max={pageCount}
                                        value={page + 1}
                                        onChange={e => {
                                            const val = Math.max(1, Math.min(pageCount, Number(e.target.value)));
                                            setPage(val - 1);
                                        }}
                                        className="mx-1 w-12 border rounded text-center h-8 text-sm"
                                    />
                                    of {pageCount}
                                </span>
                                <button disabled={page + 1 >= pageCount} onClick={() => setPage(page + 1)} className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50">
                                    Next
                                </button>
                                <button disabled={page + 1 >= pageCount} onClick={() => setPage(pageCount - 1)} className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50">
                                    Last
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export const DataTable = memo(DataTableComponent);
