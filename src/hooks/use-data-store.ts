"use client";

import { useState, useEffect } from 'react';

export interface PricingSettings {
  gutter5K: number;
  gutter6B: number;
  gutter6K: number;
  demolition: number;
  downspout2x3: number;
  downspout3x4: number;
  helmet: number;
  cable: number;
  snowFence: number;
  sasquatchMobilization: number;
}

const DEFAULT_PRICING: PricingSettings = {
  gutter5K: 23.83,
  gutter6B: 34.44,
  gutter6K: 34.44,
  demolition: 5.28,
  downspout2x3: 12.00,
  downspout3x4: 15.00,
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
    if (saved) {
      const parsed = JSON.parse(saved);
      // Handle migration from old pricing structure if needed
      return {
        gutter5K: parsed.gutter5K ?? DEFAULT_PRICING.gutter5K,
        gutter6B: parsed.gutter6B ?? parsed.gutter6B6K ?? DEFAULT_PRICING.gutter6B,
        gutter6K: parsed.gutter6K ?? parsed.gutter6B6K ?? DEFAULT_PRICING.gutter6K,
        demolition: parsed.demolition ?? DEFAULT_PRICING.demolition,
        downspout2x3: parsed.downspout2x3 ?? parsed.downspout ?? DEFAULT_PRICING.downspout2x3,
        downspout3x4: parsed.downspout3x4 ?? parsed.downspout ?? DEFAULT_PRICING.downspout3x4,
        helmet: parsed.helmet ?? DEFAULT_PRICING.helmet,
        cable: parsed.cable ?? DEFAULT_PRICING.cable,
        snowFence: parsed.snowFence ?? DEFAULT_PRICING.snowFence,
        sasquatchMobilization: parsed.sasquatchMobilization ?? DEFAULT_PRICING.sasquatchMobilization,
      };
    }
    return DEFAULT_PRICING;
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