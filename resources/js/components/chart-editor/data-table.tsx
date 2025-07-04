import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChartEditor } from '@/contexts/chart-editor-context';
import { memo, useState } from 'react';
const DataTableComponent: React.FC = () => {

    const { data, setData, columns } = useChartEditor();

    // Pagination state
    const [page, setPage] = useState(0);
    const rowsPerPage = 30; // Change as needed

    const handleCellEdit = (rowIndex: number, column: string, value: string) => {
        const newData = [...data];
        newData[rowIndex] = { ...newData[rowIndex], [column]: value };
        setData(newData)
    };

    const onAddRow = () => {
        const newRow: DataPoint = {};
        columns.forEach((col) => {
            newRow[col] = '';
        });
        setData([...data, newRow]);
    };

    // Pagination logic
    const paginatedData = data.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
    const pageCount = Math.ceil(data.length / rowsPerPage);

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
                    {paginatedData.map((data, index) => (
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
            <div className="flex justify-end items-center mt-2 gap-2">
                <Button size="sm" disabled={page === 0} onClick={() => setPage(0)}>First</Button>
                <Button size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>Prev</Button>
                <span>
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
                        className="mx-2 w-12 border rounded text-center"
                    />
                    of {pageCount}
                </span>
                <Button size="sm" disabled={page + 1 >= pageCount} onClick={() => setPage(page + 1)}>Next</Button>
                <Button size="sm" disabled={page + 1 >= pageCount} onClick={() => setPage(pageCount - 1)}>Last</Button>
            </div>
        </>
    )
}
export const DataTable = memo(DataTableComponent);
