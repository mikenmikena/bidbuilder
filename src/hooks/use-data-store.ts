"use client";

import { useState, useEffect } from 'react';

export interface BidRecord {
  id: string;
  date: string;
  projectName: string;
  client: string;
  item: string;
  quantity: number;
  unitCost: number;
  markup: number; // Percentage
  status: 'Draft' | 'Submitted' | 'Won' | 'Lost';
  gutterColor?: string;
  gutterProfile?: '5K' | '6B' | '6K' | 'None';
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