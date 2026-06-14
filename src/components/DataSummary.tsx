"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { BidRecord } from '@/hooks/use-data-store';
import { DollarSign, Target, CheckCircle2, Clock, MapPin, Check, Droplets, Edit2, Trash2, ArrowDownCircle, ShieldCheck, Zap, Snowflake } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EditRecordDialog from './EditRecordDialog';

interface DataSummaryProps {
  records: BidRecord[];
  onUpdate: (id: string, data: any) => void;
  onDelete: (id: string) => void;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

const DataSummary = ({ records, onUpdate, onDelete }: DataSummaryProps) => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [editingRecord, setEditingRecord] = useState<BidRecord | null>(null);

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
  const calculateSasquatchTotal = (r: BidRecord) => (r.sasquatchPad || 0) + (r.sasquatchMobilizationFee || 0) + (r.sasquatchCustomWork || 0) + (r.sasquatchArcticSteamerReserve || 0);
  
  const calculateTotal = (r: BidRecord) => calculateGutterTotal(r) + calculateDownspoutTotal(r) + calculateHelmetTotal(r) + calculateCableTotal(r) + calculateSnowFenceTotal(r) + calculateSasquatchTotal(r);
  
  const totalBidValue = records.reduce((sum, r) => sum + calculateTotal(r), 0);
  const wonValue = records.filter(r => r.status === 'Won').reduce((sum, r) => sum + calculateTotal(r), 0);
  const winRate = records.length > 0 ? (records.filter(r => r.status === 'Won').length / records.length) * 100 : 0;

  const statusData = [
    { name: 'Draft', value: records.filter(r => r.status === 'Draft').length },
    { name: 'Won', value: records.filter(r => r.status === 'Won').length },
    { name: 'Submitted', value: records.filter(r => r.status === 'Submitted').length },
    { name: 'Lost', value: records.filter(r => r.status === 'Lost').length },
  ].filter(d => d.value > 0);

  const projectData = records.reduce((acc: any[], record) => {
    const val = calculateTotal(record);
    const name = record.client;
    const existingItem = acc.find(item => item.name === name);
    if (existingItem) {
      existingItem.value += val;
    } else {
      acc.push({ name, value: val });
    }
    return acc;
  }, []).sort((a, b) => b.value - a.value).slice(0, 5);

  const areaData = records.reduce((acc: { 
    name: string; 
    value: number; 
    linearFeet: number; 
    hasDemolition: boolean;
    profiles: Set<string>;
    colors: Set<string>;
    recordCount: number;
  }[], record) => {
    const areaName = record.area || 'General Area';
    const existing = acc.find(item => item.name === areaName);
    const val = calculateTotal(record);
    
    const totalLF = record.linearFeet + (record.downspoutLinearFeet || 0) + (record.chainLinearFeet || 0) + (record.helmetLinearFeet || 0) + (record.cableLinearFeet || 0) + (record.snowFenceRow1LF || 0) + (record.snowFenceRow2LF || 0) + (record.snowFenceRow3LF || 0);

    if (existing) {
      existing.value += val;
      existing.linearFeet += totalLF;
      existing.recordCount += 1;
      if (record.demolition === 'Yes') existing.hasDemolition = true;
      if (record.gutterProfile && record.gutterProfile !== 'None') existing.profiles.add(record.gutterProfile);
      if (record.gutterColor) existing.colors.add(record.gutterColor);
    } else {
      const profiles = new Set<string>();
      if (record.gutterProfile && record.gutterProfile !== 'None') profiles.add(record.gutterProfile);
      
      const colors = new Set<string>();
      if (record.gutterColor) colors.add(record.gutterColor);

      acc.push({ 
        name: areaName, 
        value: val, 
        linearFeet: totalLF,
        hasDemolition: record.demolition === 'Yes',
        profiles,
        colors,
        recordCount: 1
      });
    }
    return acc;
  }, []).sort((a, b) => b.value - a.value);

  const areaRecords = selectedArea ? records.filter(r => (r.area || 'General Area') === selectedArea) : [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-md bg-indigo-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm font-medium">Total Pipeline</p>
                <h3 className="text-2xl font-bold">${totalBidValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h3>
              </div>
              <DollarSign className="w-8 h-8 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-emerald-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Won Value</p>
                <h3 className="text-2xl font-bold">${wonValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h3>
              </div>
              <CheckCircle2 className="w-8 h-8 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-violet-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-violet-100 text-sm font-medium">Win Rate</p>
                <h3 className="text-2xl font-bold">{winRate.toFixed(1)}%</h3>
              </div>
              <Target className="w-8 h-8 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-amber-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm font-medium">Active Bids</p>
                <h3 className="text-2xl font-bold">{records.filter(r => r.status === 'Submitted').length}</h3>
              </div>
              <Clock className="w-8 h-8 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Value by Client</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                <Bar dataKey="value" fill="#6366f1" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Status & Area Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-3 h-3" />
                  Cost per Area
                </h4>
                <ScrollArea className="h-[160px] pr-4">
                  <div className="space-y-2">
                    {areaData.length === 0 ? (
                      <p className="text-sm text-gray-400 italic">No areas defined</p>
                    ) : (
                      areaData.map((area, idx) => (
                        <div key={idx} className="group relative flex flex-col p-2 rounded-lg bg-indigo-50/50 border border-indigo-50 hover:bg-indigo-100/50 transition-colors">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-indigo-900 truncate max-w-[120px]">{area.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-indigo-600">${area.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => setSelectedArea(area.name)}
                                className="h-6 w-6 text-indigo-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Edit2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                            <span className="text-[10px] text-gray-500 font-medium">{area.linearFeet} LF Total</span>
                            
                            {area.profiles.size > 0 && (
                              <div className="flex items-center gap-1 text-[10px] text-indigo-500 font-bold">
                                <Droplets className="w-2.5 h-2.5" />
                                {Array.from(area.profiles).join(', ')}
                              </div>
                            )}

                            {area.hasDemolition && (
                              <div className="flex items-center gap-1 bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded text-[9px] font-bold">
                                <Check className="w-2 h-2" />
                                DEMO
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Area Records Dialog */}
      <Dialog open={!!selectedArea} onOpenChange={(open) => !open && setSelectedArea(null)}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-indigo-900">Items in {selectedArea}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {areaRecords.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-3 rounded-xl bg-indigo-50/50 border border-indigo-100">
                <div>
                  <p className="font-bold text-indigo-900">{record.client}</p>
                  <p className="text-xs text-indigo-500">{record.job} • {(record.linearFeet + (record.downspoutLinearFeet || 0) + (record.helmetLinearFeet || 0) + (record.cableLinearFeet || 0) + (record.snowFenceRow1LF || 0) + (record.snowFenceRow2LF || 0) + (record.snowFenceRow3LF || 0))} LF</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setEditingRecord(record)}
                    className="text-indigo-600 hover:bg-indigo-100 rounded-full"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => {
                      onDelete(record.id);
                      if (areaRecords.length <= 1) setSelectedArea(null);
                    }}
                    className="text-rose-500 hover:bg-rose-100 rounded-full"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <EditRecordDialog 
        record={editingRecord}
        isOpen={!!editingRecord}
        onClose={() => setEditingRecord(null)}
        onUpdate={onUpdate}
      />
    </div>
  );
};

export default DataSummary;