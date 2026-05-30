"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BidRecord } from '@/hooks/use-data-store';
import { FileText, Printer, Download, Building2, User, Droplets } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface QuoteViewProps {
  projectName: string;
  records: BidRecord[];
}

const QuoteView = ({ projectName, records }: QuoteViewProps) => {
  const projectItems = records.filter(r => r.projectName === projectName);
  const client = projectItems[0]?.client || "N/A";
  const date = projectItems[0]?.date || new Date().toLocaleDateString();

  const calculateSellPrice = (r: BidRecord) => r.unitCost * (1 + r.markup / 100);
  const calculateTotal = (r: BidRecord) => r.linearFeet * calculateSellPrice(r);
  
  const subtotal = projectItems.reduce((sum, r) => sum + calculateTotal(r), 0);
  const tax = subtotal * 0.15; // Example 15% tax
  const total = subtotal + tax;

  return (
    <Card className="border-none shadow-2xl bg-white max-w-4xl mx-auto overflow-hidden">
      <div className="bg-indigo-900 p-8 text-white flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold mb-2">PROPOSAL</h2>
          <p className="text-indigo-200">Ref: {projectName.toUpperCase().replace(/\s+/g, '-')}</p>
        </div>
        <div className="text-right">
          <div className="bg-white/10 p-3 rounded-xl inline-block mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <p className="text-sm text-indigo-200">{date}</p>
        </div>
      </div>

      <CardContent className="p-8">
        <div className="grid grid-cols-2 gap-12 mb-12">
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Prepared For</h4>
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-indigo-600 mt-1" />
              <div>
                <p className="font-bold text-lg text-gray-900">{client}</p>
                <p className="text-gray-500">Project: {projectName}</p>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Prepared By</h4>
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-indigo-600 mt-1" />
              <div>
                <p className="font-bold text-lg text-gray-900">SWIS Bid Team</p>
                <p className="text-gray-500">Proposal Management System</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 overflow-hidden mb-8">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="text-gray-900 font-bold">Description</TableHead>
                <TableHead className="text-right text-gray-900 font-bold">Linear Feet</TableHead>
                <TableHead className="text-right text-gray-900 font-bold">Unit Price</TableHead>
                <TableHead className="text-right text-gray-900 font-bold">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="font-medium">{item.item}</div>
                    {(item.gutterColor || (item.gutterProfile && item.gutterProfile !== 'None')) && (
                      <div className="flex items-center gap-2 mt-1 text-xs text-indigo-600">
                        <Droplets className="w-3 h-3" />
                        <span>
                          {item.gutterProfile !== 'None' ? `${item.gutterProfile} Profile` : ''}
                          {item.gutterColor ? ` • ${item.gutterColor} Color` : ''}
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">{item.linearFeet}</TableCell>
                  <TableCell className="text-right">${calculateSellPrice(item).toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell className="text-right font-bold">${calculateTotal(item).toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end">
          <div className="w-full max-w-xs space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax (15%)</span>
              <span>${tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="pt-3 border-t border-gray-200 flex justify-between text-xl font-bold text-indigo-900">
              <span>Total Amount</span>
              <span>${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 flex gap-3 justify-end no-print">
          <Button variant="outline" className="rounded-xl" onClick={() => window.print()}>
            <Printer className="w-4 h-4 mr-2" />
            Print Proposal
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteView;