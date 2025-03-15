"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { FileText, Calculator, PieChart, Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart, 
  Bar, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

const TaxBracket = () => {
  const { toast } = useToast();
  
  const [annualIncome, setAnnualIncome] = useState(1200000);
  const [isRegime, setIsRegime] = useState(true); // true = New Tax Regime, false = Old Tax Regime
  const [chartData, setChartData] = useState<any[]>([]);
  const [taxBreakdown, setTaxBreakdown] = useState<any[]>([]);
  const [effectiveTaxRate, setEffectiveTaxRate] = useState(0);
  const [totalTaxAmount, setTotalTaxAmount] = useState(0);
  
  // Define tax brackets for both regimes
  const newTaxBrackets = [
    { min: 0, max: 300000, rate: 0, color: "#a3e635" },
    { min: 300000, max: 600000, rate: 5, color: "#84cc16" },
    { min: 600000, max: 900000, rate: 10, color: "#65a30d" },
    { min: 900000, max: 1200000, rate: 15, color: "#4d7c0f" },
    { min: 1200000, max: 1500000, rate: 20, color: "#3f6212" },
    { min: 1500000, max: Infinity, rate: 30, color: "#365314" }
  ];
  
  const oldTaxBrackets = [
    { min: 0, max: 250000, rate: 0, color: "#a3e635" },
    { min: 250000, max: 500000, rate: 5, color: "#84cc16" },
    { min: 500000, max: 1000000, rate: 20, color: "#65a30d" },
    { min: 1000000, max: Infinity, rate: 30, color: "#4d7c0f" }
  ];
  
  const calculateTax = () => {
    const brackets = isRegime ? newTaxBrackets : oldTaxBrackets;
    let remainingIncome = annualIncome;
    let totalTax = 0;
    const breakdownData = [];
    const chartData = [];
    
    for (const bracket of brackets) {
      let taxableInThisBracket = 0;
      if (remainingIncome > 0) {
        if (bracket.max === Infinity) {
          taxableInThisBracket = remainingIncome - bracket.min;
        } else {
          taxableInThisBracket = Math.min(bracket.max - bracket.min, remainingIncome - bracket.min);
        }
        taxableInThisBracket = Math.max(0, taxableInThisBracket);
        
        const taxInThisBracket = taxableInThisBracket * (bracket.rate / 100);
        totalTax += taxInThisBracket;
        
        if (taxableInThisBracket > 0) {
          const bracketLabel = bracket.max === Infinity 
            ? `Above ₹${bracket.min.toLocaleString()}`
            : `₹${bracket.min.toLocaleString()} - ₹${bracket.max.toLocaleString()}`;
            
          breakdownData.push({
            bracket: bracketLabel,
            rate: `${bracket.rate}%`,
            taxable: taxableInThisBracket,
            tax: taxInThisBracket,
            color: bracket.color
          });
          
          chartData.push({
            bracket: bracketLabel,
            amount: taxableInThisBracket,
            tax: taxInThisBracket,
            rate: bracket.rate,
            color: bracket.color
          });
        }
      }
    }
    
    const effectiveRate = (totalTax / annualIncome) * 100;
    
    setTaxBreakdown(breakdownData);
    setChartData(chartData);
    setTotalTaxAmount(totalTax);
    setEffectiveTaxRate(effectiveRate);
    
    toast({
      title: `${isRegime ? 'New' : 'Old'} Tax Regime Calculation`,
      description: `Your estimated tax is ₹${Math.round(totalTax).toLocaleString()} with an effective tax rate of ${effectiveRate.toFixed(2)}%.`,
    });
  };
  
  useEffect(() => {
    calculateTax();
  }, []);
  
  const handleRegimeChange = (newRegime: boolean) => {
    setIsRegime(newRegime);
    calculateTax();
  };
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-md">
          <p className="font-medium text-gray-700">{payload[0].payload.bracket}</p>
          <p className="text-gray-600">Taxable: ₹{payload[0].payload.amount.toLocaleString()}</p>
          <p className="text-gray-600">Tax Rate: {payload[0].payload.rate}%</p>
          <p className="font-medium text-finance-700">Tax: ₹{Math.round(payload[0].payload.tax).toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">Tax Bracket Visualizer</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Understand how India's marginal tax system works. See how your income is taxed across different brackets.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="finance-card lg:col-span-1 animate-scale-in">
          <CardHeader>
            <CardTitle>Your Tax Information</CardTitle>
            <CardDescription>Enter your income and select tax regime</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="annual-income">Annual Income (₹)</Label>
                <span className="text-sm text-finance-700 font-medium">₹{annualIncome.toLocaleString()}</span>
              </div>
              <Input 
                id="annual-income" 
                type="number"
                min="0" 
                max="10000000" 
                value={annualIncome} 
                onChange={(e) => setAnnualIncome(Number(e.target.value))}
                className="input-field"
              />
              <Slider 
                value={[annualIncome]} 
                min={0} 
                max={5000000} 
                step={10000} 
                onValueChange={(value) => setAnnualIncome(value[0])} 
              />
            </div>
            
            <div className="space-y-3">
              <Label>Tax Regime</Label>
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  className={`w-full ${isRegime ? 'bg-blue-600' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
                  onClick={() => handleRegimeChange(true)}
                >
                  New Regime
                </Button>
                <Button 
                  className={`w-full ${!isRegime ? 'bg-blue-600' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
                  onClick={() => handleRegimeChange(false)}
                >
                  Old Regime
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {isRegime 
                  ? "New Regime: Lower tax rates without most deductions and exemptions."
                  : "Old Regime: Higher tax rates with various deductions and exemptions available."}
              </p>
            </div>
            
            <Button className="w-full finance-btn" onClick={calculateTax}>
              Calculate Tax
            </Button>
            
            <div className="bg-finance-100 p-4 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Tax:</span>
                <span className="font-bold text-finance-700">₹{Math.round(totalTaxAmount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Effective Tax Rate:</span>
                <span className="font-bold text-finance-700">{effectiveTaxRate.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Take Home:</span>
                <span className="font-bold text-finance-700">₹{Math.round(annualIncome - totalTaxAmount).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="finance-card lg:col-span-2 animate-scale-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle>Marginal Tax Breakdown</CardTitle>
            <CardDescription>See how your income is taxed in each bracket</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bracket" tick={{ fontSize: 11 }} height={60} interval={0} angle={-15} textAnchor="end" />
                  <YAxis 
                    tickFormatter={(value) => `₹${(value/1000).toFixed(0)}k`} 
                    label={{ value: 'Amount (₹)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="amount" 
                    name="Taxable Income" 
                    stackId="a"
                  >
                    {
                      chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))
                    }
                  </Bar>
                  <Bar 
                    dataKey="tax" 
                    name="Tax Amount" 
                    stackId="b"
                    fill="#FF6B6B"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-finance-100 p-4 rounded-lg flex items-center gap-3">
                <div className="bg-finance-200 p-3 rounded-full text-finance-700">
                  <FileText size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Selected</p>
                  <p className="text-lg font-bold text-gray-700">{isRegime ? 'New Regime' : 'Old Regime'}</p>
                </div>
              </div>
              
              <div className="bg-finance-100 p-4 rounded-lg flex items-center gap-3">
                <div className="bg-finance-200 p-3 rounded-full text-finance-700">
                  <Calculator size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tax Amount</p>
                  <p className="text-lg font-bold text-finance-700">₹{Math.round(totalTaxAmount).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="bg-finance-100 p-4 rounded-lg flex items-center gap-3">
                <div className="bg-finance-200 p-3 rounded-full text-finance-700">
                  <PieChart size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Effective Rate</p>
                  <p className="text-lg font-bold text-finance-700">{effectiveTaxRate.toFixed(2)}%</p>
                </div>
              </div>
            </div>
            
            <div className="overflow-auto max-h-48 border rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Income Bracket
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tax Rate
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Taxable Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tax
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {taxBreakdown.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                        {item.bracket}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                        {item.rate}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                        ₹{Math.round(item.taxable).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-finance-700">
                        ₹{Math.round(item.tax).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex items-start gap-2 bg-finance-100 p-4 rounded-lg text-sm">
              <Info className="text-finance-700 mt-0.5 h-5 w-5 flex-shrink-0" />
              <p className="text-gray-600">
                This is a simplified tax calculator and does not account for all deductions, exemptions, surcharges, 
                or cess that may apply to your specific situation. For accurate tax planning, consult a tax professional.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaxBracket;
