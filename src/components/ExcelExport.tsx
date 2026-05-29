"use client";

import React from 'react';
import * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button";
import { FileDown } from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { DataRecord } from '@/hooks/use-data-store';

interface ExcelExportProps {
  records: DataRecord[];
}

const ExcelExport = ({ records }: ExcelExportProps) => {
  const handleExport = () => {
    if (records.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(records.map(({ id, ...rest }) => rest));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Records");
    
    XLSX.writeFile(workbook, `DataFlow_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
    showSuccess("Data exported to Excel successfully!");
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleExport}
      disabled={records.length === 0}
      className="rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50"
    >
      <FileDown className="w-4 h-4 mr-2" />
      Export Excel
    </Button>
  );
};

export default ExcelExport;