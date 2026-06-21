"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { BidRecord } from '@/hooks/use-data-store';
import { FileText, Printer, Download, Building2, User, Droplets, Briefcase, ArrowDownCircle, ShieldCheck, Zap, Snowflake, Footprints } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface QuoteViewProps {
  clientName: string;
  records: BidRecord[];
}

const QuoteView = ({ clientName, records }: QuoteViewProps) => {
  const clientItems = records.filter(r => r.client === clientName);
  const date = clientItems[0]?.date || new Date().toLocaleDateString();
  const jobAddress = clientItems[0]?.job || "Standard Address";

  const calculateGutterTotal = (r: BidRecord) => r.linearFeet * r.unitCost;
  const calculateDownspoutTotal = (r: BidRecord) => ((r.downspoutLinearFeet || 0) + (r.chainLinearFeet || 0)) * (r.downspoutUnitCost || 0);
  const calculateHelmetTotal = (r: BidRecord) => (r.helmetLinearFeet || 0) * (r.helmetUnitCost || 0);
  const calculateCableTotal = (r: BidRecord) => (r.cableLinearFeet || 0) * (r.cableUnitCost || 0);
  const calculateSnowFenceTotal = (r: BidRecord) => ((r.snowFenceRow1LF || 0) + (r.snowFenceRow2LF || 0) + (r.snowFenceRow3LF || 0)) * (r.snowFenceUnitCost || 0);
  const calculateSasquatchTotal = (r: BidRecord) => (r.sasquatchPad || 0) + (r.sasquatchMobilizationFee || 0) + (r.sasquatchCustomWork || 0) + (r.sasquatchArcticSteamerReserve || 0);

  const subtotal = clientItems.reduce((sum, r) => 
    sum + calculateGutterTotal(r) + calculateDownspoutTotal(r) + calculateHelmetTotal(r) + calculateCableTotal(r) + calculateSnowFenceTotal(r) + calculateSasquatchTotal(r), 0);
  
  const tax = subtotal * 0.0; 
  const total = subtotal + tax;

  return (
    <Card className="border-none shadow-2xl bg-white max-w-4xl mx-auto overflow-hidden">
      <div className="bg-indigo-900 p-8 text-white flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold mb-2">PROPOSAL</h2>
          <p className="text-indigo-200">Ref: {clientName.toUpperCase().replace(/\s+/g, '-')}</p>
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
                <p className="font-bold text-lg text-gray-900">{clientName}</p>
                <div className="flex items-center gap-1 text-indigo-600 font-medium">
                  <Briefcase className="w-3 h-3" />
                  <span>{jobAddress}</span>
                </div>
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
                <TableHead className="text-gray-900 font-bold">Specifications</TableHead>
                <TableHead className="text-right text-gray-900 font-bold">Quantity</TableHead>
                <TableHead className="text-right text-gray-900 font-bold">Unit Price</TableHead>
                <TableHead className="text-right text-gray-900 font-bold">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientItems.map((item) => (
                <React.Fragment key={item.id}>
                  {/* Gutter Row */}
                  {item.linearFeet > 0 && (
                    <TableRow>
                      <TableCell>
                        <div className="font-bold text-indigo-900">{item.area || 'General Area'} (Gutter)</div>
                        <div className="font-medium">Gutter Installation</div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-xs text-indigo-600">
                          <Droplets className="w-3 h-3" />
                          <span>
                            {item.gutterColor ? `${item.gutterColor} Color` : ''}
                            {item.gutterProfile !== 'None' ? ` • ${item.gutterProfile} Profile` : ''}
                            {item.demolition === 'Yes' ? ` • Incl. Demolition` : ''}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{item.linearFeet} LF</TableCell>
                      <TableCell className="text-right">${item.unitCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell className="text-right font-bold">${calculateGutterTotal(item).toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                    </TableRow>
                  )}
                  {/* Downspout Row */}
                  {((item.downspoutLinearFeet || 0) > 0 || (item.chainLinearFeet || 0) > 0) && (
                    <TableRow className="bg-indigo-50/20">
                      <TableCell>
                        <div className="font-bold text-violet-900">{item.area || 'General Area'} (Downspout)</div>
                        <div className="font-medium">Downspout Installation</div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-xs text-violet-600">
                          <ArrowDownCircle className="w-3 h-3" />
                          <span>
                            {item.downspoutColor ? `${item.downspoutColor} Color` : ''}
                            {item.downspoutSize !== 'None' ? ` • ${item.downspoutSize} Size` : ''}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{(item.downspoutLinearFeet || 0) + (item.chainLinearFeet || 0)} LF</TableCell>
                      <TableCell className="text-right">${(item.downspoutUnitCost || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell className="text-right font-bold">${calculateDownspoutTotal(item).toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                    </TableRow>
                  )}
                  {/* Gutter Helmet Row */}
                  {(item.helmetLinearFeet || 0) > 0 && (
                    <TableRow className="bg-emerald-50/20">
                      <TableCell>
                        <div className="font-bold text-emerald-900">{item.area || 'General Area'} (Gutter Helmet)</div>
                        <div className="font-medium">Gutter Helmet Protection</div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-xs text-emerald-600">
                          <ShieldCheck className="w-3 h-3" />
                          <span>
                            {item.helmetColor ? `${item.helmetColor} Color` : ''}
                            {item.roofType ? ` • Roof: ${item.roofType}` : ''}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{item.helmetLinearFeet} LF</TableCell>
                      <TableCell className="text-right">${(item.helmetUnitCost || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell className="text-right font-bold">${calculateHelmetTotal(item).toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                    </TableRow>
                  )}
                  {/* Heat Cable Row */}
                  {(item.cableLinearFeet || 0) > 0 && (
                    <TableRow className="bg-amber-50/20">
                      <TableCell>
                        <div className="font-bold text-amber-900">{item.area || 'General Area'} (Heat Cable)</div>
                        <div className="font-medium">Heat Cable System</div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-xs text-amber-600">
                          <Zap className="w-3 h-3" />
                          <span>
                            {item.cableLayout !== 'None' ? `${item.cableLayout} Layout` : ''}
                            {item.volt ? ` • ${item.volt}V` : ''}
                            {item.amperage ? ` • ${item.amperage}A` : ''}
                            {item.valleyCount ? ` • ${item.valleyCount} Valleys` : ''}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{item.cableLinearFeet} LF</TableCell>
                      <TableCell className="text-right">${(item.cableUnitCost || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell className="text-right font-bold">${calculateCableTotal(item).toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                    </TableRow>
                  )}
                  {/* Snow Fence Row */}
                  {((item.snowFenceRow1LF || 0) + (item.snowFenceRow2LF || 0) + (item.snowFenceRow3LF || 0)) > 0 && (
                    <TableRow className="bg-sky-50/20">
                      <TableCell>
                        <div className="font-bold text-sky-900">{item.area || 'General Area'} (Snow Fence)</div>
                        <div className="font-medium">Snow Fence Installation</div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-xs text-sky-600">
                          <Snowflake className="w-3 h-3" />
                          <span>
                            {item.snowFenceColor ? `${item.snowFenceColor} Color` : ''}
                            {item.snowFenceRoofType ? ` • Roof: ${item.snowFenceRoofType}` : ''}
                            {item.snowFenceLevel ? ` • ${item.snowFenceLevel}` : ''}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{(item.snowFenceRow1LF || 0) + (item.snowFenceRow2LF || 0) + (item.snowFenceRow3LF || 0)} LF</TableCell>
                      <TableCell className="text-right">${(item.snowFenceUnitCost || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell className="text-right font-bold">${calculateSnowFenceTotal(item).toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                    </TableRow>
                  )}
                  {/* Sasquatch Row */}
                  {calculateSasquatchTotal(item) > 0 && (
                    <TableRow className="bg-slate-50/20">
                      <TableCell>
                        <div className="font-bold text-slate-900">{item.area || 'General Area'} (Sasquatch)</div>
                        <div className="font-medium">Sasquatch System Components</div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-xs text-slate-600">
                          <Footprints className="w-3 h-3" />
                          <span>
                            {item.sasquatchElectrical !== 'None' ? `Electrical: ${item.sasquatchElectrical}` : ''}
                            {item.sasquatchFasciaBoard !== 'None' ? ` • Board: ${item.sasquatchFasciaBoard}` : ''}
                            {item.sasquatchMobilizationFee ? ` • Mobilization: $${item.sasquatchMobilizationFee}` : ''}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">1 Unit</TableCell>
                      <TableCell className="text-right">${calculateSasquatchTotal(item).toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell className="text-right font-bold">${calculateSasquatchTotal(item).toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
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