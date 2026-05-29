"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { BidRecord } from '@/hooks/use-data-store';
import { DollarSign, Target, CheckCircle2, Clock } from 'lucide-react';

interface DataSummaryProps {
  records: BidRecord[];
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

const DataSummary = ({ records }: DataSummaryProps) => {
  const calculateTotal = (r: BidRecord) => r.quantity * r.unitCost * (1 + r.markup / 100);
  
  const totalBidValue = records.reduce((sum, r) => sum + calculateTotal(r), 0);
  const wonValue = records.filter(r => r.status === 'Won').reduce((sum, r) => sum + calculateTotal(r), 0);
  const winRate = records.length > 0 ? (records.filter(r => r.status === 'Won').length / records.length) * 100 : 0;

  const statusData = [
    { name: 'Draft', value: records.filter(r => r.status === 'Draft').length },
    { name: 'Won', value: records.filter(r => r.status === 'Won').length },
    { name: 'Submitted', value: records.filter(r => r.status === 'Submitted').length },
    { name: 'Lost', value: records.filter(r => r.status === 'Lost').length },
  ];

  const projectData = records.reduce((acc: any[], record) => {
    const existing = acc.find(item => item.name === record.projectName);
    const val = calculateTotal(record);
    if (existing) {
      existing.value += val;
    } else {
      acc.push({ name: record.projectName, value: val });
    }
    return acc;
  }, []).slice(0, 5);

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
            <CardTitle className="text-lg font-semibold">Value by Project</CardTitle>
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
            <CardTitle className="text-lg font-semibold">Bid Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataSummary;