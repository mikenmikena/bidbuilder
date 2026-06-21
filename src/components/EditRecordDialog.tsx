"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BidRecord, useDataStore } from '@/hooks/use-data-store';
import { showSuccess } from '@/utils/toast';
import { Separator } from "@/components/ui/separator";
import { Droplets, ArrowDownCircle, ShieldCheck, Zap, Snowflake, Footprints } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  date: z.string().min(1, "Date is required"),
  client: z.string().min(2, "Client is required"),
  job: z.string().min(2, "Job address is required"),
  linearFeet: z.coerce.number().min(0),
  unitCost: z.coerce.number().min(0),
  status: z.enum(['Draft', 'Submitted', 'Won', 'Lost']),
  area: z.string().optional(),
  gutterColor: z.string().optional(),
  gutterProfile: z.enum(['5K', '6B', '6K', 'None']).default('None'),
  gutterBaseType: z.enum(['Asphalt', 'Metal', 'Membrane']).default('Asphalt'),
  gutterCert: z.enum(['Box Level 1', 'Box Level 2', 'Box Level 3', 'K Level 1', 'K Level 2', 'K Level 3', 'None']).default('None'),
  includeGutterDownspout: z.enum(['Yes', 'No']).default('Yes'),
  demolition: z.enum(['Yes', 'No']).default('No'),
  // Downspout fields
  downspoutColor: z.string().optional(),
  downspoutSize: z.enum(['2x3', '3x4', 'None']).default('None'),
  downspoutLinearFeet: z.coerce.number().min(0).default(0),
  chainLinearFeet: z.coerce.number().min(0).default(0),
  buildingStories: z.coerce.number().min(1).default(1),
  downspoutUnitCost: z.coerce.number().min(0).default(0),
  // Gutter Helmet fields
  helmetColor: z.string().optional(),
  helmetLinearFeet: z.coerce.number().min(0).default(0),
  helmetUnitCost: z.coerce.number().min(0).default(0),
  roofType: z.enum(['Asphalt Shingle', 'Pro Panel', 'Corrugated', 'Raised Seam']).default('Asphalt Shingle'),
  // Heat Cable fields
  valleyCount: z.coerce.number().min(0).default(0),
  daylightLF: z.coerce.number().min(0).default(0),
  cableLayout: z.enum(['Gutter and Downspout', 'Serpentine', '2 cable', '3 cable', 'Serpentine Metal', 'None']).default('None'),
  cableLinearFeet: z.coerce.number().min(0).default(0),
  volt: z.coerce.number().min(0).default(120),
  amperage: z.coerce.number().min(0).default(0),
  retrofit: z.enum(['Yes', 'No']).default('No'),
  level3: z.enum(['Yes', 'No']).default('No'),
  cableUnitCost: z.coerce.number().min(0).default(0),
  // Snow Fence fields
  snowFenceColor: z.string().optional(),
  snowFenceRow1LF: z.coerce.number().min(0).default(0),
  snowFenceRow2LF: z.coerce.number().min(0).default(0),
  snowFenceRow3LF: z.coerce.number().min(0).default(0),
  snowFenceRoofType: z.enum(['Asphalt Shingle', 'Pro Panel', 'Corrugated', 'Raised Seam']).default('Asphalt Shingle'),
  snowFenceLevel: z.enum(['Level 1', 'Level 2', 'Level 3']).default('Level 1'),
  snowFenceUnitCost: z.coerce.number().min(0).default(0),
  // Sasquatch fields
  sasquatchPad: z.coerce.number().min(0).default(0),
  sasquatchMobilizationFee: z.coerce.number().min(0).default(400),
  sasquatchElectrical: z.enum(['Good', 'Better', 'Best', 'None']).default('None'),
  sasquatchFasciaBoard: z.enum(['Standard', 'Hardwood', 'None']).default('None'),
  sasquatchCustomWork: z.coerce.number().min(0).default(0),
  sasquatchArcticSteamerReserve: z.coerce.number().min(0).default(0),
});

interface EditRecordDialogProps {
  record: BidRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, data: z.infer<typeof formSchema>) => void;
}

