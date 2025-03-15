"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ShoppingCart, DollarSign, TrendingUp, Info } from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from "recharts";

const InflationImpact = () => {
  const { toast } = useToast();
  const [currentAmount, setCurrentAmount] = useState(10000);
  const [inflationRate, setInflationRate] = useState(5);
  const [years, setYears] = useState(10);
  const [chartData, setChartData] = useState<any[]>([]);
  const [futureValue, setFutureValue] = useState(0);

  const calculateInflationImpact = () => {
    const data = [];
    let inflatedValue = currentAmount;
    const futureValue = currentAmount / Math.pow(1 + (inflationRate / 100), years);
    setFutureValue(futureValue);

    for (let year = 0; year <= years; year++) {
      const inflatedValueAtYear = currentAmount / Math.pow(1 + (inflationRate / 100), year);
      data.push({
        year,
        nominalValue: currentAmount,
        realValue: parseFloat(inflatedValueAtYear.toFixed(2))
      });
    }

    setChartData(data);
    
    toast({
      title: "Inflation Impact Calculated",
      description: `₹${currentAmount.toLocaleString()} today will be worth ₹${futureValue.toFixed(2).toLocaleString()} in ${years} years with ${inflationRate}% inflation.`,
    });
  };

  useEffect(() => {
    calculateInflationImpact();
  }, []);

  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString()}`;
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">Inflation Impact Calculator</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Visualize how inflation erodes your purchasing power over time. See the real value of your money in the future.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="finance-card lg:col-span-1 animate-scale-in">
          <CardHeader>
            <CardTitle>Input Parameters</CardTitle>
            <CardDescription>Adjust values to see inflation's impact</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="current-amount">Current Amount (₹)</Label>
                <span className="text-sm text-finance-700 font-medium">₹{currentAmount.toLocaleString()}</span>
              </div>
              <Input 
                id="current-amount" 
                type="number"
                min="1000" 
                max="10000000" 
                value={currentAmount} 
                onChange={(e) => setCurrentAmount(Number(e.target.value))}
                className="input-field"
              />
              <Slider 
                value={[currentAmount]} 
                min={1000} 
                max={100000} 
                step={1000} 
                onValueChange={(value) => setCurrentAmount(value[0])} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="inflation-rate">Annual Inflation Rate (%)</Label>
                <span className="text-sm text-finance-700 font-medium">{inflationRate}%</span>
              </div>
              <Input 
                id="inflation-rate" 
                type="number"
                min="0" 
                max="20" 
                step="0.1"
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
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="years">Time Period (Years)</Label>
                <span className="text-sm text-finance-700 font-medium">{years} years</span>
              </div>
              <Input 
                id="years" 
                type="number"
                min="1" 
                max="50" 
                value={years} 
                onChange={(e) => setYears(Number(e.target.value))}
                className="input-field"
              />
              <Slider 
                value={[years]} 
                min={1} 
                max={30} 
                step={1} 
                onValueChange={(value) => setYears(value[0])} 
              />
            </div>
            
            <Button className="w-full finance-btn" onClick={calculateInflationImpact}>
              Calculate Inflation Impact
            </Button>
          </CardContent>
        </Card>
        
        <Card className="finance-card lg:col-span-2 animate-scale-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle>Purchasing Power Decline</CardTitle>
            <CardDescription>How inflation affects your money's value over time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottomRight', offset: -5 }} />
                  <YAxis 
                    tickFormatter={(value) => `₹${(value/1000).toFixed(0)}k`} 
                    domain={[0, 'dataMax']}
                    label={{ value: 'Value (₹)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, undefined]} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="nominalValue" 
                    name="Nominal Value" 
                    stroke="#33C3F0" 
                    strokeWidth={2} 
                    dot={{ r: 2 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="realValue" 
                    name="Real Value (Inflation Adjusted)" 
                    stroke="#FF6B6B" 
                    strokeWidth={2} 
                    dot={{ r: 2 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-finance-100 p-4 rounded-lg flex items-center gap-3">
                <div className="bg-finance-200 p-3 rounded-full text-finance-700">
                  <DollarSign size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Value</p>
                  <p className="text-xl font-bold text-finance-700">₹{currentAmount.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="bg-finance-100 p-4 rounded-lg flex items-center gap-3">
                <div className="bg-finance-200 p-3 rounded-full text-yellow-600">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Inflation Rate</p>
                  <p className="text-xl font-bold text-yellow-600">{inflationRate}% per year</p>
                </div>
              </div>
              
              <div className="bg-finance-100 p-4 rounded-lg flex items-center gap-3">
                <div className="bg-finance-200 p-3 rounded-full text-red-500">
                  <ShoppingCart size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Future Buying Power</p>
                  <p className="text-xl font-bold text-red-500">₹{futureValue.toFixed(0).toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-2 bg-finance-100 p-4 rounded-lg text-sm">
              <Info className="text-finance-700 mt-0.5 h-5 w-5 flex-shrink-0" />
              <p className="text-gray-600">
                Inflation is the rate at which the value of a currency is falling and consequently the general 
                level of prices for goods and services is rising. This calculator shows how much your money's 
                purchasing power will decrease over time due to inflation.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InflationImpact;
