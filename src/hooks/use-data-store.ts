"use client";

import { useState, useEffect } from 'react';

export interface PricingSettings {
  gutter5K: number;
  gutter6B6K: number;
  demolition: number;
  downspout: number;
  helmet: number;
  cable: number;
  snowFence: number;
  sasquatchMobilization: number;
}

const DEFAULT_PRICING: PricingSettings = {
  gutter5K: 23.83,
  gutter6B6K: 34.44,
  demolition: 5.28,
  downspout: 12.00,
  helmet: 15.00,
  cable: 18.00,
  snowFence: 25.00,
  sasquatchMobilization: 400.00,
};

export interface BidRecord {
  id: string;
  date: string;
  client: string;
  job: string;
  linearFeet: number;
  unitCost: number;
  status: 'Draft' | 'Submitted' | 'Won' | 'Lost';
  area?: string;
  gutterColor?: string;
  gutterProfile?: '5K' | '6B' | '6K' | 'None';
  gutterCert?: 'Box Level 1' | 'Box Level 2' | 'Box Level 3' | 'K Level 1' | 'K Level 2' | 'K Level 3' | 'None';
  includeGutterDownspout?: 'Yes' | 'No';
  demolition?: 'Yes' | 'No';
  downspoutColor?: string;
  downspoutSize?: '2x3' | '3x4' | 'None';
  downspoutLinearFeet?: number;
  chainLinearFeet?: number;
  buildingStories?: number;
  downspoutUnitCost?: number;
  helmetColor?: string;
  helmetLinearFeet?: number;
  helmetUnitCost?: number;
  roofType?: 'Asphalt Shingle' | 'Pro Panel' | 'Corrugated' | 'Raised Seam';
  valleyCount?: number;
  daylightLF?: number;
  cableLayout?: 'Gutter and Downspout' | 'Serpentine' | '2 cable' | '3 cable' | 'Serpentine Metal' | 'None';
  cableLinearFeet?: number;
  volt?: number;
  amperage?: number;
  retrofit?: 'Yes' | 'No';
  level3?: 'Yes' | 'No';
  cableUnitCost?: number;
  snowFenceColor?: string;
  snowFenceRow1LF?: number;
  snowFenceRow2LF?: number;
  snowFenceRow3LF?: number;
  snowFenceRoofType?: 'Asphalt Shingle' | 'Pro Panel' | 'Corrugated' | 'Raised Seam';
  snowFenceUnitCost?: number;
  sasquatchPad?: number;
  sasquatchMobilizationFee?: number;
  sasquatchElectrical?: 'Good' | 'Better' | 'Best' | 'None';
  sasquatchFasciaBoard?: 'Standard' | 'Hardwood' | 'None';
  sasquatchCustomWork?: number;
  sasquatchArcticSteamerReserve?: number;
}

export const useDataStore = () => {
  const [records, setRecords] = useState<BidRecord[]>(() => {
    const saved = localStorage.getItem('bid_records');
    return saved ? JSON.parse(saved) : [];
  });

  const [pricing, setPricing] = useState<PricingSettings>(() => {
    const saved = localStorage.getItem('bid_pricing');
    return saved ? JSON.parse(saved) : DEFAULT_PRICING;
  });

  useEffect(() => {
    localStorage.setItem('bid_records', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem('bid_pricing', JSON.stringify(pricing));
  }, [pricing]);

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

  const updatePricing = (newPricing: PricingSettings) => {
    setPricing(newPricing);
  };

  return { 
    records, 
    pricing,
    addRecord, 
    updateRecord, 
    deleteRecord, 
    importRecords,
    updatePricing 
  };
};