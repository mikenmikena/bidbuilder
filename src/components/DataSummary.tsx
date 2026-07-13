"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { BidRecord } from '@/hooks/use-data-store';
import { DollarSign, Target, CheckCircle2, Clock, MapPin, Check, Droplets, Edit2, Trash2, ArrowDownCircle, ShieldCheck, Zap, Snowflake, Footprints } from 'lucide-react';
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

  // Individual System Calculations
  const calculateGutterTotal = (r: BidRecord) => {
    const gutterCost = r.linearFeet * r.unitCost;
    const demoCost = (r.demolitionLinearFeet || 0) * (r.demolitionUnitCost || 0);
    const fasciaCost = (r.fasciaLinearFeet || 0) * (r.fasciaUnitCost || 0);
    return gutterCost + demoCost + fasciaCost;
  };
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
    return (r.sasquatchPad || 0) + (r.sasquatchMobilizationFee || 0) + (r.sasquatchCustomWork || 0) + (r.sasquatchArcticSteamerReserve || 0) + (r.sasquatchSpecialOrder || 0);
  };

  const calculateTotal = (r: BidRecord) => {
    return calculateGutterTotal(r) + calculateDownspoutTotal(r) + calculateHelmetTotal(r) + calculateCableTotal(r) + calculateSnowFenceTotal(r) + calculateSasquatchTotal(r);
  };

  // Global Totals
  const totalBidValue = records.reduce((sum, r) => sum + calculateTotal(r), 0);
  const wonValue = records.filter(r => r.status === 'Won').reduce((sum, r) => sum + calculateTotal(r), 0);
  const winRate = records.length > 0 ? (records.filter(r => r.status === 'Won').length / records.length) * 100 : 0;

  // System Breakdown Totals
  const gutterPipeline = records.reduce((sum, r) => sum + calculateGutterTotal(r), 0);
  const downspoutPipeline = records.reduce((sum, r) => sum + calculateDownspoutTotal(r), 0);
  const helmetPipeline = records.reduce((sum, r) => sum + calculateHelmetTotal(r), 0);
  const cablePipeline = records.reduce((sum, r) => sum + calculateCableTotal(r), 0);
  const snowFencePipeline = records.reduce((sum, r) => sum + calculateSnowFenceTotal(r), 0);
  const sasquatchPipeline = records.reduce((sum, r) => sum + calculateSasquatchTotal(r), 0);

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
    recordCount: number;
    products: { name: string; type: 'gutter' | 'downspout' | 'helmet' | 'cable' | 'snow' | 'sasquatch' | 'demo' | 'fascia' }[];
  }[], record) => {
    const areaName = record.area || 'General Area';
    const existing = acc.find(item => item.name === areaName);
    const val = calculateTotal(record);
    
    const totalLF = record.linearFeet + (record.downspoutLinearFeet || 0) + (record.chainLinearFeet || 0) + (record.helmetLinearFeet || 0) + (record.cableLinearFeet || 0) + (record.snowFenceRow1LF || 0) + (record.snowFenceRow2LF || 0) + (record.snowFenceRow3LF || 0);

    // Build product list for this record
    const recordProducts: { name: string; type: 'gutter' | 'downspout' | 'helmet' | 'cable' | 'snow' | 'sasquatch' | 'demo' | 'fascia' }[] = [];
    if (record.linearFeet > 0 && record.gutterProfile && record.gutterProfile !== 'None') {
      recordProducts.push({
        name: `${record.gutterProfile} Gutter (${record.linearFeet} LF, ${record.gutterColor || 'White'})`,
        type: 'gutter'
      });
    }
    if ((record.demolitionLinearFeet || 0) > 0) {
      recordProducts.push({
        name: `Demolition (${record.demolitionLinearFeet} LF)`,
        type: 'demo'
      });
    }
    if ((record.fasciaLinearFeet || 0) > 0 && record.fascia && record.fascia !== 'None') {
      recordProducts.push({
        name: `${record.fascia} Fascia (${record.fasciaLinearFeet} LF)`,
        type: 'fascia'
      });
    }
    const dsLF = (record.downspoutLinearFeet || 0) + (record.chainLinearFeet || 0);
    if (dsLF > 0 && record.downspoutSize && record.downspoutSize !== 'None') {
      recordProducts.push({
        name: `${record.downspoutSize} Downspout (${dsLF} LF, ${record.downspoutColor || 'White'})`,
        type: 'downspout'
      });
    } else if (record.chainLinearFeet && record.chainLinearFeet > 0) {
      recordProducts.push({
        name: `Rain Chain (${record.chainLinearFeet} LF)`,
        type: 'downspout'
      });
    }
    if ((record.helmetLinearFeet || 0) > 0) {
      recordProducts.push({
        name: `Gutter Helmet (${record.helmetLinearFeet} LF, ${record.helmetColor || 'White'})`,
        type: 'helmet'
      });
    }
    if ((record.cableLinearFeet || 0) > 0) {
      recordProducts.push({
        name: `Heat Cable: ${record.cableLayout || 'Standard'} (${record.cableLinearFeet} LF)`,
        type: 'cable'
      });
    }
    const sfLF = (record.snowFenceRow1LF || 0) + (record.snowFenceRow2LF || 0) + (record.snowFenceRow3LF || 0);
    if (sfLF > 0) {
      recordProducts.push({
        name: `Snow Fence (${sfLF} LF, ${record.snowFenceColor || 'White'})`,
        type: 'snow'
      });
    }
    if (calculateSasquatchTotal(record) > 0) {
      recordProducts.push({
        name: `Sasquatch System`,
        type: 'sasquatch'
      });
    }

    if (existing) {
      existing.value += val;
      existing.linearFeet += totalLF;
      existing.recordCount += 1;
      recordProducts.forEach(p => {
        if (!existing.products.some(ep => ep.name === p.name)) {
          existing.products.push(p);
        }
      });
    } else {
      acc.push({ 
        name: areaName, 
        value: val, 
        linearFeet: totalLF,
        recordCount: 1,
        products: recordProducts
      });
    }
    return acc;
  }, []).sort((a, b) => b.value - a.value);

  const areaRecords = selectedArea ? records.filter(r => (r.area || 'General Area') === selectedArea) : [];

  const getProductIcon = (type: string) => {
    switch (type) {
      case 'gutter': return <Droplets className="w-3 h-3 text-amber-600" />;
      case 'demo': return <Trash2 className="w-3 h-3 text-rose-600" />;
      case 'fascia': return <Droplets className="w-3 h-3 text-amber-800" />;
      case 'downspout': return <ArrowDownCircle className="w-3 h-3 text-sky-600" />;
      case 'helmet': return <ShieldCheck className="w-3 h-3 text-emerald-600" />;
      case 'cable': return <Zap className="w-3 h-3 text-orange-600" />;
      case 'snow': return <Snowflake className="w-3 h-3 text-purple-600" />;
      case 'sasquatch': return <Footprints className="w-3 h-3 text-slate-600" />;
      default: return null;
    }
  };

  const getProductBg = (type: string) => {
    switch (type) {
      case 'gutter': return 'bg-amber-50 border-amber-200 text-amber-900';
      case 'demo': return 'bg-rose-50 border-rose-200 text-rose-900';
      case 'fascia': return 'bg-amber-50/50 border-amber-200 text-amber-950';
      case 'downspout': return 'bg-sky-50 border-sky-200 text-sky-900';
      case 'helmet': return 'bg-emerald-50 border-emerald-200 text-emerald-900';
      case 'cable': return 'bg-orange-50 border-orange-200 text-orange-900';
      case 'snow': return 'bg-purple-50 border-purple-200 text-purple-900';
      case 'sasquatch': return 'bg-slate-50 border-slate-200 text-slate-900';
      default: return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  return (
    <div className="space-y-6">
      {/* Main KPI Cards */}
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

      {/* Charts & Area Breakdown */}
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
                <ScrollArea className="h-[240px] pr-4">
                  <div className="space-y-3">
                    {areaData.length === 0 ? (
                      <p className="text-sm text-gray-400 italic">No areas defined</p>
                    ) : (
                      areaData.map((area, idx) => (
                        <div key={idx} className="group relative flex flex-col p-3 rounded-xl bg-indigo-50/50 border border-indigo-50 hover:bg-indigo-100/50 transition-colors">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-bold text-indigo-900 truncate max-w-[120px]">{area.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-black text-indigo-600">${area.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
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
                          
                          {/* Attached Products List */}
                          <div className="space-y-1.5">
                            {area.products.map((prod, pIdx) => (
                              <div 
                                key={pIdx} 
                                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[10px] font-semibold ${getProductBg(prod.type)}`}
                              >
                                {getProductIcon(prod.type)}
                                <span className="truncate">{prod.name}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-2 pt-2 border-t border-indigo-100/50 flex justify-between items-center text-[9px] text-gray-400 font-medium">
                            <span>{area.linearFeet} LF Total</span>
                            <span>{area.recordCount} item{area.recordCount > 1 ? 's' : ''}</span>
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

      {/* Color-Coded Section Pricing Breakdown (Moved to the bottom) */}
      <div className="space-y-3 pt-4">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Section Pricing Breakdown</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Gutter */}
          <Card className="border border-amber-200 bg-amber-50/50 shadow-sm">
            <CardContent className="p-4 flex flex-col justify-between h-24">
              <div className="flex items-center justify-between text-amber-800">
                <span className="text-xs font-bold">Gutter</span>
                <Droplets className="w-4 h-4" />
              </div>
              <h4 className="text-lg font-black text-amber-900">${gutterPipeline.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h4>
            </CardContent>
          </Card>

          {/* Downspout */}
          <Card className="border border-sky-200 bg-sky-50/50 shadow-sm">
            <CardContent className="p-4 flex flex-col justify-between h-24">
              <div className="flex items-center justify-between text-sky-800">
                <span className="text-xs font-bold">Downspout</span>
                <ArrowDownCircle className="w-4 h-4" />
              </div>
              <h4 className="text-lg font-black text-sky-900">${downspoutPipeline.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h4>
            </CardContent>
          </Card>

          {/* Gutter Helmet */}
          <Card className="border border-emerald-200 bg-emerald-50/50 shadow-sm">
            <CardContent className="p-4 flex flex-col justify-between h-24">
              <div className="flex items-center justify-between text-emerald-800">
                <span className="text-xs font-bold">Helmet</span>
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-lg font-black text-emerald-900">${helmetPipeline.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h4>
            </CardContent>
          </Card>

          {/* Heat Cable */}
          <Card className="border border-orange-200 bg-orange-50/50 shadow-sm">
            <CardContent className="p-4 flex flex-col justify-between h-24">
              <div className="flex items-center justify-between text-orange-800">
                <span className="text-xs font-bold">Heat Cable</span>
                <Zap className="w-4 h-4" />
              </div>
              <h4 className="text-lg font-black text-orange-900">${cablePipeline.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h4>
            </CardContent>
          </Card>

          {/* Snow Fence */}
          <Card className="border border-purple-200 bg-purple-50/50 shadow-sm">
            <CardContent className="p-4 flex flex-col justify-between h-24">
              <div className="flex items-center justify-between text-purple-800">
                <span className="text-xs font-bold">Snow Fence</span>
                <Snowflake className="w-4 h-4" />
              </div>
              <h4 className="text-lg font-black text-purple-900">${snowFencePipeline.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h4>
            </CardContent>
          </Card>

          {/* Sasquatch */}
          <Card className="border border-slate-200 bg-slate-50/50 shadow-sm">
            <CardContent className="p-4 flex flex-col justify-between h-24">
              <div className="flex items-center justify-between text-slate-800">
                <span className="text-xs font-bold">Sasquatch</span>
                <Footprints className="w-4 h-4" />
              </div>
              <h4 className="text-lg font-black text-slate-900">${sasquatchPipeline.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h4>
            </CardContent>
          </Card>
        </div>
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