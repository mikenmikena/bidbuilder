"use client";

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';
import { DataRecord } from '@/hooks/use-data-store';

interface DataTableProps {
  records: DataRecord[];
  onDelete: (id: string) => void;
}

const DataTable = ({ records, onDelete }: DataTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Cancelled': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="rounded-xl border border-indigo-50 overflow-hidden bg-white/80 backdrop-blur-sm shadow-lg">
      <Table>
        <TableHeader className="bg-indigo-50/50">
          <TableRow>
            <TableHead className="font-bold text-indigo-900">Date</TableHead>
            <TableHead className="font-bold text-indigo-900">Category</TableHead>
            <TableHead className="font-bold text-indigo-900">Description</TableHead>
            <TableHead className="font-bold text-indigo-900 text-right">Amount</TableHead>
            <TableHead className="font-bold text-indigo-900">Status</TableHead>
            <TableHead className="font-bold text-indigo-900 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-12 text-gray-400">
                No records found. Add one above or import an Excel file.
              </TableCell>
            </TableRow>
          ) : (
            records.map((record) => (
              <TableRow key={record.id} className="hover:bg-indigo-50/30 transition-colors">
                <TableCell className="font-medium">{record.date}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="rounded-lg bg-indigo-50 text-indigo-700 border-indigo-100">
                    {record.category}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-[200px] truncate">{record.description}</TableCell>
                <TableCell className="text-right font-semibold">${record.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge className={`rounded-lg border ${getStatusColor(record.status)}`}>
                    {record.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onDelete(record.id)}
                    className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-full"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;