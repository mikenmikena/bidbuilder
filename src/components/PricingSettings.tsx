"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PricingSettings as PricingType } from '@/hooks/use-data-store';
import { Settings2, Save, RefreshCcw, Droplets, ArrowDownCircle, ShieldCheck, Zap, Snowflake, Footprints } from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { Separator } from "@/components/ui/separator";

const pricingSchema = z.object({
  gutter5K: z.coerce.number().min(0),
  gutter6B: z.coerce.number().min(0),
  gutter6K: z.coerce.number().min(0),
  demolition: z.coerce.number().min(0),
  downspout2x3: z.coerce.number().min(0),
  downspout3x4: z.coerce.number().min(0),
  downspoutChain: z.coerce.number().min(0),
  gutterNonStockColor: z.coerce.number().min(0),
  downspoutNonStockColor: z.coerce.number().min(0),
  helmet: z.coerce.number().min(0),
  cable: z.coerce.number().min(0),
  cableSerpentine: z.coerce.number().min(0),
  cable1Cable: z.coerce.number().min(0),
  cable2Cable: z.coerce.number().min(0),
  cable3Cable: z.coerce.number().min(0),
  cable120V: z.coerce.number().min(0),
  cable240V: z.coerce.number().min(0),
  cableRetrofit: z.coerce.number().min(0),
  cableWifi: z.coerce.number().min(0),
  cableSwitch: z.coerce.number().min(0),
  cableBreaker: z.coerce.number().min(0),
  cableElectrician: z.coerce.number().min(0),
  snowFence: z.coerce.number().min(0),
  sasquatchMobilization: z.coerce.number().min(0),
});

interface PricingSettingsProps {
  pricing: PricingType;
  onUpdate: (pricing: PricingType) => void;
}

