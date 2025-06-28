import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCallback } from 'react';

interface DataTableProps {
    data: [];
    columns: string[];
    onDataChange: (data: []) => void;
    onAddRow: () => void;
}

export const DataTable: React.FC<DataTableProps> = ({
    data,
    columns,
    onDataChange,
    onAddRow
}) => {

    const handleCellEdit = useCallback((rowIndex: number, column: string, value: string) => {
        const newData = [...data];
        newData[rowIndex] = { ...newData[rowIndex], [column]: value };
        onDataChange(newData);
    }, [data, onDataChange]);

    return (
        <>
            <div className="flex items-center justify-end mb-4">
                <Button onClick={onAddRow}>
                    <Plus className="w-4 h-4" />
                    <span>Add Row</span>
                </Button>
            </div>
            <Table>
                <TableCaption>Your imported data.</TableCaption>
                <TableHeader>
                    <TableRow>
                        {columns.map((column) => (
                            <TableHead key={column} className="w-[100px]">{column}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((data, index) => (
                        <TableRow key={index}>
                            {columns.map((column) => (
                                <TableCell key={`${column}-${index}`}>
                                    <Input className="!bg-transparent"
                                        value={data[column] || ''}
                                        onChange={(e) => handleCellEdit(index, column, e.target.value)}
                                    />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}
