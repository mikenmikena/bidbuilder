"use client";

import { useState, useEffect } from 'react';

export interface DataRecord {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  status: 'Pending' | 'Completed' | 'Cancelled';
}

export const useDataStore = () => {
  const [records, setRecords] = useState<DataRecord[]>(() => {
    const saved = localStorage.getItem('app_records');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('app_records', JSON.stringify(records));
  }, [records]);

  const addRecord = (record: Omit<DataRecord, 'id'>) => {
    const newRecord = { ...record, id: crypto.randomUUID() };
    setRecords(prev => [newRecord, ...prev]);
  };

  const updateRecord = (id: string, updatedData: Partial<DataRecord>) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, ...updatedData } : r));
  };

  const deleteRecord = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  const importRecords = (newRecords: DataRecord[]) => {
    setRecords(prev => [...newRecords, ...prev]);
  };

  return { records, addRecord, updateRecord, deleteRecord, importRecords };
};