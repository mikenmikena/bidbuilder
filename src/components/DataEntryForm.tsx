"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Droplets, Calendar, ArrowDownCircle, ShieldCheck, Zap, Snowflake, Eye, EyeOff } from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

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
  downspoutColor: z.string().optional(),
  downspoutSize: z.enum(['2x3', '3x4', 'None']).default('None'),
  downspoutLinearFeet: z.coerce.number().min(0).default(0),
  chainLinearFeet: z.coerce.number().min(0).default(0),
  buildingStories: z.coerce.number().min(1).default(1),
  downspoutUnitCost: z.coerce.number().min(0).default(0),
  downspoutMarkup: z.coerce.number().min(0).default(20),
  // Gutter Helmet fields
  helmetColor: z.string().optional(),
  helmetLinearFeet: z.coerce.number().min(0).default(0),
  helmetUnitCost: z.coerce.number().min(0).default(0),
  helmetMarkup: z.coerce.number().min(0).default(20),
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
  cableMarkup: z.coerce.number().min(0).default(20),
  // Snow Fence fields
  snowFenceColor: z.string().optional(),
  snowFenceRow1LF: z.coerce.number().min(0).default(0),
  snowFenceRow2LF: z.coerce.number().min(0).default(0),
  snowFenceRow3LF: z.coerce.number().min(0).default(0),
  snowFenceRoofType: z.enum(['Asphalt Shingle', 'Pro Panel', 'Corrugated', 'Raised Seam']).default('Asphalt Shingle'),
  snowFenceUnitCost: z.coerce.number().min(0).default(0),
  snowFenceMarkup: z.coerce.number().min(0).default(20),
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
  const [downspoutType, setDownspoutType] = useState<'linear' | 'chain' | null>(null);
  
  // Section visibility states
  const [showGutter, setShowGutter] = useState(true);
  const [showDownspout, setShowDownspout] = useState(false);
  const [showHelmet, setShowHelmet] = useState(false);
  const [showCable, setShowCable] = useState(false);
  const [showSnowFence, setShowSnowFence] = useState(false);

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
      downspoutColor: "White (30) (stock)",
      downspoutSize: 'None',
      downspoutLinearFeet: 0,
      chainLinearFeet: 0,
      buildingStories: 1,
      downspoutUnitCost: 0,
      downspoutMarkup: 20,
      helmetColor: "White (30) (stock)",
      helmetLinearFeet: 0,
      helmetUnitCost: 0,
      helmetMarkup: 20,
      roofType: 'Asphalt Shingle',
      valleyCount: 0,
      daylightLF: 0,
      cableLayout: 'None',
      cableLinearFeet: 0,
      volt: 120,
      amperage: 0,
      retrofit: 'No',
      level3: 'No',
      cableUnitCost: 0,
      cableMarkup: 20,
      snowFenceColor: "White (30) (stock)",
      snowFenceRow1LF: 0,
      snowFenceRow2LF: 0,
      snowFenceRow3LF: 0,
      snowFenceRoofType: 'Asphalt Shingle',
      snowFenceUnitCost: 0,
      snowFenceMarkup: 20,
    },
  });

  const watchedProfile = form.watch("gutterProfile");
  const watchedInclude = form.watch("includeGutterDownspout");
  const watchedDemolition = form.watch("demolition");
  const watchedStories = form.watch("buildingStories");

  // Gutter Cost Calculation
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

  // Downspout Auto-fill Calculation
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
    // Reset hidden fields to 0 before adding
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

    onAdd(finalValues);
    form.reset({
      ...values,
      linearFeet: 0,
      unitCost: 0,
      downspoutLinearFeet: 0,
      chainLinearFeet: 0,
      helmetLinearFeet: 0,
      cableLinearFeet: 0,
      snowFenceRow1LF: 0,
      snowFenceRow2LF: 0,
      snowFenceRow3LF: 0,
    });
    setDownspoutType(null);
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <div className={`space-y-4 bg-amber-100 border border-amber-200 p-4 rounded-2xl transition-all duration-300 ${!showGutter ? 'opacity-60' : ''}`}>
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
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Separator className="bg-amber-200" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="area"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Area</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Front, Back, Garage" {...field} className="rounded-xl border-amber-300" />
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="gutterColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gutter Color</FormLabel>
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
                          <FormLabel>Gutter Profile</FormLabel>
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
                      name="gutterCert"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gutter Cert</FormLabel>
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="linearFeet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Linear Feet</FormLabel>
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
                          <FormLabel>Unit Cost ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} className="rounded-xl border-amber-300" />
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
                            <Input type="number" {...field} className="rounded-xl border-amber-300" />
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
            <div className={`space-y-4 bg-sky-100 border border-sky-200 p-4 rounded-2xl transition-all duration-300 ${!showDownspout ? 'opacity-60' : ''}`}>
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
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Separator className="bg-sky-200" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="downspoutColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Downspout Color</FormLabel>
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
                          <FormLabel>Downspout Size</FormLabel>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="downspoutLinearFeet"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-2 mb-2">
                            <Checkbox 
                              id="select-linear" 
                              checked={downspoutType === 'linear'} 
                              onCheckedChange={(checked) => setDownspoutType(checked ? 'linear' : null)}
                              className="rounded-md border-sky-300 data-[state=checked]:bg-sky-600"
                            />
                            <FormLabel htmlFor="select-linear" className="mb-0 cursor-pointer">Linear Feet</FormLabel>
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
                              id="select-chain" 
                              checked={downspoutType === 'chain'} 
                              onCheckedChange={(checked) => setDownspoutType(checked ? 'chain' : null)}
                              className="rounded-md border-sky-300 data-[state=checked]:bg-sky-600"
                            />
                            <FormLabel htmlFor="select-chain" className="mb-0 cursor-pointer">Chain Linear Feet</FormLabel>
                          </div>
                          <FormControl>
                            <Input type="number" {...field} className="rounded-xl border-sky-300" />
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
                            <Input type="number" {...field} className="rounded-xl border-sky-300" />
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
                            <Input type="number" step="0.01" {...field} className="rounded-xl border-sky-300" />
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
                            <Input type="number" {...field} className="rounded-xl border-sky-300" />
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
            <div className={`space-y-4 bg-emerald-100 border border-emerald-200 p-4 rounded-2xl transition-all duration-300 ${!showHelmet ? 'opacity-60' : ''}`}>
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
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Separator className="bg-emerald-200" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="helmetColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gutter Helmet Color</FormLabel>
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="helmetLinearFeet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Linear Feet</FormLabel>
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
                          <FormLabel>Unit Cost ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} className="rounded-xl border-emerald-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="helmetMarkup"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Markup (%)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} className="rounded-xl border-emerald-300" />
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
            <div className={`space-y-4 bg-orange-100 border border-orange-200 p-4 rounded-2xl transition-all duration-300 ${!showCable ? 'opacity-60' : ''}`}>
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
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Separator className="bg-orange-200" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                          <FormLabel>LF Daylight/ Plug/ other</FormLabel>
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
                          <FormLabel>Heat Cable Layout</FormLabel>
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

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name="cableLinearFeet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Linear Feet</FormLabel>
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
                          <FormLabel>Amperage</FormLabel>
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                          <FormLabel>Unit Cost ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} className="rounded-xl border-orange-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cableMarkup"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Markup (%)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} className="rounded-xl border-orange-300" />
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
            <div className={`space-y-4 bg-purple-100 border border-purple-200 p-4 rounded-2xl transition-all duration-300 ${!showSnowFence ? 'opacity-60' : ''}`}>
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
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Separator className="bg-purple-200" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="snowFenceColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Snow Fence Color</FormLabel>
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="snowFenceRow1LF"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Row 1 Linear Feet</FormLabel>
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
                          <FormLabel>Row 2 Linear Feet</FormLabel>
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
                          <FormLabel>Row 3 Linear Feet</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} className="rounded-xl border-purple-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="snowFenceUnitCost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit Cost ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} className="rounded-xl border-purple-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="snowFenceMarkup"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Markup (%)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} className="rounded-xl border-purple-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
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