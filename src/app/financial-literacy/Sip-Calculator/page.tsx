"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Info } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const SipCalculator = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [years, setYears] = useState(10);
  const [chartData, setChartData] = useState<{
    year: number;
    investment: number;
    totalValue: number;
    returns: number;
  }[]>([]);
  const [donutData, setDonutData] = useState<{name: string; value: number}[]>([]);

  const COLORS = ["#0FA0CE", "#33C3F0"];

  const calculateSIP = () => {
    const monthlyRate = annualReturn / 100 / 12;
    const months = years * 12;
    const chartData = [];

    for (let i = 1; i <= years; i++) {
      const currentMonths = i * 12;
      const totalInvestment = monthlyInvestment * currentMonths;
      const amount = monthlyInvestment * ((Math.pow(1 + monthlyRate, currentMonths) - 1) / monthlyRate) * (1 + monthlyRate);
      const returns = amount - totalInvestment;

      chartData.push({
        year: i,
        investment: Math.round(totalInvestment),
        totalValue: Math.round(amount),
        returns: Math.round(returns)
      });
    }

    setChartData(chartData);
    
    // Create donut chart data
    const finalValues = chartData[chartData.length - 1];
    setDonutData([
      { name: "Principal", value: finalValues.investment },
      { name: "Returns", value: finalValues.returns }
    ]);
    
    toast({
      title: "SIP Calculation Complete",
      description: `After ${years} years, your investment of ₹${monthlyInvestment * years * 12} would grow to approximately ₹${Math.round(chartData[chartData.length - 1].totalValue)}`,
    });
  };

  useEffect(() => {
    calculateSIP();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return percent > 0.05 ? (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded-md shadow-sm">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-finance-700">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">SIP Calculator with Growth Chart</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Visualize how small, regular investments grow over time with compound interest.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="finance-card lg:col-span-1 animate-scale-in">
          <CardHeader>
            <CardTitle>Input Parameters</CardTitle>
            <CardDescription>Adjust the values to see how your investment grows</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="monthly-investment">Monthly Investment (₹)</Label>
                <span className="text-sm text-finance-700 font-medium">{formatCurrency(monthlyInvestment)}</span>
              </div>
              <Input 
                id="monthly-investment" 
                type="number" 
                min="100" 
                max="1000000" 
                value={monthlyInvestment} 
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                className="input-field"
              />
              <Slider 
                value={[monthlyInvestment]} 
                min={500} 
                max={100000} 
                step={500} 
                onValueChange={(value) => setMonthlyInvestment(value[0])} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="annual-return">Expected Annual Return (%)</Label>
                <span className="text-sm text-finance-700 font-medium">{annualReturn}%</span>
              </div>
              <Input 
                id="annual-return" 
                type="number" 
                min="1" 
                max="30" 
                value={annualReturn} 
                onChange={(e) => setAnnualReturn(Number(e.target.value))}
                className="input-field"
              />
              <Slider 
                value={[annualReturn]} 
                min={1} 
                max={30} 
                step={0.5} 
                onValueChange={(value) => setAnnualReturn(value[0])} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="years">Investment Period (Years)</Label>
                <span className="text-sm text-finance-700 font-medium">{years} years</span>
              </div>
              <Input 
                id="years" 
                type="number" 
                min="1" 
                max="40" 
                value={years} 
                onChange={(e) => setYears(Number(e.target.value))}
                className="input-field"
              />
              <Slider 
                value={[years]} 
                min={1} 
                max={40} 
                step={1} 
                onValueChange={(value) => setYears(value[0])} 
              />
            </div>
            
            <Button className="w-full finance-btn" onClick={calculateSIP}>Calculate</Button>
          </CardContent>
        </Card>
        
        <Card className="finance-card lg:col-span-2 animate-scale-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle>Growth Visualization</CardTitle>
            <CardDescription>See how your investment and returns compare</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className={isMobile ? "h-[250px]" : "h-[300px]"}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={isMobile ? 80 : 100}
                    innerRadius={isMobile ? 40 : 60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-finance-100 p-4 rounded-lg text-center">
                <p className="text-gray-600 text-sm">Total Investment</p>
                <p className="text-2xl font-bold text-finance-700">
                  {chartData.length > 0 ? formatCurrency(chartData[chartData.length - 1].investment) : '₹0'}
                </p>
              </div>
              <div className="bg-finance-100 p-4 rounded-lg text-center">
                <p className="text-gray-600 text-sm">Total Returns</p>
                <p className="text-2xl font-bold text-finance-700">
                  {chartData.length > 0 ? formatCurrency(chartData[chartData.length - 1].returns) : '₹0'}
                </p>
              </div>
              <div className="bg-finance-100 p-4 rounded-lg text-center">
                <p className="text-gray-600 text-sm">Total Value</p>
                <p className="text-2xl font-bold text-finance-700">
                  {chartData.length > 0 ? formatCurrency(chartData[chartData.length - 1].totalValue) : '₹0'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-2 bg-finance-100 p-4 rounded-lg text-sm">
              <Info className="text-finance-700 mt-0.5 h-5 w-5 flex-shrink-0" />
              <p className="text-gray-600">
                <span className="font-medium">SIP (Systematic Investment Plan)</span> is an investment strategy where you 
                invest a fixed amount regularly. This calculator shows how compound interest can significantly increase your 
                wealth over time, with the "power of compounding" illustrated in the growth chart.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SipCalculator;
