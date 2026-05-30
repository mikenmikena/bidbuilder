"use client";

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Droplets, Calendar, ArrowDownCircle } from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  date: z.string().min(1, "Date is required"),
  client: z.string().min(2, "Client is required"),
  job: z.string().min(2, "Job name is required"),
  linearFeet: z.coerce.number().min(0),
  unitCost: z.coerce.number().min(0),
  markup: z.coerce.number().min(0),
  status: z.enum(['Draft', 'Submitted', 'Won', 'Lost']),
  area: z.string().optional(),
  gutterColor: z.string().optional(),
  gutterProfile: z.enum(['5K', '6B', '6K', 'None']).default('None'),
  gutterCert: z.enum(['Box Level 1', 'Box Level 2', 'Box Level 3', 'K Level 1', 'K Level 2', 'K Level 3', 'None']).default('None'),
  includeGutterDownspout: z.enum(['Yes', 'No']).default('Yes'),
  demolition: z.enum(['Yes', 'No']).default('No'),
  // Downspout fields
  downspoutArea: z.string().optional(),
  downspoutColor: z.string().optional(),
  downspoutSize: z.enum(['2x3', '3x4', 'None']).default('None'),
  downspoutLinearFeet: z.coerce.number().min(0).default(0),
  chainLinearFeet: z.coerce.number().min(0).default(0),
  buildingStories: z.coerce.number().min(1).default(1),
  downspoutUnitCost: z.coerce.number().min(0).default(0),
  downspoutMarkup: z.coerce.number().min(0).default(20),
});

interface DataEntryFormProps {
  onAdd: (data: z.infer<typeof formSchema>) => void;
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

const DataEntryForm = ({ onAdd }: DataEntryFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      client: "",
      job: "",
      linearFeet: 0,
      unitCost: 0,
      markup: 20,
      status: 'Draft',
      area: "",
      gutterColor: "White (30) (stock)",
      gutterProfile: 'None',
      gutterCert: 'None',
      includeGutterDownspout: 'Yes',
      demolition: 'No',
      downspoutArea: "",
      downspoutColor: "White (30) (stock)",
      downspoutSize: 'None',
      downspoutLinearFeet: 0,
      chainLinearFeet: 0,
      buildingStories: 1,
      downspoutUnitCost: 0,
      downspoutMarkup: 20,
    },
  });

  const watchedProfile = form.watch("gutterProfile");
  const watchedInclude = form.watch("includeGutterDownspout");
  const watchedDemolition = form.watch("demolition");

  useEffect(() => {
    let baseCost = 0;
    if (watchedInclude === "Yes") {
      if (watchedProfile === "5K") {
        baseCost = 23.83;
      } else if (watchedProfile === "6B" || watchedProfile === "6K") {
        baseCost = 34.44;
      }
    }
    
    const finalCost = watchedDemolition === "Yes" ? baseCost + 5.28 : baseCost;
    form.setValue("unitCost", Number(finalCost.toFixed(2)));
  }, [watchedProfile, watchedInclude, watchedDemolition, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onAdd(values);
    form.reset({
      ...values,
      linearFeet: 0,
      unitCost: 0,
      downspoutLinearFeet: 0,
      chainLinearFeet: 0,
    });
    showSuccess("Bid item added!");
  };

  return (
    <Card className="w-full border-none shadow-lg bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-indigo-900">
          <Briefcase className="w-5 h-5" />
          Add Bid Item
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="client"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Client" {...field} className="rounded-xl border-indigo-100" />
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
                    <FormLabel>Job Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Job" {...field} className="rounded-xl border-indigo-100" />
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
            </div>

            {/* Gutter Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-900 font-bold">
                <Droplets className="w-4 h-4" />
                <span>Gutter Section</span>
              </div>
              <Separator className="bg-indigo-50" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Area</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Front, Back, Garage" {...field} className="rounded-xl border-indigo-100" />
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
                      <FormLabel>Include gutter and downspout</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-indigo-100">
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="gutterColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gutter Color</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-indigo-100">
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
                      <FormLabel>Gutter Profile</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-indigo-100">
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
                  name="gutterCert"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gutter Cert</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-indigo-100">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="linearFeet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Linear Feet</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="rounded-xl border-indigo-100" />
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
                      <FormLabel>Unit Cost ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} className="rounded-xl border-indigo-100" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="markup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Markup (%)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="rounded-xl border-indigo-100" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Downspout Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-900 font-bold">
                <ArrowDownCircle className="w-4 h-4" />
                <span>Downspout Section</span>
              </div>
              <Separator className="bg-indigo-50" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="downspoutArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Area</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Front, Back, Garage" {...field} className="rounded-xl border-indigo-100" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="downspoutColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Downspout Color</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-indigo-100">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="downspoutSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Downspout Size</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-indigo-100">
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
                <FormField
                  control={form.control}
                  name="downspoutLinearFeet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Linear Feet</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="rounded-xl border-indigo-100" />
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
                      <FormLabel>Chain Linear Feet</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="rounded-xl border-indigo-100" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="buildingStories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Building Stories</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="rounded-xl border-indigo-100" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="downspoutUnitCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit Cost ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} className="rounded-xl border-indigo-100" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="downspoutMarkup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Markup (%)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="rounded-xl border-indigo-100" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="demolition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Demolition?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl border-indigo-100">
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
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-6 text-lg font-semibold transition-all">
              Add to Bid
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DataEntryForm;