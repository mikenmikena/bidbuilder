"use client";

import { useState, useEffect } from 'react';

export interface PricingSettings {
  gutter5KStraight: number;
  gutter5KCorner: number;
  gutter5KRake: number;
  gutter6BStraight: number;
  gutter6BCorner: number;
  gutter6BRake: number;
  gutter6KStraight: number;
  gutter6KCorner: number;
  gutter6KRake: number;
  demolition: number;
  gutterHardwoodFascia: number;
  gutterBasicFascia: number;
  downspout2x3: number;
  downspout3x4: number;
  downspoutChain: number;
  gutterNonStockColor: number;
  downspoutNonStockColor: number;
  helmetAsphaltShingle: number;
  helmetMetal: number;
  helmetMembrane: number;
  helmetNonStockColor: number;
  cable: number;
  cableSerpentine: number;
  cable1Cable: number;
  cable2Cable: number;
  cable3Cable: number;
  cable120V: number;
  cable240V: number;
  cableFirstCircuit: number;
  cableAdditionalCircuit: number;
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
  sasquatchMobilizationHigh: number;
  sasquatchMobilizationLow: number;
  sasquatchPadPrice: number;
}

const DEFAULT_PRICING: PricingSettings = {
  gutter5KStraight: 23.83,
  gutter5KCorner: 28.50,
  gutter5KRake: 32.00,
  gutter6BStraight: 34.44,
  gutter6BCorner: 39.50,
  gutter6BRake: 44.00,
  gutter6KStraight: 34.44,
  gutter6KCorner: 39.50,
  gutter6KRake: 44.00,
  demolition: 5.28,
  gutterHardwoodFascia: 15.00,
  gutterBasicFascia: 8.00,
  downspout2x3: 12.00,
  downspout3x4: 15.00,
  downspoutChain: 25.00,
  gutterNonStockColor: 150.00,
  downspoutNonStockColor: 75.00,
  helmetAsphaltShingle: 15.00,
  helmetMetal: 20.00,
  helmetMembrane: 22.00,
  helmetNonStockColor: 100.00,
  cable: 18.00,
  cableSerpentine: 22.00,
  cable1Cable: 18.00,
  cable2Cable: 28.00,
  cable3Cable: 38.00,
  cable120V: 150.00,
  cable240V: 250.00,
  cableFirstCircuit: 500.00,
  cableAdditionalCircuit: 300.00,
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
  sasquatchMobilizationHigh: 900.00,
  sasquatchMobilizationLow: 400.00,
  sasquatchPadPrice: 125.00,
};

export interface BidRecord {
  id: string;
  date: string;
  client: string;
  job: string;
  linearFeet: number; // Gutter Linear Feet
  unitCost: number; // Gutter Unit Cost
  status: 'Draft' | 'Submitted' | 'Won' | 'Lost';
  area?: string;
  gutterColor?: string;
  gutterProfile?: '5K' | '6B' | '6K' | 'None';
  gutterBaseType?: 'Straight' | 'Corner' | 'Rake';
  gutterCert?: 'Box Level 1' | 'Box Level 2' | 'Box Level 3' | 'K Level 1' | 'K Level 2' | 'K Level 3' | 'None';
  includeGutterDownspout?: 'Yes' | 'No';
  demolition?: 'Yes' | 'No';
  demolitionLinearFeet?: number;
  demolitionUnitCost?: number;
  fascia?: 'None' | 'Hardwood' | 'Standard';
  fasciaLinearFeet?: number;
  fasciaUnitCost?: number;
  downspoutColor?: string;
  downspoutSize?: '2x3' | '3x4' | 'None';
  downspoutCount?: number;
  downspoutLinearFeet?: number;
  chainLinearFeet?: number;
  buildingStories?: number;
  downspoutUnitCost?: number;
  helmetColor?: string;
  helmetLinearFeet?: number;
  helmetUnitCost?: number;
  roofType?: 'Asphalt Shingle' | 'Pro Panel' | 'Corrugated' | 'Raised Seam' | 'Membrane';
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
        gutter5KStraight: parsed.gutter5KStraight ?? parsed.gutter5KAsphalt ?? DEFAULT_PRICING.gutter5KStraight,
        gutter5KCorner: parsed.gutter5KCorner ?? parsed.gutter5KMetal ?? DEFAULT_PRICING.gutter5KCorner,
        gutter5KRake: parsed.gutter5KRake ?? parsed.gutter5KMembrane ?? DEFAULT_PRICING.gutter5KRake,
        gutter6BStraight: parsed.gutter6BStraight ?? parsed.gutter6BAsphalt ?? DEFAULT_PRICING.gutter6BStraight,
        gutter6BCorner: parsed.gutter6BCorner ?? parsed.gutter6BMetal ?? DEFAULT_PRICING.gutter6BCorner,
        gutter6BRake: parsed.gutter6BRake ?? parsed.gutter6BMembrane ?? DEFAULT_PRICING.gutter6BRake,
        gutter6KStraight: parsed.gutter6KStraight ?? parsed.gutter6KAsphalt ?? DEFAULT_PRICING.gutter6KStraight,
        gutter6KCorner: parsed.gutter6KCorner ?? parsed.gutter6KMetal ?? DEFAULT_PRICING.gutter6KCorner,
        gutter6KRake: parsed.gutter6KRake ?? parsed.gutter6KMembrane ?? DEFAULT_PRICING.gutter6KRake,
        demolition: parsed.demolition ?? DEFAULT_PRICING.demolition,
        gutterHardwoodFascia: parsed.gutterHardwoodFascia ?? DEFAULT_PRICING.gutterHardwoodFascia,
        gutterBasicFascia: parsed.gutterBasicFascia ?? DEFAULT_PRICING.gutterBasicFascia,
        downspout2x3: parsed.downspout2x3 ?? DEFAULT_PRICING.downspout2x3,
        downspout3x4: parsed.downspout3x4 ?? DEFAULT_PRICING.downspout3x4,
        downspoutChain: parsed.downspoutChain ?? DEFAULT_PRICING.downspoutChain,
        gutterNonStockColor: parsed.gutterNonStockColor ?? DEFAULT_PRICING.gutterNonStockColor,
        downspoutNonStockColor: parsed.downspoutNonStockColor ?? DEFAULT_PRICING.downspoutNonStockColor,
        helmetAsphaltShingle: parsed.helmetAsphaltShingle ?? parsed.helmet ?? DEFAULT_PRICING.helmetAsphaltShingle,
        helmetMetal: parsed.helmetMetal ?? parsed.helmet ?? DEFAULT_PRICING.helmetMetal,
        helmetMembrane: parsed.helmetMembrane ?? parsed.helmet ?? DEFAULT_PRICING.helmetMembrane,
        helmetNonStockColor: parsed.helmetNonStockColor ?? DEFAULT_PRICING.helmetNonStockColor,
        cable: parsed.cable ?? DEFAULT_PRICING.cable,
        cableSerpentine: parsed.cableSerpentine ?? DEFAULT_PRICING.cableSerpentine,
        cable1Cable: parsed.cable1Cable ?? DEFAULT_PRICING.cable1Cable,
        cable2Cable: parsed.cable2Cable ?? DEFAULT_PRICING.cable2Cable,
        cable3Cable: parsed.cable3Cable ?? DEFAULT_PRICING.cable3Cable,
        cable120V: parsed.cable120V ?? DEFAULT_PRICING.cable120V,
        cable240V: parsed.cable240V ?? DEFAULT_PRICING.cable240V,
        cableFirstCircuit: parsed.cableFirstCircuit ?? DEFAULT_PRICING.cableFirstCircuit,
        cableAdditionalCircuit: parsed.cableAdditionalCircuit ?? DEFAULT_PRICING.cableAdditionalCircuit,
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
        sasquatchMobilizationHigh: parsed.sasquatchMobilizationHigh ?? DEFAULT_PRICING.sasquatchMobilizationHigh,
        sasquatchMobilizationLow: parsed.sasquatchMobilizationLow ?? DEFAULT_PRICING.sasquatchMobilizationLow,
        sasquatchPadPrice: parsed.sasquatchPadPrice ?? DEFAULT_PRICING.sasquatchPadPrice,
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

