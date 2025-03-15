"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Shield, Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const EmergencyFund = () => {
  const { toast } = useToast();
  const [monthlySavings, setMonthlySavings] = useState(5000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(30000);
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [targetMonths, setTargetMonths] = useState(6);
  
  const [progress, setProgress] = useState(0);
  const [monthsCovered, setMonthsCovered] = useState(0);
  const [targetAmount, setTargetAmount] = useState(0);
  const [timeToTarget, setTimeToTarget] = useState(0);
  
  const calculateProgress = () => {
    const targetSavings = monthlyExpenses * targetMonths;
    setTargetAmount(targetSavings);
    
    const coverage = currentSavings / monthlyExpenses;
    setMonthsCovered(parseFloat(coverage.toFixed(1)));
    
    const progressPercentage = Math.min((currentSavings / targetSavings) * 100, 100);
    setProgress(progressPercentage);
    
    if (monthlySavings > 0 && currentSavings < targetSavings) {
      const monthsNeeded = (targetSavings - currentSavings) / monthlySavings;
      setTimeToTarget(parseFloat(monthsNeeded.toFixed(1)));
    } else if (currentSavings >= targetSavings) {
      setTimeToTarget(0);
    } else {
      setTimeToTarget(Infinity);
    }
    
    toast({
      title: "Emergency Fund Status",
      description: `Your current savings cover ${monthsCovered.toFixed(1)} months of expenses. Target: ${targetMonths} months.`,
    });
  };
  
  useEffect(() => {
    calculateProgress();
  }, []);
  
  const getMilestoneLabel = (months: number) => {
    if (months <= 1) return "Basic Safety Net";
    if (months <= 3) return "Short-term Safety";
    if (months <= 6) return "Standard Emergency Fund";
    if (months <= 9) return "Extended Safety Net";
    return "Financial Security";
  };
  
  const getProgressColor = () => {
    if (progress < 33) return "bg-red-500";
    if (progress < 66) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">Emergency Fund Builder</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Track your progress toward building a sufficient emergency fund to handle life's unexpected expenses.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="finance-card lg:col-span-1 animate-scale-in">
          <CardHeader>
            <CardTitle>Input Parameters</CardTitle>
            <CardDescription>Adjust values to calculate your emergency fund status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="monthly-expenses">Monthly Expenses (₹)</Label>
                <span className="text-sm text-finance-700 font-medium">₹{monthlyExpenses.toLocaleString()}</span>
              </div>
              <Input 
                id="monthly-expenses" 
                type="number" 
                min="1000" 
                max="1000000" 
                value={monthlyExpenses} 
                onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                className="input-field"
              />
              <Slider 
                value={[monthlyExpenses]} 
                min={5000} 
                max={200000} 
                step={1000} 
                onValueChange={(value) => setMonthlyExpenses(value[0])} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="current-savings">Current Savings (₹)</Label>
                <span className="text-sm text-finance-700 font-medium">₹{currentSavings.toLocaleString()}</span>
              </div>
              <Input 
                id="current-savings" 
                type="number" 
                min="0" 
                max="10000000" 
                value={currentSavings} 
                onChange={(e) => setCurrentSavings(Number(e.target.value))}
                className="input-field"
              />
              <Slider 
                value={[currentSavings]} 
                min={0} 
                max={1000000} 
                step={5000} 
                onValueChange={(value) => setCurrentSavings(value[0])} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="monthly-savings">Monthly Savings (₹)</Label>
                <span className="text-sm text-finance-700 font-medium">₹{monthlySavings.toLocaleString()}</span>
              </div>
              <Input 
                id="monthly-savings" 
                type="number" 
                min="0" 
                max="100000" 
                value={monthlySavings} 
                onChange={(e) => setMonthlySavings(Number(e.target.value))}
                className="input-field"
              />
              <Slider 
                value={[monthlySavings]} 
                min={0} 
                max={50000} 
                step={500} 
                onValueChange={(value) => setMonthlySavings(value[0])} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="target-months">Target (Months of Expenses)</Label>
                <span className="text-sm text-finance-700 font-medium">{targetMonths} months</span>
              </div>
              <Input 
                id="target-months" 
                type="number" 
                min="1" 
                max="24" 
                value={targetMonths} 
                onChange={(e) => setTargetMonths(Number(e.target.value))}
                className="input-field"
              />
              <Slider 
                value={[targetMonths]} 
                min={1} 
                max={12} 
                step={1} 
                onValueChange={(value) => setTargetMonths(value[0])} 
              />
            </div>
            
            <Button className="w-full finance-btn" onClick={calculateProgress}>Update Calculation</Button>
          </CardContent>
        </Card>
        
        <Card className="finance-card lg:col-span-2 animate-scale-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle>Emergency Fund Status</CardTitle>
            <CardDescription>Visual representation of your financial safety net</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>0 months</span>
                <span>3 months</span>
                <span>6 months</span>
                <span>9 months</span>
                <span>12 months</span>
              </div>
              <div className="relative w-full">
                <Progress value={progress} className={cn("h-3", getProgressColor())} />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Risk</span>
                <span>Target: {targetMonths} months</span>
                <span>Security</span>
              </div>
            </div>
            
            <div className="bg-finance-100 p-5 rounded-lg flex items-center gap-4">
              <div className="bg-finance-200 p-4 rounded-full text-finance-700">
                <Shield size={28} />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800">
                  {getMilestoneLabel(monthsCovered)}
                </h3>
                <p className="text-gray-600">
                  Your savings cover <span className="font-semibold text-finance-700">{monthsCovered.toFixed(1)} months</span> of expenses
                </p>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-finance-100 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Target Amount</p>
                <p className="text-2xl font-bold text-finance-700">₹{targetAmount.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">Based on {targetMonths} months of expenses</p>
              </div>
              <div className="bg-finance-100 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Time to Reach Target</p>
                <p className="text-2xl font-bold text-finance-700">
                  {timeToTarget === 0 ? "Target Reached!" : 
                   timeToTarget === Infinity ? "N/A" : 
                   `${timeToTarget.toFixed(1)} months`}
                </p>
                <p className="text-xs text-gray-500 mt-1">With current monthly savings rate</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2 bg-finance-100 p-4 rounded-lg text-sm">
              <Info className="text-finance-700 mt-0.5 h-5 w-5 flex-shrink-0" />
              <p className="text-gray-600">
                Financial experts typically recommend having 3-6 months of essential expenses saved in an 
                emergency fund. This provides a safety net for unexpected events like medical emergencies, 
                car repairs, or job loss.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmergencyFund;
