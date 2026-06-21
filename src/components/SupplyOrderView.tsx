"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BidRecord } from '@/hooks/use-data-store';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Printer, FileSpreadsheet, ClipboardList, Droplets, ArrowDownCircle, ShieldCheck, Zap, Snowflake, Footprints } from 'lucide-react';

interface SupplyOrderViewProps {
  records: BidRecord[];
}

const SupplyOrderView = ({ records }: SupplyOrderViewProps) => {
  const uniqueClients = Array.from(new Set(records.map(r => r.client)));
  const [selectedClient, setSelectedClient] = useState<string>(uniqueClients[0] || "");

  const clientItems = records.filter(r => r.client === selectedClient);
  const date = new Date().toLocaleDateString();

  // Aggregate Materials
  const gutterMaterials: { [key: string]: { lf: number; color: string; cert: string; baseType: string } } = {};
  const downspoutMaterials: { [key: string]: { lf: number; color: string; size: string } } = {};
  const helmetMaterials: { [key: string]: { lf: number; color: string; roof: string } } = {};
  const cableMaterials: { [key: string]: { lf: number; layout: string; volt: string; wifi: boolean; switch: boolean; breaker: boolean; electrician: boolean } } = {};
  const snowFenceMaterials: { [key: string]: { lf: number; color: string; roof: string; level: string } } = {};
  const sasquatchMaterials: { pad: number; mobilization: number; electrical: string; fascia: string; custom: number } = {
    pad: 0,
    mobilization: 0,
    electrical: 'None',
    fascia: 'None',
    custom: 0
  };

  clientItems.forEach(item => {
    // Gutters
    if (item.linearFeet > 0 && item.gutterProfile && item.gutterProfile !== 'None') {
      const key = `${item.gutterProfile}-${item.gutterBaseType || 'Asphalt'}-${item.gutterColor || 'Default'}`;
      if (!gutterMaterials[key]) {
        gutterMaterials[key] = { 
          lf: 0, 
          color: item.gutterColor || 'Default', 
          cert: item.gutterCert || 'None',
          baseType: item.gutterBaseType || 'Asphalt'
        };
      }
      gutterMaterials[key].lf += item.linearFeet;
    }

    // Downspouts
    const dsLF = (item.downspoutLinearFeet || 0) + (item.chainLinearFeet || 0);
    if (dsLF > 0 && item.downspoutSize && item.downspoutSize !== 'None') {
      const key = `${item.downspoutSize}-${item.downspoutColor || 'Default'}`;
      if (!downspoutMaterials[key]) {
        downspoutMaterials[key] = { lf: 0, color: item.downspoutColor || 'Default', size: item.downspoutSize };
      }
      downspoutMaterials[key].lf += dsLF;
    }

    // Gutter Helmet
    if ((item.helmetLinearFeet || 0) > 0) {
      const key = `${item.helmetColor || 'Default'}-${item.roofType || 'Default'}`;
      if (!helmetMaterials[key]) {
        helmetMaterials[key] = { lf: 0, color: item.helmetColor || 'Default', roof: item.roofType || 'Default' };
      }
      helmetMaterials[key].lf += item.helmetLinearFeet || 0;
    }

    // Heat Cable
    if ((item.cableLinearFeet || 0) > 0) {
      const key = `${item.cableLayout || 'Default'}-${item.volt || '120'}V`;
      if (!cableMaterials[key]) {
        cableMaterials[key] = { 
          lf: 0, 
          layout: item.cableLayout || 'Default', 
          volt: `${item.volt || '120'}V`,
          wifi: false,
          switch: false,
          breaker: false,
          electrician: false
        };
      }
      cableMaterials[key].lf += item.cableLinearFeet || 0;
      if (item.cableWifi === 'Yes') cableMaterials[key].wifi = true;
      if (item.cableSwitch === 'Yes') cableMaterials[key].switch = true;
      if (item.cableBreaker === 'Yes') cableMaterials[key].breaker = true;
      if (item.cableElectrician === 'Yes') cableMaterials[key].electrician = true;
    }

    // Snow Fence
    const sfLF = (item.snowFenceRow1LF || 0) + (item.snowFenceRow2LF || 0) + (item.snowFenceRow3LF || 0);
    if (sfLF > 0) {
      const key = `${item.snowFenceColor || 'Default'}-${item.snowFenceRoofType || 'Default'}-${item.snowFenceLevel || 'Level 1'}`;
      if (!snowFenceMaterials[key]) {
        snowFenceMaterials[key] = { lf: 0, color: item.snowFenceColor || 'Default', roof: item.snowFenceRoofType || 'Default', level: item.snowFenceLevel || 'Level 1' };
      }
      snowFenceMaterials[key].lf += sfLF;
    }

    // Sasquatch
    if (item.sasquatchPad) sasquatchMaterials.pad += item.sasquatchPad;
    if (item.sasquatchMobilizationFee) sasquatchMaterials.mobilization += item.sasquatchMobilizationFee;
    if (item.sasquatchElectrical && item.sasquatchElectrical !== 'None') sasquatchMaterials.electrical = item.sasquatchElectrical;
    if (item.sasquatchFasciaBoard && item.sasquatchFasciaBoard !== 'None') sasquatchMaterials.fascia = item.sasquatchFasciaBoard;
    if (item.sasquatchCustomWork) sasquatchMaterials.custom += item.sasquatchCustomWork;
  });

  const hasMaterials = clientItems.length > 0;

  return (
    <div className="space-y-6">
      {/* Client Selector */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-indigo-50 shadow-sm no-print">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <ClipboardList className="w-5 h-5 text-indigo-600" />
          <span className="font-semibold text-gray-700">Select Client for Supply Order:</span>
          <Select value={selectedClient} onValueChange={setSelectedClient}>
            <SelectTrigger className="w-[250px] rounded-xl border-indigo-100">
              <SelectValue placeholder="Select a client" />
            </SelectTrigger>
            <SelectContent>
              {uniqueClients.map(client => (
                <SelectItem key={client} value={client}>{client}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {hasMaterials && (
          <Button 
            onClick={() => window.print()} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
          >
            <Printer className="w-4 h-4 mr-2" />
            Export Supply PDF
          </Button>
        )}
      </div>

      {hasMaterials ? (
        <Card className="border-none shadow-xl bg-white max-w-4xl mx-auto overflow-hidden print:shadow-none print:border-none">
          {/* Header */}
          <div className="bg-slate-900 p-8 text-white flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-1 tracking-tight">SUPPLY ORDER SHEET</h2>
              <p className="text-slate-400 text-sm">SWIS Bid Builder • Material Procurement</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">Date Generated</p>
              <p className="font-semibold">{date}</p>
            </div>
          </div>

          <CardContent className="p-8 space-y-8">
            {/* Client Info */}
            <div className="border-b border-slate-100 pb-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Project / Client Details</h3>
              <p className="text-xl font-black text-slate-900">{selectedClient}</p>
              <p className="text-sm text-indigo-600 font-medium mt-1">Active Address: {clientItems[0]?.job || "Standard Address"}</p>
            </div>

            {/* Gutter Supplies */}
            {Object.keys(gutterMaterials).length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-amber-800 flex items-center gap-2 bg-amber-50 px-3 py-2 rounded-lg">
                  <Droplets className="w-4 h-4" />
                  Gutter Materials
                </h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-bold text-slate-700">Profile / Specification</TableHead>
                      <TableHead className="font-bold text-slate-700">Color</TableHead>
                      <TableHead className="font-bold text-slate-700">Certification</TableHead>
                      <TableHead className="font-bold text-slate-700 text-right">Quantity Needed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(gutterMaterials).map(([key, data]) => (
                      <TableRow key={key}>
                        <TableCell className="font-semibold text-slate-900">{key.split('-')[0]} Seamless Gutter ({data.baseType} Base)</TableCell>
                        <TableCell>{data.color}</TableCell>
                        <TableCell>{data.cert}</TableCell>
                        <TableCell className="text-right font-bold text-indigo-900">{data.lf} LF</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Downspout Supplies */}
            {Object.keys(downspoutMaterials).length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-sky-900 flex items-center gap-2 bg-sky-50 px-3 py-2 rounded-lg">
                  <ArrowDownCircle className="w-4 h-4 text-sky-600" />
                  Downspout Materials
                </h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-gray-900 font-bold">Size / Type</TableHead>
                      <TableHead className="text-gray-900 font-bold">Color</TableHead>
                      <TableHead className="text-gray-900 font-bold text-right">Quantity Needed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(downspoutMaterials).map(([key, data]) => (
                      <TableRow key={key}>
                        <TableCell className="font-semibold text-slate-900">{data.size === 'None' ? 'Rain Chain' : `${data.size} Downspout`}</TableCell>
                        <TableCell>{data.color}</TableCell>
                        <TableCell className="text-right font-bold text-indigo-900">{data.lf} LF</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Gutter Helmet Supplies */}
            {Object.keys(helmetMaterials).length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-emerald-900 flex items-center gap-2 bg-emerald-50 px-3 py-2 rounded-lg">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Gutter Helmet Protection
                </h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-gray-900 font-bold">Protection Type</TableHead>
                      <TableHead className="text-gray-900 font-bold">Color</TableHead>
                      <TableHead className="text-gray-900 font-bold">Roof Type Compatibility</TableHead>
                      <TableHead className="text-gray-900 font-bold text-right">Quantity Needed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(helmetMaterials).map(([key, data]) => (
                      <TableRow key={key}>
                        <TableCell className="font-semibold text-slate-900">Gutter Helmet Guard</TableCell>
                        <TableCell>{data.color}</TableCell>
                        <TableCell>{data.roof}</TableCell>
                        <TableCell className="text-right font-bold text-indigo-900">{data.lf} LF</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Heat Cable Supplies */}
            {Object.keys(cableMaterials).length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-orange-900 flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-lg">
                  <Zap className="w-4 h-4 text-orange-600" />
                  Heat Cable & Electrical Components
                </h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-gray-900 font-bold">Component / Layout</TableHead>
                      <TableHead className="text-gray-900 font-bold">Voltage</TableHead>
                      <TableHead className="text-gray-900 font-bold">Accessories Included</TableHead>
                      <TableHead className="text-gray-900 font-bold text-right">Quantity Needed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(cableMaterials).map(([key, data]) => (
                      <TableRow key={key}>
                        <TableCell className="font-semibold text-slate-900">Self-Regulating Heat Cable ({data.layout})</TableCell>
                        <TableCell>{data.volt}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 text-xs">
                            {data.wifi && <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded">WiFi Controller</span>}
                            {data.switch && <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded">Manual Switch</span>}
                            {data.breaker && <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded">Breaker</span>}
                            {data.electrician && <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded">Electrician Required</span>}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-bold text-indigo-900">{data.lf} LF</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Snow Fence Supplies */}
            {Object.keys(snowFenceMaterials).length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-purple-900 flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-lg">
                  <Snowflake className="w-4 h-4 text-purple-600" />
                  Snow Retention Systems
                </h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-gray-900 font-bold">System Type</TableHead>
                      <TableHead className="text-gray-900 font-bold">Color</TableHead>
                      <TableHead className="text-gray-900 font-bold">Roof Profile & Level</TableHead>
                      <TableHead className="text-gray-900 font-bold text-right">Quantity Needed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(snowFenceMaterials).map(([key, data]) => (
                      <TableRow key={key}>
                        <TableCell className="font-semibold text-slate-900">Snow Fence Guard</TableCell>
                        <TableCell>{data.color}</TableCell>
                        <TableCell>{data.roof} ({data.level})</TableCell>
                        <TableCell className="text-right font-bold text-indigo-900">{data.lf} LF</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Sasquatch Accessories */}
            {(sasquatchMaterials.pad > 0 || sasquatchMaterials.mobilization > 0 || sasquatchMaterials.custom > 0) && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-lg">
                  <Footprints className="w-4 h-4 text-slate-600" />
                  Sasquatch System Accessories
                </h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-gray-900 font-bold">Accessory / Service</TableHead>
                      <TableHead className="text-gray-900 font-bold">Specification</TableHead>
                      <TableHead className="text-gray-900 font-bold text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sasquatchMaterials.pad > 0 && (
                      <TableRow>
                        <TableCell className="font-semibold text-slate-900">Sasquatch Pad</TableCell>
                        <TableCell>Heavy Duty Support Pad</TableCell>
                        <TableCell className="text-right font-bold text-indigo-900">Included</TableCell>
                      </TableRow>
                    )}
                    {sasquatchMaterials.electrical !== 'None' && (
                      <TableRow>
                        <TableCell className="font-semibold text-slate-900">Electrical Package</TableCell>
                        <TableCell>{sasquatchMaterials.electrical} Grade</TableCell>
                        <TableCell className="text-right font-bold text-indigo-900">Included</TableCell>
                      </TableRow>
                    )}
                    {sasquatchMaterials.fascia !== 'None' && (
                      <TableRow>
                        <TableCell className="font-semibold text-slate-900">Fascia / Shadow Board</TableCell>
                        <TableCell>{sasquatchMaterials.fascia} Wood</TableCell>
                        <TableCell className="text-right font-bold text-indigo-900">Included</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Footer Notes */}
            <div className="border-t border-slate-100 pt-6 text-xs text-slate-400 italic">
              * This document is generated automatically based on the approved bid specifications. Please verify all colors and profiles with the client before placing the final order with your distributor.
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-indigo-200 text-gray-400">
          No clients found. Add items to start building a supply order.
        </div>
      )}
    </div>
  );
};

export default SupplyOrderView;