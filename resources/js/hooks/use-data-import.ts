import { useState, useCallback } from 'react';
import Papa from 'papaparse';
import { DataPoint } from '../types';

export const useDataImport = () => {
  const [isImporting, setIsImporting] = useState(false);

  const importCSV = useCallback((file: File): Promise<{ data: DataPoint[]; columns: string[] }> => {
    setIsImporting(true);
    
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setIsImporting(false);
          if (results.errors.length > 0) {
            reject(new Error(results.errors[0].message));
            return;
          }

          const data = results.data as DataPoint[];
          const columns = Object.keys(data[0] || {});
          
          resolve({ data, columns });
        },
        error: (error) => {
          setIsImporting(false);
          reject(error);
        }
      });
    });
  }, []);

  return { importCSV, isImporting };
};