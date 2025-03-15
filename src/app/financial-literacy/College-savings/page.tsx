"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Info, School, TrendingUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const CollegeSavings = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Input parameters
  const [currentSavings, setCurrentSavings] = useState(10000);
  const [monthlySavings, setMonthlySavings] = useState(1000);
  const [yearsToCollege, setYearsToCollege] = useState(10);
  const [educationCost, setEducationCost] = useState(2000000); // 20 lakhs
  const [annualInflation, setAnnualInflation] = useState(6);
  const [annualReturn, setAnnualReturn] = useState(8);
  
  // Results
  const [projectedCost, setProjectedCost] = useState(0);
  const [projectedSavings, setProjectedSavings] = useState(0);
  const [monthlySavingsNeeded, setMonthlySavingsNeeded] = useState(0);
  const [shortfall, setShortfall] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);

  const calculateProjections = () => {
    // Calculate projected cost with inflation
    const inflatedCost = educationCost * Math.pow(1 + annualInflation / 100, yearsToCollege);
    setProjectedCost(Math.round(inflatedCost));
    
    // Calculate future value of current savings
    const futureSavings = currentSavings * Math.pow(1 + annualReturn / 100, yearsToCollege);
    
    // Calculate future value of monthly contributions
    const monthlyRate = annualReturn / 100 / 12;
    const months = yearsToCollege * 12;
    const futureContributions = monthlySavings * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    
    // Total projected savings
    const totalSavings = futureSavings + futureContributions;
    setProjectedSavings(Math.round(totalSavings));
    
    // Calculate shortfall or surplus
    const difference = totalSavings - inflatedCost;
    setShortfall(Math.round(difference));
    
    // Calculate monthly savings needed to reach goal
    const savingsNeeded = (inflatedCost - futureSavings) / 
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate / (1 + monthlyRate));
    setMonthlySavingsNeeded(Math.max(0, Math.round(savingsNeeded)));
    
    // Create chart data
    const data = [];
    for (let year = 1; year <= yearsToCollege; year++) {
      const yearlyInflatedCost = educationCost * Math.pow(1 + annualInflation / 100, year);
      const yearlySavingsFuture = currentSavings * Math.pow(1 + annualReturn / 100, year);
      const yearlyContributionsFuture = monthlySavings * 
        ((Math.pow(1 + monthlyRate, year * 12) - 1) / monthlyRate) * (1 + monthlyRate);
      const yearlyTotalSavings = yearlySavingsFuture + yearlyContributionsFuture;
      
      data.push({
        year,
        "Projected Cost": Math.round(yearlyInflatedCost),
        "Projected Savings": Math.round(yearlyTotalSavings)
      });
    }
    setChartData(data);
    
    toast({
      title: "College Savings Projection",
      description: `Your projected college cost after ${yearsToCollege} years will be ₹${formatCurrency(inflatedCost)} with a ${difference >= 0 ? 'surplus' : 'shortfall'} of ₹${formatCurrency(Math.abs(difference))}`,
    });
  };

  useEffect(() => {
    calculateProjections();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const isPositive = shortfall >= 0;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">College Savings Calculator</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Plan ahead for education expenses by projecting costs and calculating required savings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="finance-card lg:col-span-1 animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <School className="h-5 w-5 text-finance-700" />
              <span>Input Parameters</span>
            </CardTitle>
            <CardDescription>Adjust values to plan your education savings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="current-savings">Current Savings (₹)</Label>
                <span className="text-sm text-finance-700 font-medium">{formatCurrency(currentSavings)}</span>
              </div>
              <Input 
                id="current-savings" 
                type="number"
                min="0" 
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
                <span className="text-sm text-finance-700 font-medium">{formatCurrency(monthlySavings)}</span>
              </div>
              <Input 
                id="monthly-savings" 
                type="number"
                min="0" 
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
                <Label htmlFor="education-cost">Present Education Cost (₹)</Label>
                <span className="text-sm text-finance-700 font-medium">{formatCurrency(educationCost)}</span>
              </div>
              <Input 
                id="education-cost" 
                type="number"
                min="100000" 
                value={educationCost} 
                onChange={(e) => setEducationCost(Number(e.target.value))}
                className="input-field"
              />
              <Slider 
                value={[educationCost]} 
                min={100000} 
                max={10000000} 
                step={100000} 
                onValueChange={(value) => setEducationCost(value[0])} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="years-to-college">Years to College</Label>
                <span className="text-sm text-finance-700 font-medium">{yearsToCollege} years</span>
              </div>
              <Input 
                id="years-to-college" 
                type="number"
                min="1"
                max="25" 
                value={yearsToCollege} 
                onChange={(e) => setYearsToCollege(Number(e.target.value))}
                className="input-field"
              />
              <Slider 
                value={[yearsToCollege]} 
                min={1} 
                max={25} 
                step={1} 
                onValueChange={(value) => setYearsToCollege(value[0])} 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="annual-inflation">Inflation (%)</Label>
                <Input 
                  id="annual-inflation" 
                  type="number"
                  min="1"
                  max="15" 
                  value={annualInflation} 
                  onChange={(e) => setAnnualInflation(Number(e.target.value))}
                  className="input-field"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="annual-return">Return (%)</Label>
                <Input 
                  id="annual-return" 
                  type="number"
                  min="1"
                  max="20" 
                  value={annualReturn} 
                  onChange={(e) => setAnnualReturn(Number(e.target.value))}
                  className="input-field"
                />
              </div>
            </div>
            
            <Button className="w-full finance-btn" onClick={calculateProjections}>
              Calculate
            </Button>
          </CardContent>
        </Card>
        
        <Card className="finance-card lg:col-span-2 animate-scale-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-finance-700" />
              <span>Projected Savings & Cost</span>
            </CardTitle>
            <CardDescription>Track your progress toward funding education expenses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className={isMobile ? "h-[250px]" : "h-[300px]"}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottomRight', offset: -10 }} />
                  <YAxis tickFormatter={(value) => `₹${value/100000}L`} />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), ""]}
                    labelFormatter={(value) => `Year ${value}`}
                  />
                  <Legend />
                  <Bar dataKey="Projected Cost" fill="#F97316" />
                  <Bar dataKey="Projected Savings" fill="#0FA0CE" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-finance-100 border-finance-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Projected Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-y-2">
                    <p className="text-sm text-gray-600">Future Education Cost:</p>
                    <p className="text-sm font-medium text-right">{formatCurrency(projectedCost)}</p>
                    
                    <p className="text-sm text-gray-600">Projected Savings:</p>
                    <p className="text-sm font-medium text-right">{formatCurrency(projectedSavings)}</p>
                    
                    <p className="text-sm text-gray-600">{isPositive ? 'Surplus:' : 'Shortfall:'}</p>
                    <p className={`text-sm font-medium text-right ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(Math.abs(shortfall))}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className={isPositive ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    {isPositive ? "You're on Track!" : "Recommended Actions"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isPositive ? (
                    <p className="text-sm text-gray-600">
                      Your current savings plan is projected to exceed your education cost goal!
                    </p>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">
                        To reach your education cost goal, consider increasing your monthly contribution to:
                      </p>
                      <p className="text-lg font-bold text-center text-red-600">
                        {formatCurrency(monthlySavingsNeeded)}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="flex items-start gap-2 bg-finance-100 p-4 rounded-lg text-sm">
              <Info className="text-finance-700 mt-0.5 h-5 w-5 flex-shrink-0" />
              <p className="text-gray-600">
                Education costs generally rise faster than regular inflation. This calculator helps you
                estimate future education expenses and the savings required to meet them, accounting for
                inflation and the potential returns on your investments.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CollegeSavings;