const GUTTER_COLORS = [
  "TBD", "Black (stock)", "Musket Brown (stock)", "White (30) (stock)", "Bronze (stock)", 
  "Royal Brown (stock)", "Beaver Brown (stock)", "Charcoal Grey (stock)", "Terra Bronze (stock)",
  "Almond", "Brookstone", "Buckskin", "Cameo", "Classic Cream", "Copper Penny", "Country Blue",
  "Desert Sand", "Egg Shell", "Everest", "Evergreen", "Harbour Grey", "Linen", "Montana Suede",
  "Norwegian Wood", "Pebblestone Clay", "Redwood", "Sage", "Sandtone", "Sierra Clay",
  "Silver Grey", "Victorian Grey", "Village Green", "Wicker"
];

const GUTTER_CERTS = [
  "Box Level 1", "Box Level 2", "Box Level 3", "K Level 1", "K Level 2", "K Level 3"
];

const EditRecordDialog = ({ record, isOpen, onClose, onUpdate }: EditRecordDialogProps) => {
  const { pricing } = useDataStore();
  const [downspoutType, setDownspoutType] = useState<'linear' | 'chain' | null>(null);
  
  // Section visibility states
  const [showGutter, setShowGutter] = useState(true);
  const [showDownspout, setShowDownspout] = useState(false);
  const [showHelmet, setShowHelmet] = useState(false);
  const [showCable, setShowCable] = useState(false);
  const [showSnowFence, setShowSnowFence] = useState(false);
  const [showSasquatch, setShowSasquatch] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: record ? {
      date: record.date,
      client: record.client,
      job: record.job || "",
      linearFeet: record.linearFeet,
      unitCost: record.unitCost,
      status: record.status,
      area: record.area || "",
      gutterColor: record.gutterColor || "White (30) (stock)",
      gutterProfile: record.gutterProfile || 'None',
      gutterBaseType: record.gutterBaseType || 'Asphalt',
      gutterCert: record.gutterCert || 'None',
      includeGutterDownspout: record.includeGutterDownspout || 'Yes',
      demolition: record.demolition || 'No',
      downspoutColor: record.downspoutColor || "White (30) (stock)",
      downspoutSize: record.downspoutSize || 'None',
      downspoutLinearFeet: record.downspoutLinearFeet || 0,
      chainLinearFeet: record.chainLinearFeet || 0,
      buildingStories: record.buildingStories || 1,
      downspoutUnitCost: record.downspoutUnitCost || 0,
      helmetColor: record.helmetColor || "White (30) (stock)",
      helmetLinearFeet: record.helmetLinearFeet || 0,
      helmetUnitCost: record.helmetUnitCost || 0,
      roofType: record.roofType || 'Asphalt Shingle',
      valleyCount: record.valleyCount || 0,
      daylightLF: record.daylightLF || 0,
      cableLayout: record.cableLayout || 'None',
      cableLinearFeet: record.cableLinearFeet || 0,
      volt: record.volt || 120,
      amperage: record.amperage || 0,
      retrofit: record.retrofit || 'No',
      level3: record.level3 || 'No',
      cableUnitCost: record.cableUnitCost || 0,
      snowFenceColor: record.snowFenceColor || "White (30) (stock)",
      snowFenceRow1LF: record.snowFenceRow1LF || 0,
      snowFenceRow2LF: record.snowFenceRow2LF || 0,
      snowFenceRow3LF: record.snowFenceRow3LF || 0,
      snowFenceRoofType: record.snowFenceRoofType || 'Asphalt Shingle',
      snowFenceLevel: record.snowFenceLevel || 'Level 1',
      snowFenceUnitCost: record.snowFenceUnitCost || 0,
      sasquatchPad: record.sasquatchPad || 0,
      sasquatchMobilizationFee: record.sasquatchMobilizationFee || 400,
      sasquatchElectrical: record.sasquatchElectrical || 'None',
      sasquatchFasciaBoard: record.sasquatchFasciaBoard || 'None',
      sasquatchCustomWork: record.sasquatchCustomWork || 0,
      sasquatchArcticSteamerReserve: record.sasquatchArcticSteamerReserve || 0,
    } : undefined,
  });

  useEffect(() => {
    if (record) {
      setShowGutter(record.linearFeet > 0);
      setShowDownspout((record.downspoutLinearFeet || 0) > 0 || (record.chainLinearFeet || 0) > 0);
      setShowHelmet((record.helmetLinearFeet || 0) > 0);
      setShowCable((record.cableLinearFeet || 0) > 0);
      setShowSnowFence(((record.snowFenceRow1LF || 0) + (record.snowFenceRow2LF || 0) + (record.snowFenceRow3LF || 0)) > 0);
      setShowSasquatch((record.sasquatchMobilizationFee || 0) > 0 || (record.sasquatchPad || 0) > 0);

      if (record.downspoutLinearFeet && record.downspoutLinearFeet > 0) setDownspoutType('linear');
      else if (record.chainLinearFeet && record.chainLinearFeet > 0) setDownspoutType('chain');
    }
  }, [record]);

  const watchedProfile = form.watch("gutterProfile");
  const watchedBaseType = form.watch("gutterBaseType");
  const watchedInclude = form.watch("includeGutterDownspout");
  const watchedDemolition = form.watch("demolition");
  const watchedStories = form.watch("buildingStories");
  const watchedDownspoutSize = form.watch("downspoutSize");
  const watchedGutterColor = form.watch("gutterColor");
  const watchedDownspoutColor = form.watch("downspoutColor");
  const watchedLinearFeet = form.watch("linearFeet") || 0;
  const watchedDownspoutLF = form.watch("downspoutLinearFeet") || 0;
  const watchedChainLF = form.watch("chainLinearFeet") || 0;

  // Gutter Helmet watched fields
  const watchedHelmetColor = form.watch("helmetColor");
  const watchedHelmetLF = form.watch("helmetLinearFeet") || 0;

  // Snow Fence watched fields
  const watchedSnowFenceColor = form.watch("snowFenceColor");
  const watchedSnowFenceRow1LF = form.watch("snowFenceRow1LF") || 0;
  const watchedSnowFenceRow2LF = form.watch("snowFenceRow2LF") || 0;
  const watchedSnowFenceRow3LF = form.watch("snowFenceRow3LF") || 0;
  const watchedSnowFenceRoofType = form.watch("snowFenceRoofType");
  const watchedSnowFenceLevel = form.watch("snowFenceLevel");

  // Gutter Cost Calculation
  useEffect(() => {
    let baseCost = 0;
    if (watchedInclude === "Yes") {
      if (watchedProfile === "5K") {
        if (watchedBaseType === "Asphalt") baseCost = pricing.gutter5KAsphalt;
        else if (watchedBaseType === "Metal") baseCost = pricing.gutter5KMetal;
        else if (watchedBaseType === "Membrane") baseCost = pricing.gutter5KMembrane;
      } else if (watchedProfile === "6B") {
        if (watchedBaseType === "Asphalt") baseCost = pricing.gutter6BAsphalt;
        else if (watchedBaseType === "Metal") baseCost = pricing.gutter6BMetal;
        else if (watchedBaseType === "Membrane") baseCost = pricing.gutter6BMembrane;
      } else if (watchedProfile === "6K") {
        if (watchedBaseType === "Asphalt") baseCost = pricing.gutter6KAsphalt;
        else if (watchedBaseType === "Metal") baseCost = pricing.gutter6KMetal;
        else if (watchedBaseType === "Membrane") baseCost = pricing.gutter6KMembrane;
      }
    }
    
    // Add flat color surcharge distributed over linear feet
    const isStockColor = watchedGutterColor?.toLowerCase().includes("stock");
    const colorCost = isStockColor ? 0 : (watchedLinearFeet > 0 ? (pricing.gutterNonStockColor / watchedLinearFeet) : 0);
    
    const finalCost = watchedDemolition === "Yes" 
      ? baseCost + pricing.demolition + colorCost 
      : baseCost + colorCost;
      
    form.setValue("unitCost", Number(finalCost.toFixed(2)));
  }, [watchedProfile, watchedBaseType, watchedInclude, watchedDemolition, watchedGutterColor, watchedLinearFeet, pricing, form]);

  // Downspout Cost Calculation
  useEffect(() => {
    let baseCost = 0;
    
    if (downspoutType === 'chain') {
      baseCost = pricing.downspoutChain;
    } else {
      if (watchedDownspoutSize === "3x4") {
        baseCost = pricing.downspout3x4;
      } else if (watchedDownspoutSize === "2x3") {
        baseCost = pricing.downspout2x3;
      }
    }
    
    // Add flat color surcharge distributed over total downspout linear feet
    const totalDownspoutLF = watchedDownspoutLF + watchedChainLF;
    const isStockColor = watchedDownspoutColor?.toLowerCase().includes("stock");
    const colorCost = isStockColor ? 0 : (totalDownspoutLF > 0 ? (pricing.downspoutNonStockColor / totalDownspoutLF) : 0);
    
    const finalCost = baseCost + colorCost;
    form.setValue("downspoutUnitCost", Number(finalCost.toFixed(2)));
  }, [watchedDownspoutSize, downspoutType, watchedDownspoutColor, watchedDownspoutLF, watchedChainLF, pricing, form]);

  // Gutter Helmet Cost Calculation using global pricing
  useEffect(() => {
    const baseCost = pricing.helmet;
    const isStockColor = watchedHelmetColor?.toLowerCase().includes("stock");
    const colorCost = isStockColor ? 0 : (watchedHelmetLF > 0 ? (pricing.helmetNonStockColor / watchedHelmetLF) : 0);
    const finalCost = baseCost + colorCost;
    form.setValue("helmetUnitCost", Number(finalCost.toFixed(2)));
  }, [watchedHelmetColor, watchedHelmetLF, pricing, form]);

  // Snow Fence Cost Calculation based on Roof Type and Level
  useEffect(() => {
    let baseCost = pricing.snowFence; // Default Asphalt Shingle / Base

    if (watchedSnowFenceRoofType === 'Corrugated') {
      if (watchedSnowFenceLevel === 'Level 1') baseCost = pricing.snowFenceCorrugatedL1;
      else if (watchedSnowFenceLevel === 'Level 2') baseCost = pricing.snowFenceCorrugatedL2;
      else if (watchedSnowFenceLevel === 'Level 3') baseCost = pricing.snowFenceCorrugatedL3;
    } else if (watchedSnowFenceRoofType === 'Raised Seam') {
      if (watchedSnowFenceLevel === 'Level 1') baseCost = pricing.snowFenceRaisedSeamL1;
      else if (watchedSnowFenceLevel === 'Level 2') baseCost = pricing.snowFenceRaisedSeamL2;
      else if (watchedSnowFenceLevel === 'Level 3') baseCost = pricing.snowFenceRaisedSeamL3;
    } else if (watchedSnowFenceRoofType === 'Pro Panel') {
      if (watchedSnowFenceLevel === 'Level 1') baseCost = pricing.snowFenceProPanelL1;
      else if (watchedSnowFenceLevel === 'Level 2') baseCost = pricing.snowFenceProPanelL2;
      else if (watchedSnowFenceLevel === 'Level 3') baseCost = pricing.snowFenceProPanelL3;
    }

    // Add flat color surcharge distributed over total snow fence linear feet
    const totalSnowFenceLF = watchedSnowFenceRow1LF + watchedSnowFenceRow2LF + watchedSnowFenceRow3LF;
    const isStockColor = watchedSnowFenceColor?.toLowerCase().includes("stock");
    const colorCost = isStockColor ? 0 : (totalSnowFenceLF > 0 ? (pricing.snowFenceNonStockColor / totalSnowFenceLF) : 0);

    const finalCost = baseCost + colorCost;
    form.setValue("snowFenceUnitCost", Number(finalCost.toFixed(2)));
  }, [watchedSnowFenceRoofType, watchedSnowFenceLevel, watchedSnowFenceColor, watchedSnowFenceRow1LF, watchedSnowFenceRow2LF, watchedSnowFenceRow3LF, pricing, form]);

  useEffect(() => {
    if (downspoutType === 'linear') {
      form.setValue("downspoutLinearFeet", watchedStories * 12);
      form.setValue("chainLinearFeet", 0);
    } else if (downspoutType === 'chain') {
      form.setValue("chainLinearFeet", watchedStories * 12);
      form.setValue("downspoutLinearFeet", 0);
    }
  }, [watchedStories, downspoutType, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (record) {
      const finalValues = { ...values };
      if (!showGutter) finalValues.linearFeet = 0;
      if (!showDownspout) {
        finalValues.downspoutLinearFeet = 0;
        finalValues.chainLinearFeet = 0;
      }
      if (!showHelmet) finalValues.helmetLinearFeet = 0;
      if (!showCable) finalValues.cableLinearFeet = 0;
      if (!showSnowFence) {
        finalValues.snowFenceRow1LF = 0;
        finalValues.snowFenceRow2LF = 0;
        finalValues.snowFenceRow3LF = 0;
      }
      if (!showSasquatch) {
        finalValues.sasquatchMobilizationFee = 0;
        finalValues.sasquatchPad = 0;
        finalValues.sasquatchCustomWork = 0;
        finalValues.sasquatchArcticSteamerReserve = 0;
      }

      onUpdate(record.id, finalValues);
      showSuccess("Bid item updated!");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-indigo-900">Edit Bid Item</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="client"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client</FormLabel>
                    <FormControl>
                      <Input {...field} className="rounded-xl border-indigo-100" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="job"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Address</FormLabel>
                    <FormControl>
                      <Input {...field} className="rounded-xl border-indigo-100" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="rounded-xl border-indigo-100" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl border-indigo-100">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Submitted">Submitted</SelectItem>
                        <SelectItem value="Won">Won</SelectItem>
                        <SelectItem value="Lost">Lost</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Gutter Section */}
            <div className={`space-y-3 bg-amber-100 border border-amber-200 p-4 rounded-2xl transition-all duration-300 ${!showGutter ? 'opacity-60' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-900 font-bold">
                  <Droplets className="w-4 h-4" />
                  <span>Gutter Section</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase text-amber-700">{showGutter ? 'On' : 'Off'}</span>
                  <Switch checked={showGutter} onCheckedChange={setShowGutter} className="data-[state=checked]:bg-amber-600" />
                </div>
              </div>
              
              {showGutter && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Separator className="bg-amber-200" />
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="area"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Area</FormLabel>
                          <FormControl>
                            <Input {...field} className="rounded-xl border-amber-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="includeGutterDownspout"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Include gutter/downspout</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl border-amber-300">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Yes">Yes</SelectItem>
                              <SelectItem value="No">No</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="demolition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Demolition?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl border-amber-300">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Yes">Yes</SelectItem>
                              <SelectItem value="No">No</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="gutterColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Color</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl border-amber-300">
                                <SelectValue placeholder="Select color" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {GUTTER_COLORS.map(color => (
                                <SelectItem key={color} value={color}>{color}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gutterProfile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Profile</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl border-amber-300">
                                <SelectValue placeholder="Select profile" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="None">N/A</SelectItem>
                              <SelectItem value="5K">5K</SelectItem>
                              <SelectItem value="6B">6B</SelectItem>
                              <SelectItem value="6K">6K</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gutterBaseType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Base Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl border-amber-300">
                                <SelectValue placeholder="Select base type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Asphalt">Asphalt Base</SelectItem>
                              <SelectItem value="Metal">Metal Base</SelectItem>
                              <SelectItem value="Membrane">Membrane</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="gutterCert"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cert</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl border-amber-300">
                                <SelectValue placeholder="Select cert" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="None">N/A</SelectItem>
                              {GUTTER_CERTS.map(cert => (
                                <SelectItem key={cert} value={cert}>{cert}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="linearFeet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LF</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} className="rounded-xl border-amber-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="unitCost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cost ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} className="rounded-xl border-amber-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Downspout Section */}
            <div className={`space-y-3 bg-sky-100 border border-sky-200 p-4 rounded-2xl transition-all duration-300 ${!showDownspout ? 'opacity-60' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sky-900 font-bold">
                  <ArrowDownCircle className="w-4 h-4" />
                  <span>Downspout Section</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase text-sky-700">{showDownspout ? 'On' : 'Off'}</span>
                  <Switch checked={showDownspout} onCheckedChange={setShowDownspout} className="data-[state=checked]:bg-sky-600" />
                </div>
              </div>
              
              {showDownspout && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Separator className="bg-sky-200" />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="downspoutColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Color</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl border-sky-300">
                                <SelectValue placeholder="Select color" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {GUTTER_COLORS.map(color => (
                                <SelectItem key={color} value={color}>{color}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="downspoutSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Size</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl border-sky-300">
                                <SelectValue placeholder="Select size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="None">N/A</SelectItem>
                              <SelectItem value="2x3">2x3</SelectItem>
                              <SelectItem value="3x4">3x4</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="downspoutLinearFeet"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-2 mb-2">
                            <Checkbox 
                              id="edit-linear" 
                              checked={downspoutType === 'linear'} 
                              onCheckedChange={(checked) => setDownspoutType(checked ? 'linear' : null)}
                              className="rounded-md border-sky-300 data-[state=checked]:bg-sky-600"
                            />
                            <FormLabel htmlFor="edit-linear" className="mb-0 cursor-pointer">LF</FormLabel>
                          </div>
                          <FormControl>
                            <Input type="number" {...field} className="rounded-xl border-sky-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="chainLinearFeet"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-2 mb-2">
                            <Checkbox 
                              id="edit-chain" 
                              checked={downspoutType === 'chain'} 
                              onCheckedChange={(checked) => setDownspoutType(checked ? 'chain' : null)}
                              className="rounded-md border-sky-300 data-[state=checked]:bg-sky-600"
                            />
                            <FormLabel htmlFor="edit-chain" className="mb-0 cursor-pointer">Chain LF</FormLabel>
                          </div>
                          <FormControl>
                            <Input type="number" {...field} className="rounded-xl border-sky-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="buildingStories"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stories</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} className="rounded-xl border-sky-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="downspoutUnitCost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cost ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} className="rounded-xl border-sky-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Gutter Helmet Section */}
            <div className={`space-y-3 bg-emerald-100 border border-emerald-200 p-4 rounded-2xl transition-all duration-300 ${!showHelmet ? 'opacity-60' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-900 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Gutter Helmet Section</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase text-emerald-700">{showHelmet ? 'On' : 'Off'}</span>
                  <Switch checked={showHelmet} onCheckedChange={setShowHelmet} className="data-[state=checked]:bg-emerald-600" />
                </div>
              </div>
              
              {showHelmet && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Separator className="bg-emerald-200" />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="helmetColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Color</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl border-emerald-300">
                                <SelectValue placeholder="Select color" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {GUTTER_COLORS.map(color => (
                                <SelectItem key={color} value={color}>{color}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="roofType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Roof Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl border-emerald-300">
                                <SelectValue placeholder="Select roof type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Asphalt Shingle">Asphalt Shingle</SelectItem>
                              <SelectItem value="Pro Panel">Pro Panel</SelectItem>
                              <SelectItem value="Corrugated">Corrugated</SelectItem>
                              <SelectItem value="Raised Seam">Raised Seam</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="helmetLinearFeet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LF</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} className="rounded-xl border-emerald-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="helmetUnitCost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cost ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} className="rounded-xl border-emerald-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Heat Cable Section */}
            <div className={`space-y-3 bg-orange-100 border border-orange-200 p-4 rounded-2xl transition-all duration-300 ${!showCable ? 'opacity-60' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-orange-900 font-bold">
                  <Zap className="w-4 h-4" />
                  <span>Heat Cable Section</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase text-orange-700">{showCable ? 'On' : 'Off'}</span>
                  <Switch checked={showCable} onCheckedChange={setShowCable} className="data-[state=checked]:bg-orange-600" />
                </div>
              </div>
              
              {showCable && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Separator className="bg-orange-200" />
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="valleyCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valley Count</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} className="rounded-xl border-orange-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="daylightLF"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LF Daylight</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} className="rounded-xl border-orange-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cableLayout"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Layout</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl border-orange-300">
                                <SelectValue placeholder="Select layout" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="None">None</SelectItem>
                              <SelectItem value="Gutter and Downspout">Gutter and Downspout</SelectItem>
                              <SelectItem value="Serpentine">Serpentine</SelectItem>
                              <SelectItem value="2 cable">2 cable</SelectItem>
                              <SelectItem value="3 cable">3 cable</SelectItem>
                              <SelectItem value="Serpentine Metal">Serpentine Metal</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name="cableLinearFeet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LF</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} className="rounded-xl border-orange-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="volt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Volt</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} className="rounded-xl border-orange-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="amperage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amp</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" {...field} className="rounded-xl border-orange-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="retrofit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Retrofit</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl border-orange-300">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Yes">Yes</SelectItem>
                              <SelectItem value="No">No</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="level3"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Level 3</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl border-orange-300">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Yes">Yes</SelectItem>
                              <SelectItem value="No">No</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cableUnitCost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cost ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} className="rounded-xl border-orange-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Snow Fence Section */}
            <div className={`space-y-3 bg-purple-100 border border-purple-200 p-4 rounded-2xl transition-all duration-300 ${!showSnowFence ? 'opacity-60' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-900 font-bold">
                  <Snowflake className="w-4 h-4" />
                  <span>Snow Fence Section</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase text-purple-700">{showSnowFence ? 'On' : 'Off'}</span>
                  <Switch checked={showSnowFence} onCheckedChange={setShowSnowFence} className="data-[state=checked]:bg-purple-600" />
                </div>
              </div>
              
              {showSnowFence && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Separator className="bg-purple-200" />
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="snowFenceColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Color</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl border-purple-300">
                                <SelectValue placeholder="Select color" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {GUTTER_COLORS.map(color => (
                                <SelectItem key={color} value={color}>{color}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="snowFenceRoofType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Roof Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl border-purple-300">
                                <SelectValue placeholder="Select roof type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Asphalt Shingle">Asphalt Shingle</SelectItem>
                              <SelectItem value="Pro Panel">Pro Panel</SelectItem>
                              <SelectItem value="Corrugated">Corrugated</SelectItem>
                              <SelectItem value="Raised Seam">Raised Seam</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="snowFenceLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl border-purple-300">
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Level 1">Level 1</SelectItem>
                              <SelectItem value="Level 2">Level 2</SelectItem>
                              <SelectItem value="Level 3">Level 3</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="snowFenceRow1LF"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Row 1 LF</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} className="rounded-xl border-purple-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="snowFenceRow2LF"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Row 2 LF</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} className="rounded-xl border-purple-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="snowFenceRow3LF"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Row 3 LF</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} className="rounded-xl border-purple-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="snowFenceUnitCost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cost ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} className="rounded-xl border-purple-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Sasquatch Section */}
            <div className={`space-y-3 bg-slate-100 border border-slate-200 p-4 rounded-2xl transition-all duration-300 ${!showSasquatch ? 'opacity-60' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <Footprints className="w-4 h-4" />
                  <span>Sasquatch Section</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase text-slate-700">{showSasquatch ? 'On' : 'Off'}</span>
                  <Switch checked={showSasquatch} onCheckedChange={setShowSasquatch} className="data-[state=checked]:bg-slate-600" />
                </div>
              </div>
              
              {showSasquatch && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Separator className="bg-slate-200" />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="sasquatchPad"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pad ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} className="rounded-xl border-slate-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sasquatchMobilizationFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobilization Fee ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="100" {...field} className="rounded-xl border-slate-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="sasquatchElectrical"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Electrical</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl border-slate-300">
                                <SelectValue placeholder="Select electrical" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="None">N/A</SelectItem>
                              <SelectItem value="Good">Good</SelectItem>
                              <SelectItem value="Better">Better</SelectItem>
                              <SelectItem value="Best">Best</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sasquatchFasciaBoard"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fascia/Shadow Board</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl border-slate-300">
                                <SelectValue placeholder="Select board" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="None">N/A</SelectItem>
                              <SelectItem value="Standard">Standard</SelectItem>
                              <SelectItem value="Hardwood">Hardwood</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="sasquatchCustomWork"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Custom Work ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} className="rounded-xl border-slate-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sasquatchArcticSteamerReserve"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Arctic Steamer Reserve ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} className="rounded-xl border-slate-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl border-indigo-100">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Submitted">Submitted</SelectItem>
                        <SelectItem value="Won">Won</SelectItem>
                        <SelectItem value="Lost">Lost</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">Cancel</Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditRecordDialog;