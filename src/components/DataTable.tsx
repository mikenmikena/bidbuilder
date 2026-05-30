"use client";

import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Edit2, Search, Filter } from 'lucide-react';
import { BidRecord } from '@/hooks/use-data-store';
import EditRecordDialog from './EditRecordDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DataTableProps {
  records: BidRecord[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: any) => void;
}

const DataTable = ({ records, onDelete, onUpdate }: DataTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingRecord, setEditingRecord] = useState<BidRecord | null>(null);

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.projectName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         record.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.item.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const calculateTotal = (r: BidRecord) => r.linearFeet * r.unitCost * (1 + r.markup / 100);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Won': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Submitted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Draft': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Lost': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-indigo-50 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Search projects, clients..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-xl border-indigo-100"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-400" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[150px] rounded-xl border-indigo-100">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Submitted">Submitted</SelectItem>
              <SelectItem value="Won">Won</SelectItem>
              <SelectItem value="Lost">Lost</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-xl border border-indigo-50 overflow-hidden bg-white shadow-lg">
        <Table>
          <TableHeader className="bg-indigo-50/50">
            <TableRow>
              <TableHead className="font-bold text-indigo-900">Project / Client</TableHead>
              <TableHead className="font-bold text-indigo-900">Item</TableHead>
              <TableHead className="font-bold text-indigo-900 text-right">LF x Cost</TableHead>
              <TableHead className="font-bold text-indigo-900 text-right">Markup</TableHead>
              <TableHead className="font-bold text-indigo-900 text-right">Total Price</TableHead>
              <TableHead className="font-bold text-indigo-900">Status</TableHead>
              <TableHead className="font-bold text-indigo-900 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-gray-400">
                  No bid items found.
                </TableCell>
              </TableRow>
            ) : (
              filteredRecords.map((record) => (
                <TableRow key={record.id} className="hover:bg-indigo-50/30 transition-colors">
                  <TableCell>
                    <div className="font-bold text-indigo-900">{record.projectName}</div>
                    <div className="text-xs text-gray-500">{record.client}</div>
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate">{record.item}</TableCell>
                  <TableCell className="text-right">
                    <div className="text-sm">{record.linearFeet} LF x ${record.unitCost.toLocaleString()}</div>
                  </TableCell>
                  <TableCell className="text-right text-indigo-600 font-medium">
                    {record.markup}%
                  </TableCell>
                  <TableCell className="text-right font-bold text-indigo-900">
                    ${calculateTotal(record).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    <Badge className={`rounded-lg border ${getStatusColor(record.status)}`}>
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setEditingRecord(record)} className="text-indigo-500 rounded-full">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDelete(record.id)} className="text-rose-500 rounded-full">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <EditRecordDialog 
        record={editingRecord}
        isOpen={!!editingRecord}
        onClose={() => setEditingRecord(null)}
        onUpdate={onUpdate}
      />
    </div>
  );
};

export default DataTable;