  // Helper to calculate base pipeline for a client (excluding mobilization fees)
  const getClientBasePipeline = (clientName: string, allRecords: BidRecord[]) => {
    return allRecords
      .filter(r => r.client === clientName)
      .reduce((sum, r) => {
        const gutter = r.linearFeet * r.unitCost;
        const demo = (r.demolitionLinearFeet || 0) * (r.demolitionUnitCost || 0);
        const fascia = (r.fasciaLinearFeet || 0) * (r.fasciaUnitCost || 0);
        const downspout = ((r.downspoutLinearFeet || 0) + (r.chainLinearFeet || 0)) * (r.downspoutUnitCost || 0);
        const helmet = (r.helmetLinearFeet || 0) * (r.helmetUnitCost || 0);
        const cable = (r.cableLinearFeet || 0) * (r.cableUnitCost || 0);
        const snowFence = ((r.snowFenceRow1LF || 0) + (r.snowFenceRow2LF || 0) + (r.snowFenceRow3LF || 0)) * (r.snowFenceUnitCost || 0);
        const sasquatchOthers = (r.sasquatchPad || 0) + (r.sasquatchCustomWork || 0) + (r.sasquatchArcticSteamerReserve || 0);
        return sum + gutter + demo + fascia + downspout + helmet + cable + snowFence + sasquatchOthers;
      }, 0);
  };

  // Dynamically compute mobilization fees for all records
  const computedRecords = records.map((record, index, self) => {
    // Map old gutterBaseType values if they exist
    let mappedBaseType = record.gutterBaseType;
    if (record.gutterBaseType === 'Asphalt') mappedBaseType = 'Straight';
    else if (record.gutterBaseType === 'Metal') mappedBaseType = 'Corner';
    else if (record.gutterBaseType === 'Membrane') mappedBaseType = 'Rake';

    const updatedRecord = {
      ...record,
      gutterBaseType: mappedBaseType
    };

    if (updatedRecord.sasquatchMobilizationFee !== undefined && updatedRecord.sasquatchMobilizationFee > 0) {
      const basePipeline = getClientBasePipeline(updatedRecord.client, self);
      
      // Check if the first record for this client with Sasquatch enabled is this one
      const firstSasquatchRecord = self.find(r => r.client === updatedRecord.client && r.sasquatchMobilizationFee !== undefined && r.sasquatchMobilizationFee > 0);
      
      if (firstSasquatchRecord && firstSasquatchRecord.id === updatedRecord.id) {
        // If base pipeline + low mobilization >= 15000, use low mobilization, else high mobilization
        const isHighValue = (basePipeline + pricing.sasquatchMobilizationLow) >= 15000;
        const calculatedFee = isHighValue ? pricing.sasquatchMobilizationLow : pricing.sasquatchMobilizationHigh;
        return {
          ...updatedRecord,
          sasquatchMobilizationFee: calculatedFee
        };
      } else {
        // Only apply mobilization fee once per client
        return {
          ...updatedRecord,
          sasquatchMobilizationFee: 0
        };
      }
    }
    return updatedRecord;
  });

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
    records: computedRecords, 
    pricing,
    addRecord, 
    updateRecord, 
    deleteRecord, 
    importRecords,
    updatePricing 
  };
};