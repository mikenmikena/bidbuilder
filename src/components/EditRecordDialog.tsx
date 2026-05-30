"use client";

import React from 'react';
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

interface EditRecordDialogProps {
  record: BidRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, data: z.infer<typeof formSchema>) => void;
}

const GUTTER_COLORS = [
  "White", "Royal Brown", "Musket Brown", "Black", "Wicker", "Clay", "Terratone", "Bronze", "Silver"
];

const GUTTER_CERTS = [
  "Box Level 1", "Box Level 2", "Box Level 3", "K Level 1", "K Level 2", "K Level 3"
];

const EditRecordDialog = ({ record, isOpen, onClose, onUpdate }: EditRecordDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: record ? {
      date: record.date,
      client: record.client,
      linearFeet: record.linearFeet,
      unitCost: record.unitCost,
      markup: record.markup,
      status: record.status,
      area: record.area || "",
      gutterColor: record.gutterColor || "White",
      gutterProfile: record.gutterProfile || 'None',
      gutterCert: record.gutterCert || 'None',
      includeGutterDownspout: record.includeGutterDownspout || 'No',
      demolition: record.demolition || 'No',
    } : undefined,
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (record) {
      onUpdate(record.id, values);
      showSuccess("Bid item updated!");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-indigo-900">Edit Bid Item</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="client"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="rounded-xl border-indigo-100" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3 pt-2">
              <p className="text-sm font-bold text-indigo-900">Gutter Details</p>
              <Separator className="bg-indigo-50" />
              
              <div className="grid grid-cols-2 gap-4">
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