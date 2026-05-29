"use client";

import React from 'react';
import { useDataStore } from '@/hooks/use-data-store';
import DataEntryForm from '@/components/DataEntryForm';
import DataSummary from '@/components/DataSummary';
import DataTable from '@/components/DataTable';
import ExcelImport from '@/components/ExcelImport';
import ExcelExport from '@/components/ExcelExport';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { LayoutDashboard, Database, FileSpreadsheet } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const { records, addRecord, updateRecord, deleteRecord, importRecords } = useDataStore();

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12">
      {/* Header */}
      <header className="bg-white border-b border-indigo-50 sticky top-0 z-10 backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <Database className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              DataFlow Pro
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <ExcelExport records={records} />
            <ExcelImport onImport={importRecords} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard</h2>
          <p className="text-gray-500 mt-1">Manage your records and visualize your data in real-time.</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-white p-1 rounded-2xl border border-indigo-50 shadow-sm inline-flex">
            <TabsTrigger value="overview" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="records" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all">
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Records
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <DataEntryForm onAdd={addRecord} />
              </div>
              <div className="lg:col-span-2">
                <DataSummary records={records} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="records" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <DataTable records={records} onDelete={deleteRecord} onUpdate={updateRecord} />
          </TabsContent>
        </Tabs>
      </main>

      <MadeWithDyad />
    </div>
  );
};

export default Index;