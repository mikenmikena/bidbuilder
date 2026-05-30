"use client";

import { useState, useEffect } from 'react';

export interface BidRecord {
  id: string;
  date: string;
  client: string;
  job: string;
  linearFeet: number;
  unitCost: number;
  markup: number; // Percentage
  status: 'Draft' | 'Submitted' | 'Won' | 'Lost';
  area?: string;
  gutterColor?: string;
  gutterProfile?: '5K' | '6B' | '6K' | 'None';
  gutterCert?: 'Box Level 1' | 'Box Level 2' | 'Box Level 3' | 'K Level 1' | 'K Level 2' | 'K Level 3' | 'None';
  includeGutterDownspout?: 'Yes' | 'No';
  demolition?: 'Yes' | 'No';
  // Downspout Fields
  downspoutArea?: string;
  downspoutColor?: string;
  downspoutSize?: '2x3' | '3x4' | 'None';
  downspoutLinearFeet?: number;
  chainLinearFeet?: number;
  buildingStories?: number;
  downspoutUnitCost?: number;
  downspoutMarkup?: number;
}

export const useDataStore = () => {
  const [records, setRecords] = useState<BidRecord[]>(() => {
    const saved = localStorage.getItem('bid_records');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('bid_records', JSON.stringify(records));
  }, [records]);

  const addRecord = (record: Omit<BidRecord, 'id'>) => {
    const newRecord = { ...record, id: crypto.randomUUID() };
    setRecords(prev => [newRecord, ...prev]);
  };

  const updateRecord = (id: string, updatedData: Partial<BidRecord>) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, ...updatedData } : r));
  };

  const deleteRecord = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  const importRecords = (newRecords: BidRecord[]) => {
    setRecords(prev => [...newRecords, ...prev]);
  };

  return { records, addRecord, updateRecord, deleteRecord, importRecords };
};