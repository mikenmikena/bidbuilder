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
import { Settings2, Save, RefreshCcw } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

const pricingSchema = z.object({
  gutter5K: z.coerce.number().min(0),
  gutter6B6K: z.coerce.number().min(0),
  demolition: z.coerce.number().min(0),
  downspout: z.coerce.number().min(0),
  helmet: z.coerce.number().min(0),
  cable: z.coerce.number().min(0),
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
      gutter6B6K: 34.44,
      demolition: 5.28,
      downspout: 12.00,
      helmet: 15.00,
      cable: 18.00,
      snowFence: 25.00,
      sasquatchMobilization: 400.00,
    };
    form.reset(defaults);
    onUpdate(defaults);
    showSuccess("Pricing reset to defaults.");
  };

  return (
    <Card className="border-none shadow-lg bg-white">
      <CardHeader>
        <div className="flex items-center justify-between">
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FormField
                control={form.control}
                name="gutter5K"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gutter 5K Base ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} className="rounded-xl border-indigo-100" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gutter6B6K"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gutter 6B/6K Base ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} className="rounded-xl border-indigo-100" />
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
                    <FormLabel>Demolition Add-on ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} className="rounded-xl border-indigo-100" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="downspout"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Downspout Unit Cost ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} className="rounded-xl border-indigo-100" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="helmet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gutter Helmet Unit Cost ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} className="rounded-xl border-indigo-100" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cable"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heat Cable Unit Cost ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} className="rounded-xl border-indigo-100" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="snowFence"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Snow Fence Unit Cost ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} className="rounded-xl border-indigo-100" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sasquatchMobilization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sasquatch Mobilization ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="1" {...field} className="rounded-xl border-indigo-100" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8">
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