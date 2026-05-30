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
import { BidRecord } from '@/hooks/use-data-store';
import { showSuccess } from '@/utils/toast';
import { Separator } from "@/components/ui/separator";
import { Droplets, ArrowDownCircle, ShieldCheck } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";

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
  const [downspoutType, setDownspoutType] = useState<'linear' | 'chain' | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: record ? {
      date: record.date,
      client: record.client,
      job: record.job || "",
      linearFeet: record.linearFeet,
      unitCost: record.unitCost,
      markup: record.markup,
      status: record.status,
      area: record.area || "",
      gutterColor: record.gutterColor || "White (30) (stock)",
      gutterProfile: record.gutterProfile || 'None',
      gutterCert: record.gutterCert || 'None',
      includeGutterDownspout: record.includeGutterDownspout || 'Yes',
      demolition: record.demolition || 'No',
      downspoutColor: record.downspoutColor || "White (30) (stock)",
      downspoutSize: record.downspoutSize || 'None',
      downspoutLinearFeet: record.downspoutLinearFeet || 0,
      chainLinearFeet: record.chainLinearFeet || 0,
      buildingStories: record.buildingStories || 1,
      downspoutUnitCost: record.downspoutUnitCost || 0,
      downspoutMarkup: record.downspoutMarkup || 20,
      helmetColor: record.helmetColor || "White (30) (stock)",
      helmetLinearFeet: record.helmetLinearFeet || 0,
      helmetUnitCost: record.helmetUnitCost || 0,
      helmetMarkup: record.helmetMarkup || 20,
      roofType: record.roofType || 'Asphalt Shingle',
    } : undefined,
  });

  useEffect(() => {
    if (record) {
      if (record.downspoutLinearFeet && record.downspoutLinearFeet > 0) setDownspoutType('linear');
      else if (record.chainLinearFeet && record.chainLinearFeet > 0) setDownspoutType('chain');
    }
  }, [record]);

  const watchedProfile = form.watch("gutterProfile");
  const watchedInclude = form.watch("includeGutterDownspout");
  const watchedDemolition = form.watch("demolition");
  const watchedStories = form.watch("buildingStories");

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
      onUpdate(record.id, values);
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <FormLabel>Job</FormLabel>
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
            </div>

            {/* Gutter Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-indigo-900 font-bold">
                <Droplets className="w-4 h-4" />
                <span>Gutter Section</span>
              </div>
              <Separator className="bg-indigo-50" />
              
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Area</FormLabel>
                      <FormControl>
                        <Input {...field} className="rounded-xl border-indigo-100" />
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
                      <FormLabel>Profile</FormLabel>
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
                      <FormLabel>Cert</FormLabel>
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

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="linearFeet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LF</FormLabel>
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
                      <FormLabel>Cost ($)</FormLabel>
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
                      <FormLabel>Markup %</FormLabel>
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
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-indigo-900 font-bold">
                <ArrowDownCircle className="w-4 h-4" />
                <span>Downspout Section</span>
              </div>
              <Separator className="bg-indigo-50" />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="downspoutColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
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
                  name="downspoutSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size</FormLabel>
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
                          className="rounded-md border-indigo-200 data-[state=checked]:bg-indigo-600"
                        />
                        <FormLabel htmlFor="edit-linear" className="mb-0 cursor-pointer">LF</FormLabel>
                      </div>
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
                      <div className="flex items-center gap-2 mb-2">
                        <Checkbox 
                          id="edit-chain" 
                          checked={downspoutType === 'chain'} 
                          onCheckedChange={(checked) => setDownspoutType(checked ? 'chain' : null)}
                          className="rounded-md border-indigo-200 data-[state=checked]:bg-indigo-600"
                        />
                        <FormLabel htmlFor="edit-chain" className="mb-0 cursor-pointer">Chain LF</FormLabel>
                      </div>
                      <FormControl>
                        <Input type="number" {...field} className="rounded-xl border-indigo-100" />
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
                        <Input type="number" {...field} className="rounded-xl border-indigo-100" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="downspoutUnitCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost ($)</FormLabel>
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
                      <FormLabel>Markup %</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="rounded-xl border-indigo-100" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Gutter Helmet Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-indigo-900 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Gutter Helmet Section</span>
              </div>
              <Separator className="bg-indigo-50" />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="helmetColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
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
                  name="roofType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Roof Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-indigo-100">
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

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="helmetLinearFeet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LF</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="rounded-xl border-indigo-100" />
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
                        <Input type="number" step="0.01" {...field} className="rounded-xl border-indigo-100" />
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
                      <FormLabel>Markup %</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="rounded-xl border-indigo-100" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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