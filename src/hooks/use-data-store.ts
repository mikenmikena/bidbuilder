"use client";

import { useState, useEffect } from 'react';

export interface PricingSettings {
  gutter5KAsphalt: number;
  gutter5KMetal: number;
  gutter5KMembrane: number;
  gutter6BAsphalt: number;
  gutter6BMetal: number;
  gutter6BMembrane: number;
  gutter6KAsphalt: number;
  gutter6KMetal: number;
  gutter6KMembrane: number;
  demolition: number;
  downspout2x3: number;
  downspout3x4: number;
  downspoutChain: number;
  gutterNonStockColor: number;
  downspoutNonStockColor: number;
  helmet: number;
  helmetNonStockColor: number;
  cable: number;
  cableSerpentine: number;
  cable1Cable: number;
  cable2Cable: number;
  cable3Cable: number;
  cable120V: number;
  cable240V: number;
  cableRetrofit: number;
  cableWifi: number;
  cableSwitch: number;
  cableBreaker: number;
  cableElectrician: number;
  snowFence: number; // Asphalt Shingle / Base
  snowFenceNonStockColor: number;
  snowFenceCorrugatedL1: number;
  snowFenceCorrugatedL2: number;
  snowFenceCorrugatedL3: number;
  snowFenceRaisedSeamL1: number;
  snowFenceRaisedSeamL2: number;
  snowFenceRaisedSeamL3: number;
  snowFenceProPanelL1: number;
  snowFenceProPanelL2: number;
  snowFenceProPanelL3: number;
  sasquatchMobilization: number;
}