const PricingSettings = ({ pricing, onUpdate }: PricingSettingsProps) => {
  const form = useForm<PricingType>({
    resolver: zodResolver(pricingSchema),
    defaultValues: pricing,
  });

  const onSubmit = (values: PricingType) => {
    onUpdate(values);
    showSuccess("Pricing settings updated successfully!");
  };

  const resetToDefaults = () => {
    const defaults = {
      gutter5K: 23.83,
      gutter6B: 34.44,
      gutter6K: 34.44,
      demolition: 5.28,
      downspout2x3: 12.00,
      downspout3x4: 15.00,
      downspoutChain: 25.00,
      gutterNonStockColor: 150.00,
      downspoutNonStockColor: 75.00,
      helmet: 15.00,
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
      sasquatchMobilization: 400.00,
    };
    form.reset(defaults);
    onUpdate(defaults);
    showSuccess("Pricing reset to defaults.");
  };

  return (
    <Card className="border-none shadow-lg bg-white">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold text-indigo-900 flex items-center gap-2">
              <Settings2 className="w-5 h-5" />
              Pricing Administration
            </CardTitle>
            <CardDescription>Set global unit costs used for automatic bid calculations.</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={resetToDefaults} className="rounded-xl border-indigo-100 text-indigo-600">
            <RefreshCcw className="w-4 h-4 mr-2" />
            Reset Defaults
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Gutter Section (Amber) */}
            <div className="space-y-4 bg-amber-50/50 border border-amber-200 p-6 rounded-2xl">
              <div className="flex items-center gap-2 text-amber-900 font-bold">
                <Droplets className="w-5 h-5 text-amber-600" />
                <span>Gutter Pricing</span>
              </div>
              <Separator className="bg-amber-200" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="gutter5K"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-amber-900">Gutter 5K Base ($/LF)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} className="rounded-xl border-amber-200 bg-white focus-visible:ring-amber-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gutter6B"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-amber-900">Gutter 6B Base ($/LF)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} className="rounded-xl border-amber-200 bg-white focus-visible:ring-amber-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gutter6K"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-amber-900">Gutter 6K Base ($/LF)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} className="rounded-xl border-amber-200 bg-white focus-visible:ring-amber-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="demolition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-amber-900">Demolition Add-on ($/LF)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} className="rounded-xl border-amber-200 bg-white focus-visible:ring-amber-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gutterNonStockColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-amber-900">Non-Stock Gutter Color Surcharge ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} className="rounded-xl border-amber-200 bg-white focus-visible:ring-amber-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Downspout Section (Sky) */}
            <div className="space-y-4 bg-sky-50/50 border border-sky-200 p-6 rounded-2xl">
              <div className="flex items-center gap-2 text-sky-900 font-bold">
                <ArrowDownCircle className="w-5 h-5 text-sky-600" />
                <span>Downspout Pricing</span>
              </div>
              <Separator className="bg-sky-200" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="downspout2x3"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sky-900">Downspout 2x3 Unit Cost ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} className="rounded-xl border-sky-200 bg-white focus-visible:ring-sky-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="downspout3x4"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sky-900">Downspout 3x4 Unit Cost ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} className="rounded-xl border-sky-200 bg-white focus-visible:ring-sky-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="downspoutChain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sky-900">Downspout Chain Cost ($/LF)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} className="rounded-xl border-sky-200 bg-white focus-visible:ring-sky-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="downspoutNonStockColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sky-900">Non-Stock Downspout Color Surcharge ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} className="rounded-xl border-sky-200 bg-white focus-visible:ring-sky-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Gutter Helmet Section (Emerald) */}
            <div className="space-y-4 bg-emerald-50/50 border border-emerald-200 p-6 rounded-2xl">
              <div className="flex items-center gap-2 text-emerald-900 font-bold">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Gutter Helmet Pricing</span>
              </div>
              <Separator className="bg-emerald-200" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="helmet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-emerald-900">Gutter Helmet Unit Cost ($/LF)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} className="rounded-xl border-emerald-200 bg-white focus-visible:ring-emerald-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Heat Cable Section (Orange) */}
            <div className="space-y-4 bg-orange-50/50 border border-orange-200 p-6 rounded-2xl">
              <div className="flex items-center gap-2 text-orange-900 font-bold">
                <Zap className="w-5 h-5 text-orange-600" />
                <span>Heat Cable Pricing</span>
              </div>
              <Separator className="bg-orange-200" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="cable"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-orange-900">Base Heat Cable Cost ($/LF)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} className="rounded-xl border-orange-200 bg-white focus-visible:ring-orange-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cableSerpentine"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-orange-900">Serpentine Layout Cost ($/LF)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} className="rounded-xl border-orange-200 bg-white focus-visible:ring-orange-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cable1Cable"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-orange-900">1 Cable Layout Cost ($/LF)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} className="rounded-xl border-orange-200 bg-white focus-visible:ring-orange-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cable2Cable"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-orange-900">2 Cable Layout Cost ($/LF)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} className="rounded-xl border-orange-200 bg-white focus-visible:ring-orange-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cable3Cable"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-orange-900">3 Cable Layout Cost ($/LF)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} className="rounded-xl border-orange-200 bg-white focus-visible:ring-orange-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cable120V"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-orange-900">120V Circuit Cost ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} className="rounded-xl border-orange-200 bg-white focus-visible:ring-orange-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cable240V"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-orange-900">240V Circuit Cost ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} className="rounded-xl border-orange-200 bg-white focus-visible:ring-orange-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cableRetrofit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-orange-900">Retrofit Cost ($/LF)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} className="rounded-xl border-orange-200 bg-white focus-visible:ring-orange-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cableWifi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-orange-900">WiFi Controller Cost ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} className="rounded-xl border-orange-200 bg-white focus-visible:ring-orange-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cableSwitch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-orange-900">Switch Cost ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} className="rounded-xl border-orange-200 bg-white focus-visible:ring-orange-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cableBreaker"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-orange-900">Breaker Cost ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} className="rounded-xl border-orange-200 bg-white focus-visible:ring-orange-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cableElectrician"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-orange-900">Electrician Cost ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} className="rounded-xl border-orange-200 bg-white focus-visible:ring-orange-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Snow Fence Section (Purple) */}
            <div className="space-y-4 bg-purple-50/50 border border-purple-200 p-6 rounded-2xl">
              <div className="flex items-center gap-2 text-purple-900 font-bold">
                <Snowflake className="w-5 h-5 text-purple-600" />
                <span>Snow Fence Pricing</span>
              </div>
              <Separator className="bg-purple-200" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="snowFence"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-900">Snow Fence Unit Cost ($/LF)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} className="rounded-xl border-purple-200 bg-white focus-visible:ring-purple-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Sasquatch Section (Slate) */}
            <div className="space-y-4 bg-slate-50/50 border border-slate-200 p-6 rounded-2xl">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <Footprints className="w-5 h-5 text-slate-600" />
                <span>Sasquatch Pricing</span>
              </div>
              <Separator className="bg-slate-200" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="sasquatchMobilization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-900">Sasquatch Mobilization ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="1" {...field} className="rounded-xl border-slate-200 bg-white focus-visible:ring-slate-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 py-6 font-semibold">
                <Save className="w-4 h-4 mr-2" />
                Save Pricing Settings
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PricingSettings;