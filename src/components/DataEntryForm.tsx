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
import { Briefcase, Droplets } from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  date: z.string().min(1, "Date is required"),
  client: z.string().min(2, "Client is required"),
  linearFeet: z.coerce.number().min(1, "Linear Feet must be at least 1"),
  unitCost: z.coerce.number().min(0, "Cost cannot be negative"),
  markup: z.coerce.number().min(0, "Markup cannot be negative"),
  status: z.enum(['Draft', 'Submitted', 'Won', 'Lost']),
  area: z.string().optional(),
  gutterColor: z.string().optional(),
  gutterProfile: z.enum(['5K', '6B', '6K', 'None']).default('None'),
  gutterCert: z.enum(['Box Level 1', 'Box Level 2', 'Box Level 3', 'K Level 1', 'K Level 2', 'K Level 3', 'None']).default('None'),
  includeGutterDownspout: z.enum(['Yes', 'No']).default('No'),
  demolition: z.enum(['Yes', 'No']).default('No'),
});

interface DataEntryFormProps {
  onAdd: (data: z.infer<typeof formSchema>) => void;
}

const GUTTER_COLORS = [
  "White", "Royal Brown", "Musket Brown", "Black", "Wicker", "Clay", "Terratone", "Bronze", "Silver"
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
      linearFeet: 1,
      unitCost: 0,
      markup: 20,
      status: 'Draft',
      area: "",
      gutterColor: "White",
      gutterProfile: 'None',
      gutterCert: 'None',
      includeGutterDownspout: 'No',
      demolition: 'No',
    },
  });

  const watchedProfile = form.watch("gutterProfile");
  const watchedInclude = form.watch("includeGutterDownspout");

  // Automate Unit Cost based on rules
  useEffect(() => {
    if (watchedInclude === "No") {
      form.setValue("unitCost", 0);
    } else if (watchedInclude === "Yes") {
      if (watchedProfile === "5K") {
        form.setValue("unitCost", 23.83);
      } else if (watchedProfile === "6B" || watchedProfile === "6K") {
        form.setValue("unitCost", 34.44);
      } else {
        form.setValue("unitCost", 0);
      }
    }
  }, [watchedProfile, watchedInclude, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onAdd(values);
    form.reset({
      ...values,
      linearFeet: 1,
      unitCost: 0,
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="client"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter client name" {...field} className="rounded-xl border-indigo-100" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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