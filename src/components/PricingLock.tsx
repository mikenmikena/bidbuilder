"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Unlock, KeyRound } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';

interface PricingLockProps {
  children: React.ReactNode;
}

const PricingLock = ({ children }: PricingLockProps) => {
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(() => {
    // Keep unlocked state in session storage so they don't have to re-enter it constantly
    return sessionStorage.getItem('pricing_unlocked') === 'true';
  });

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple default password for the pricing administration
    if (password === "swis2025") {
      setIsUnlocked(true);
      sessionStorage.setItem('pricing_unlocked', 'true');
      showSuccess("Pricing settings unlocked!");
    } else {
      showError("Incorrect password. Please try again.");
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    sessionStorage.removeItem('pricing_unlocked');
    setPassword("");
  };

  if (isUnlocked) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end no-print">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLock}
            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl"
          >
            <Lock className="w-4 h-4 mr-2" />
            Lock Pricing Tab
          </Button>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <Card className="border-none shadow-xl bg-white">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto bg-indigo-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <KeyRound className="w-8 h-8 text-indigo-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-indigo-900">Pricing Locked</CardTitle>
          <CardDescription>
            Enter the administrator password to modify global pricing settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl border-indigo-100 text-center text-lg tracking-widest"
                autoFocus
              />
              <p className="text-[11px] text-center text-gray-400 italic">
                Hint: Default password is <span className="font-semibold text-indigo-500">swis2025</span>
              </p>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-6 font-semibold transition-all"
            >
              <Unlock className="w-4 h-4 mr-2" />
              Unlock Settings
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingLock;