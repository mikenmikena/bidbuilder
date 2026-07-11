"use client";

import React, { useState } from 'react';
import { useDataStore } from '@/hooks/use-data-store';
import DataEntryForm from '@/components/DataEntryForm';
import DataSummary from '@/components/DataSummary';
import DataTable from '@/components/DataTable';
import ExcelImport from '@/components/ExcelImport';
import ExcelExport from '@/components/ExcelExport';
import QuoteView from '@/components/QuoteView';
import SupplyOrderView from '@/components/SupplyOrderView';
import PricingSettings from '@/components/PricingSettings';
import PricingLock from '@/components/PricingLock';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { LayoutDashboard, Database, FileSpreadsheet, Briefcase, ArrowLeft, Settings2, ClipboardCheck } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { records, pricing, addRecord, updateRecord, deleteRecord, importRecords, updatePricing } = useDataStore();
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  const uniqueClients = Array.from(new Set(records.map(r => r.client)));

  const calculateTotal = (r: any) => {
    const gutter = r.linearFeet * r.unitCost;
    const downspout = ((r.downspoutLinearFeet || 0) + (r.chainLinearFeet || 0)) * (r.downspoutUnitCost || 0);
    const helmet = (r.helmetLinearFeet || 0) * (r.helmetUnitCost || 0);
    const cable = (r.cableLinearFeet || 0) * (r.cableUnitCost || 0);
    const snowFence = ((r.snowFenceRow1LF || 0) + (r.snowFenceRow2LF || 0) + (r.snowFenceRow3LF || 0)) * (r.snowFenceUnitCost || 0);
    const sasquatch = (r.sasquatchPad || 0) + (r.sasquatchMobilizationFee || 0) + (r.sasquatchCustomWork || 0) + (r.sasquatchArcticSteamerReserve || 0);
    return gutter + downspout + helmet + cable + snowFence + sasquatch;
  };

  const getClientStats = (clientName: string) => {
    const items = records.filter(r => r.client === clientName);
    const total = items.reduce((sum, r) => sum + calculateTotal(r), 0);
    return { count: items.length, total };
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12">
      {/* Header */}
      <header className="bg-white border-b border-indigo-50 sticky top-0 z-10 backdrop-blur-md bg-white/80 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/Logo.svg" alt="SWIS Bid Builder Logo" className="h-10 w-auto object-contain" />
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              SWIS Bid Builder
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <ExcelExport records={records} />
            <ExcelImport onImport={importRecords} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedClient ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedClient(null)}
              className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl no-print"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <QuoteView clientName={selectedClient} records={records} />
          </div>
        ) : (
          <>
            <div className="mb-8 no-print">
              <h2 className="text-3xl font-extrabold text-slate-900">Estimate Dashboard</h2>
              <p className="text-slate-500">Manage your clients, bids, and material supply orders.</p>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="bg-white p-1 rounded-2xl border border-indigo-50 shadow-sm inline-flex flex-wrap gap-1">
                <TabsTrigger value="overview" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="clients" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Clients
                </TabsTrigger>
                <TabsTrigger value="records" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all">
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  All Items
                </TabsTrigger>
                <TabsTrigger value="supplies" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all">
                  <ClipboardCheck className="w-4 h-4 mr-2" />
                  Supply Order
                </TabsTrigger>
                <TabsTrigger value="pricing" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all">
                  <Settings2 className="w-4 h-4 mr-2" />
                  Pricing
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1">
                    <DataEntryForm onAdd={addRecord} pricing={pricing} />
                  </div>
                  <div className="lg:col-span-2">
                    <DataSummary records={records} onUpdate={updateRecord} onDelete={deleteRecord} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="clients" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {uniqueClients.map(client => {
                    const stats = getClientStats(client);
                    return (
                      <Card key={client} className="border-none shadow-lg hover:shadow-xl transition-all group">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg font-bold text-indigo-900 group-hover:text-indigo-600 transition-colors">
                            {client}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-end mt-4">
                            <div>
                              <p className="text-xs text-gray-400 uppercase font-bold">Total Bid</p>
                              <p className="text-2xl font-black text-indigo-600">${stats.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </div>
                            <Button 
                              onClick={() => setSelectedClient(client)}
                              className="bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl transition-all"
                            >
                              View Quote
                            </Button>
                          </div>
                          <div className="mt-4 pt-4 border-t border-gray-50 text-xs text-gray-400">
                            {stats.count} items in this proposal
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                  {uniqueClients.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-dashed border-indigo-200 text-gray-400">
                      No clients found. Add items to start building a bid.
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="records" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <DataTable records={records} onDelete={deleteRecord} onUpdate={updateRecord} />
              </TabsContent>

              <TabsContent value="supplies" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <SupplyOrderView records={records} />
              </TabsContent>

              <TabsContent value="pricing" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <PricingLock>
                  <PricingSettings pricing={pricing} onUpdate={updatePricing} />
                </PricingLock>
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>

      <MadeWithDyad />
    </div>
  );
};

export default Index;