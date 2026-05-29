"use client";

import React, { useRef } from 'react';
import * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button";
import { FileUp } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { DataRecord } from '@/hooks/use-data-store';

interface ExcelImportProps {
  onImport: (records: DataRecord[]) => void;
}

const ExcelImport = ({ onImport }: ExcelImportProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws) as any[];

        const formattedRecords: DataRecord[] = data.map((row) => ({
          id: crypto.randomUUID(),
          date: row.Date || new Date().toISOString().split('T')[0],
          category: row.Category || 'Other',
          description: row.Description || 'Imported record',
          amount: Number(row.Amount) || 0,
          status: (row.Status as any) || 'Completed',
        }));

        onImport(formattedRecords);
        showSuccess(`Successfully imported ${formattedRecords.length} records!`);
      } catch (err) {
        showError("Failed to parse Excel file. Please check the format.");
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".xlsx, .xls, .csv"
        className="hidden"
      />
      <Button 
        variant="outline" 
        onClick={() => fileInputRef.current?.click()}
        className="rounded-xl border-indigo-200 text-indigo-700 hover:bg-indigo-50"
      >
        <FileUp className="w-4 h-4 mr-2" />
        Import Excel
      </Button>
    </div>
  );
};

export default ExcelImport;