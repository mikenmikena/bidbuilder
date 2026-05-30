"use client";

import React, { useRef } from 'react';
import * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button";
import { FileUp } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { BidRecord } from '@/hooks/use-data-store';

interface ExcelImportProps {
  onImport: (records: BidRecord[]) => void;
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

        const formattedRecords: BidRecord[] = data.map((row) => ({
          id: crypto.randomUUID(),
          date: row.Date || new Date().toISOString().split('T')[0],
          client: row.Client || 'Unknown Client',
          linearFeet: Number(row['Linear Feet']) || Number(row.Quantity) || 1,
          unitCost: Number(row.Cost) || Number(row['Unit Cost']) || 0,
          markup: Number(row.Markup) || 20,
          status: (row.Status as any) || 'Draft',
          gutterColor: row['Gutter Color'] || 'White',
          gutterProfile: (row['Gutter Profile'] as any) || 'None',
          gutterCert: (row['Gutter Cert'] as any) || 'None',
          includeGutterDownspout: (row['Include Gutter/Downspout'] as any) || 'No',
          demolition: (row['Demolition'] as any) || 'No',
        }));

        onImport(formattedRecords);
        showSuccess(`Imported ${formattedRecords.length} bid items!`);
      } catch (err) {
        showError("Failed to parse Excel file. Ensure columns match: Client, Linear Feet, Cost, Markup, Status.");
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".xlsx, .xls, .xlsm, .csv" className="hidden" />
      <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="rounded-xl border-indigo-200 text-indigo-700">
        <FileUp className="w-4 h-4 mr-2" />
        Import Bid Data
      </Button>
    </div>
  );
};

export default ExcelImport;