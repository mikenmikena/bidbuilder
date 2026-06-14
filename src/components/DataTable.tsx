"use client";

import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Edit2, Search, Filter, Droplets, ArrowDownCircle, ShieldCheck, Zap, Snowflake } from 'lucide-react';
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
    const matchesSearch = record.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         record.job.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const calculateGutterTotal = (r: BidRecord) => r.linearFeet * r.unitCost;
  const calculateDownspoutTotal = (r: BidRecord) => {
    const lf = r.downspoutLinearFeet || 0;
    const chainLf = r.chainLinearFeet || 0;
    const cost = r.downspoutUnitCost || 0;
    return (lf + chainLf) * cost;
  };
  const calculateHelmetTotal = (r: BidRecord) => (r.helmetLinearFeet || 0) * (r.helmetUnitCost || 0);
  const calculateCableTotal = (r: BidRecord) => (r.cableLinearFeet || 0) * (r.cableUnitCost || 0);
  const calculateSnowFenceTotal = (r: BidRecord) => {
    const totalLF = (r.snowFenceRow1LF || 0) + (r.snowFenceRow2LF || 0) + (r.snowFenceRow3LF || 0);
    return totalLF * (r.snowFenceUnitCost || 0);
  };
  const calculateSasquatchTotal = (r: BidRecord) => {
    return (r.sasquatchPad || 0) + (r.sasquatchMobilizationFee || 0) + (r.sasquatchCustomWork || 0) + (r.sasquatchArcticSteamerReserve || 0);
  };
  const calculateTotal = (r: BidRecord) => calculateGutterTotal(r) + calculateDownspoutTotal(r) + calculateHelmetTotal(r) + calculateCableTotal(r) + calculateSnowFenceTotal(r) + calculateSasquatchTotal(r);

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
            placeholder="Search clients or jobs..." 
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
              <TableHead className="font-bold text-indigo-900">Date</TableHead>
              <TableHead className="font-bold text-indigo-900">Client / Job</TableHead>
              <TableHead className="font-bold text-indigo-900">Systems</TableHead>
              <TableHead className="font-bold text-indigo-900">Downspout</TableHead>
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
                  <TableCell className="text-sm text-gray-500">{record.date}</TableCell>
                  <TableCell>
                    <div className="font-bold text-indigo-900">{record.client}</div>
                    <div className="text-xs text-indigo-500 font-medium">{record.job}</div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      {record.linearFeet > 0 && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-600">
                          <Droplets className="w-2.5 h-2.5" />
                          Gutter: {record.linearFeet} LF
                        </div>
                      )}
                      {(record.helmetLinearFeet || 0) > 0 && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                          <ShieldCheck className="w-2.5 h-2.5" />
                          Helmet: {record.helmetLinearFeet} LF
                        </div>
                      )}
                      {(record.cableLinearFeet || 0) > 0 && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600">
                          <Zap className="w-2.5 h-2.5" />
                          Cable: {record.cableLinearFeet} LF
                        </div>
                      )}
                      {((record.snowFenceRow1LF || 0) + (record.snowFenceRow2LF || 0) + (record.snowFenceRow3LF || 0)) > 0 && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-sky-600">
                          <Snowflake className="w-2.5 h-2.5" />
                          Snow Fence: {(record.snowFenceRow1LF || 0) + (record.snowFenceRow2LF || 0) + (record.snowFenceRow3LF || 0)} LF
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {(record.downspoutLinearFeet || 0) > 0 || (record.chainLinearFeet || 0) > 0 ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-violet-600">
                          <ArrowDownCircle className="w-2.5 h-2.5" />
                          {(record.downspoutLinearFeet || 0) + (record.chainLinearFeet || 0)} LF
                        </div>
                      </div>
                    ) : <span className="text-gray-300 text-xs">N/A</span>}
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