const DEFAULT_PRICING: PricingSettings = {
  gutter5KAsphalt: 23.83,
  gutter5KMetal: 28.50,
  gutter5KMembrane: 32.00,
  gutter6BAsphalt: 34.44,
  gutter6BMetal: 39.50,
  gutter6BMembrane: 44.00,
  gutter6KAsphalt: 34.44,
  gutter6KMetal: 39.50,
  gutter6KMembrane: 44.00,
  demolition: 5.28,
  downspout2x3: 12.00,
  downspout3x4: 15.00,
  downspoutChain: 25.00,
  gutterNonStockColor: 150.00,
  downspoutNonStockColor: 75.00,
  helmet: 15.00,
  helmetNonStockColor: 100.00,
  cable: 18.00,
  cableSerpentine: 22.00,
  cable1Cable: 18.00,
  cable2Cable: 28.00,
  cable3Cable: 38.00,
  cable120V: 150.00,
  cable240V: 250.00,
  cableRetrofit: 5.00,
  cableWifi: 120.00,
  cableSwitch: 80.00,
  cableBreaker: 95.00,
  cableElectrician: 150.00,
  snowFence: 25.00,
  snowFenceNonStockColor: 100.00,
  snowFenceCorrugatedL1: 30.00,
  snowFenceCorrugatedL2: 40.00,
  snowFenceCorrugatedL3: 50.00,
  snowFenceRaisedSeamL1: 35.00,
  snowFenceRaisedSeamL2: 45.00,
  snowFenceRaisedSeamL3: 55.00,
  snowFenceProPanelL1: 32.00,
  snowFenceProPanelL2: 42.00,
  snowFenceProPanelL3: 52.00,
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
  gutterBaseType?: 'Asphalt' | 'Metal' | 'Membrane';
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
  cableWifi?: 'Yes' | 'No';
  cableSwitch?: 'Yes' | 'No';
  cableBreaker?: 'Yes' | 'No';
  cableElectrician?: 'Yes' | 'No';
  snowFenceColor?: string;
  snowFenceRow1LF?: number;
  snowFenceRow2LF?: number;
  snowFenceRow3LF?: number;
  snowFenceRoofType?: 'Asphalt Shingle' | 'Pro Panel' | 'Corrugated' | 'Raised Seam';
  snowFenceLevel?: 'Level 1' | 'Level 2' | 'Level 3';
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
      return {
        gutter5KAsphalt: parsed.gutter5KAsphalt ?? DEFAULT_PRICING.gutter5KAsphalt,
        gutter5KMetal: parsed.gutter5KMetal ?? DEFAULT_PRICING.gutter5KMetal,
        gutter5KMembrane: parsed.gutter5KMembrane ?? DEFAULT_PRICING.gutter5KMembrane,
        gutter6BAsphalt: parsed.gutter6BAsphalt ?? DEFAULT_PRICING.gutter6BAsphalt,
        gutter6BMetal: parsed.gutter6BMetal ?? DEFAULT_PRICING.gutter6BMetal,
        gutter6BMembrane: parsed.gutter6BMembrane ?? DEFAULT_PRICING.gutter6BMembrane,
        gutter6KAsphalt: parsed.gutter6KAsphalt ?? DEFAULT_PRICING.gutter6KAsphalt,
        gutter6KMetal: parsed.gutter6KMetal ?? DEFAULT_PRICING.gutter6KMetal,
        gutter6KMembrane: parsed.gutter6KMembrane ?? DEFAULT_PRICING.gutter6KMembrane,
        demolition: parsed.demolition ?? DEFAULT_PRICING.demolition,
        downspout2x3: parsed.downspout2x3 ?? DEFAULT_PRICING.downspout2x3,
        downspout3x4: parsed.downspout3x4 ?? DEFAULT_PRICING.downspout3x4,
        downspoutChain: parsed.downspoutChain ?? DEFAULT_PRICING.downspoutChain,
        gutterNonStockColor: parsed.gutterNonStockColor ?? DEFAULT_PRICING.gutterNonStockColor,
        downspoutNonStockColor: parsed.downspoutNonStockColor ?? DEFAULT_PRICING.downspoutNonStockColor,
        helmet: parsed.helmet ?? DEFAULT_PRICING.helmet,
        helmetNonStockColor: parsed.helmetNonStockColor ?? DEFAULT_PRICING.helmetNonStockColor,
        cable: parsed.cable ?? DEFAULT_PRICING.cable,
        cableSerpentine: parsed.cableSerpentine ?? DEFAULT_PRICING.cableSerpentine,
        cable1Cable: parsed.cable1Cable ?? DEFAULT_PRICING.cable1Cable,
        cable2Cable: parsed.cable2Cable ?? DEFAULT_PRICING.cable2Cable,
        cable3Cable: parsed.cable3Cable ?? DEFAULT_PRICING.cable3Cable,
        cable120V: parsed.cable120V ?? DEFAULT_PRICING.cable120V,
        cable240V: parsed.cable240V ?? DEFAULT_PRICING.cable240V,
        cableRetrofit: parsed.cableRetrofit ?? DEFAULT_PRICING.cableRetrofit,
        cableWifi: parsed.cableWifi ?? DEFAULT_PRICING.cableWifi,
        cableSwitch: parsed.cableSwitch ?? DEFAULT_PRICING.cableSwitch,
        cableBreaker: parsed.cableBreaker ?? DEFAULT_PRICING.cableBreaker,
        cableElectrician: parsed.cableElectrician ?? DEFAULT_PRICING.cableElectrician,
        snowFence: parsed.snowFence ?? DEFAULT_PRICING.snowFence,
        snowFenceNonStockColor: parsed.snowFenceNonStockColor ?? DEFAULT_PRICING.snowFenceNonStockColor,
        snowFenceCorrugatedL1: parsed.snowFenceCorrugatedL1 ?? DEFAULT_PRICING.snowFenceCorrugatedL1,
        snowFenceCorrugatedL2: parsed.snowFenceCorrugatedL2 ?? DEFAULT_PRICING.snowFenceCorrugatedL2,
        snowFenceCorrugatedL3: parsed.snowFenceCorrugatedL3 ?? DEFAULT_PRICING.snowFenceCorrugatedL3,
        snowFenceRaisedSeamL1: parsed.snowFenceRaisedSeamL1 ?? DEFAULT_PRICING.snowFenceRaisedSeamL1,
        snowFenceRaisedSeamL2: parsed.snowFenceRaisedSeamL2 ?? DEFAULT_PRICING.snowFenceRaisedSeamL2,
        snowFenceRaisedSeamL3: parsed.snowFenceRaisedSeamL3 ?? DEFAULT_PRICING.snowFenceRaisedSeamL3,
        snowFenceProPanelL1: parsed.snowFenceProPanelL1 ?? DEFAULT_PRICING.snowFenceProPanelL1,
        snowFenceProPanelL2: parsed.snowFenceProPanelL2 ?? DEFAULT_PRICING.snowFenceProPanelL2,
        snowFenceProPanelL3: parsed.snowFenceProPanelL3 ?? DEFAULT_PRICING.snowFenceProPanelL3,
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