"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Clock, TrendingUp, Calendar, Wallet, Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

const RetirementCalculator = () => {
  const { toast } = useToast();
  
  // Basic inputs
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [currentSavings, setCurrentSavings] = useState(500000);
  const [monthlyContribution, setMonthlyContribution] = useState(15000);
  const [expectedReturn, setExpectedReturn] = useState(8);
  const [inflationRate, setInflationRate] = useState(5);
  
  // Results
  const [yearsToRetirement, setYearsToRetirement] = useState(0);
  const [projectedSavings, setProjectedSavings] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [monthlySip, setMonthlySip] = useState(0);
  
  const calculateRetirement = () => {
    const years = retirementAge - currentAge;
    setYearsToRetirement(years);
    
    let futureValue = currentSavings;
    const monthlyReturnRate = (expectedReturn / 100) / 12;
    const monthlyInflationRate = (inflationRate / 100) / 12;
    
    const months = years * 12;
    
    const data = [{
      age: currentAge,
      savings: currentSavings
    }];
    
    for (let i = 1; i <= years; i++) {
      // Calculate future value with monthly contributions
      futureValue = futureValue * (1 + expectedReturn / 100);
      futureValue += monthlyContribution * 12;
      
      data.push({
        age: currentAge + i,
        savings: Math.round(futureValue)
      });
    }
    
    setProjectedSavings(Math.round(futureValue));
    setChartData(data);
    
    // Calculate monthly SIP required to reach projected savings
    const monthlyTargetSip = futureValue / (((Math.pow(1 + monthlyReturnRate, months) - 1) / monthlyReturnRate) * (1 + monthlyReturnRate));
    setMonthlySip(Math.round(monthlyTargetSip));
    
    toast({
      title: "Retirement Projection",
      description: `Based on your inputs, you will have approximately ₹${Math.round(futureValue).toLocaleString()} at retirement.`,
    });
  };
  
  useEffect(() => {
    calculateRetirement();
  }, []);
  
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">Retirement Calculator</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Plan your financial future and estimate how much you need to save for a comfortable retirement.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="finance-card lg:col-span-1 animate-scale-in">
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
            <CardDescription>Provide your details to estimate retirement savings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="current-age">Current Age</Label>
                <span className="text-sm text-finance-700 font-medium">{currentAge} years</span>
              </div>
              <Input 
                id="current-age" 
                type="number"
                min="18" 
                max="70" 
                value={currentAge} 
                onChange={(e) => setCurrentAge(Number(e.target.value))}
                className="input-field"
              />
              <Slider 
                value={[currentAge]} 
                min={18} 
                max={70} 
                step={1} 
                onValueChange={(value) => setCurrentAge(value[0])} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="retirement-age">Retirement Age</Label>
                <span className="text-sm text-finance-700 font-medium">{retirementAge} years</span>
              </div>
              <Input 
                id="retirement-age" 
                type="number"
                min={currentAge + 1} 
                max="80" 
                value={retirementAge} 
                onChange={(e) => setRetirementAge(Number(e.target.value))}
                className="input-field"
              />
              <Slider 
                value={[retirementAge]} 
                min={currentAge + 1} 
                max={80} 
                step={1} 
                onValueChange={(value) => setRetirementAge(value[0])} 
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
                max={5000000} 
                step={10000} 
                onValueChange={(value) => setCurrentSavings(value[0])} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="monthly-contribution">Monthly Contribution (₹)</Label>
                <span className="text-sm text-finance-700 font-medium">₹{monthlyContribution.toLocaleString()}</span>
              </div>
              <Input 
                id="monthly-contribution" 
                type="number"
                min="0" 
                max="100000" 
                value={monthlyContribution} 
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                className="input-field"
              />
              <Slider 
                value={[monthlyContribution]} 
                min={1000} 
                max={100000} 
                step={1000} 
                onValueChange={(value) => setMonthlyContribution(value[0])} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="expected-return">Expected Annual Return (%)</Label>
                <span className="text-sm text-finance-700 font-medium">{expectedReturn}%</span>
              </div>
              <Input 
                id="expected-return" 
                type="number"
                min="1" 
                max="20" 
                step="0.5"
                value={expectedReturn} 
                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                className="input-field"
              />
              <Slider 
                value={[expectedReturn]} 
                min={1} 
                max={20} 
                step={0.5} 
                onValueChange={(value) => setExpectedReturn(value[0])} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="inflation-rate">Inflation Rate (%)</Label>
                <span className="text-sm text-finance-700 font-medium">{inflationRate}%</span>
              </div>
              <Input 
                id="inflation-rate" 
                type="number"
                min="0" 
                max="15" 
                step="0.5"
                value={inflationRate} 
                onChange={(e) => setInflationRate(Number(e.target.value))}
                className="input-field"
              />
              <Slider 
                value={[inflationRate]} 
                min={0} 
                max={15} 
                step={0.5} 
                onValueChange={(value) => setInflationRate(value[0])} 
              />
            </div>
            
            <Button className="w-full finance-btn" onClick={calculateRetirement}>
              Calculate Retirement Savings
            </Button>
          </CardContent>
        </Card>
        
        <Card className="finance-card lg:col-span-2 animate-scale-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle>Retirement Projection</CardTitle>
            <CardDescription>Your estimated savings growth until retirement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" label={{ value: 'Age', position: 'insideBottomRight', offset: -5 }} />
                  <YAxis 
                    tickFormatter={(value) => `₹${(value/1000000).toFixed(1)}M`} 
                    label={{ value: 'Savings (₹)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Projected Savings']}
                    labelFormatter={(value) => `Age: ${value}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="savings" 
                    stroke="#33C3F0" 
                    fill="#33C3F0" 
                    fillOpacity={0.6} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-finance-100 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="text-finance-700 h-5 w-5" />
                  <p className="text-sm font-medium text-gray-600">Years to Retirement</p>
                </div>
                <p className="text-2xl font-bold text-finance-700">{yearsToRetirement} years</p>
              </div>
              
              <div className="bg-finance-100 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="text-finance-700 h-5 w-5" />
                  <p className="text-sm font-medium text-gray-600">Projected Savings</p>
                </div>
                <p className="text-2xl font-bold text-finance-700">₹{projectedSavings.toLocaleString()}</p>
              </div>
              
              <div className="bg-finance-100 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="text-finance-700 h-5 w-5" />
                  <p className="text-sm font-medium text-gray-600">Retirement Age</p>
                </div>
                <p className="text-2xl font-bold text-finance-700">{retirementAge} years</p>
              </div>
              
              <div className="bg-finance-100 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="text-finance-700 h-5 w-5" />
                  <p className="text-sm font-medium text-gray-600">Monthly SIP Needed</p>
                </div>
                <p className="text-2xl font-bold text-finance-700">₹{monthlySip.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2 bg-finance-100 p-4 rounded-lg text-sm">
              <Info className="text-finance-700 mt-0.5 h-5 w-5 flex-shrink-0" />
              <p className="text-gray-600">
                This calculator provides a basic estimate for retirement planning. For a more comprehensive plan, 
                consider consulting with a financial advisor who can account for additional factors such as taxes, 
                healthcare costs, and varying investment performance.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RetirementCalculator;
