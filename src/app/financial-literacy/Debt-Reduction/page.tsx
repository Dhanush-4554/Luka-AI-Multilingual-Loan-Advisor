"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Info, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Debt {
  id: string;
  name: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
}

const DebtReduction = () => {
  const { toast } = useToast();
  const [debts, setDebts] = useState<Debt[]>([
    { id: "1", name: "Credit Card", balance: 10000, interestRate: 18, minimumPayment: 300 },
    { id: "2", name: "Car Loan", balance: 25000, interestRate: 6, minimumPayment: 400 },
  ]);
  const [monthlyPayment, setMonthlyPayment] = useState(1000);
  const [avalancheData, setAvalancheData] = useState<any[]>([]);
  const [snowballData, setSnowballData] = useState<any[]>([]);
  const [comparativeData, setComparativeData] = useState<any[]>([]);

  const addDebt = () => {
    const newDebt: Debt = {
      id: Date.now().toString(),
      name: "New Debt",
      balance: 5000,
      interestRate: 10,
      minimumPayment: 100
    };
    setDebts([...debts, newDebt]);
  };

  const removeDebt = (id: string) => {
    if (debts.length > 1) {
      setDebts(debts.filter(debt => debt.id !== id));
    } else {
      toast({
        title: "Cannot Remove All Debts",
        description: "You need at least one debt to calculate repayment strategies.",
        variant: "destructive"
      });
    }
  };

  const updateDebt = (index: number, field: keyof Debt, value: string | number) => {
    const updatedDebts = [...debts];
    updatedDebts[index] = {
      ...updatedDebts[index],
      [field]: typeof value === 'string' && field !== 'name' ? parseFloat(value) : value
    };
    setDebts(updatedDebts);
  };

  const calculateRepayment = () => {
    // Sort by interest rate (highest to lowest) for avalanche
    const avalancheOrder = [...debts].sort((a, b) => b.interestRate - a.interestRate);
    // Sort by balance (lowest to highest) for snowball
    const snowballOrder = [...debts].sort((a, b) => a.balance - b.balance);
    
    const avalancheResult = simulateStrategy(avalancheOrder);
    const snowballResult = simulateStrategy(snowballOrder);
    
    setAvalancheData(avalancheResult.monthlyData);
    setSnowballData(snowballResult.monthlyData);
    
    setComparativeData([
      {
        name: "Avalanche",
        months: avalancheResult.totalMonths,
        totalInterest: avalancheResult.totalInterest,
        totalPaid: avalancheResult.totalPaid
      },
      {
        name: "Snowball",
        months: snowballResult.totalMonths,
        totalInterest: snowballResult.totalInterest,
        totalPaid: snowballResult.totalPaid
      }
    ]);
    
    toast({
      title: "Debt Repayment Calculated",
      description: `Avalanche: ${avalancheResult.totalMonths} months. Snowball: ${snowballResult.totalMonths} months.`
    });
  };

  const simulateStrategy = (debtOrder: Debt[]) => {
    let debtsCopy = debtOrder.map(debt => ({...debt}));
    let monthlyData = [];
    let month = 0;
    let totalInterest = 0;
    let totalPaid = 0;
    
    while (debtsCopy.some(debt => debt.balance > 0) && month < 600) { // Limit to 50 years to prevent infinite loops
      month++;
      let remainingPayment = monthlyPayment;
      let monthTotalBalance = 0;
      
      // Pay minimum on all debts
      debtsCopy.forEach(debt => {
        if (debt.balance > 0) {
          const interest = (debt.balance * (debt.interestRate / 100)) / 12;
          totalInterest += interest;
          debt.balance += interest;
          
          const actualMinPayment = Math.min(debt.minimumPayment, debt.balance);
          debt.balance -= actualMinPayment;
          remainingPayment -= actualMinPayment;
          totalPaid += actualMinPayment;
        }
      });
      
      // Apply remaining payment to priority debt
      for (let debt of debtsCopy) {
        if (debt.balance > 0 && remainingPayment > 0) {
          const extraPayment = Math.min(remainingPayment, debt.balance);
          debt.balance -= extraPayment;
          remainingPayment -= extraPayment;
          totalPaid += extraPayment;
          
          if (remainingPayment <= 0) break;
        }
      }
      
      // Calculate total balance for this month
      debtsCopy.forEach(debt => {
        monthTotalBalance += Math.max(0, debt.balance);
      });
      
      monthlyData.push({
        month,
        totalBalance: Math.round(monthTotalBalance)
      });
      
      // If all debts are paid off, break the loop
      if (monthTotalBalance <= 0) break;
    }
    
    return {
      totalMonths: month,
      totalInterest: Math.round(totalInterest),
      totalPaid: Math.round(totalPaid),
      monthlyData
    };
  };

  useEffect(() => {
    calculateRepayment();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">Debt Reduction Visualizer</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Compare different debt payoff strategies (avalanche vs. snowball) with visual timelines 
          showing balance reduction and interest saved.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="finance-card lg:col-span-1 animate-scale-in">
          <CardHeader>
            <CardTitle>Your Debts</CardTitle>
            <CardDescription>Enter your current debts to compare payoff strategies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>Monthly Payment Available</Label>
              <Input 
                type="number" 
                min="0" 
                value={monthlyPayment} 
                onChange={(e) => setMonthlyPayment(Number(e.target.value))}
                className="input-field"
              />
            </div>
            
            <div className="space-y-4">
              <Label>Your Debts</Label>
              {debts.map((debt, index) => (
                <div key={debt.id} className="space-y-2 p-3 border border-finance-200 rounded-md">
                  <div className="flex justify-between">
                    <Input 
                      value={debt.name} 
                      onChange={(e) => updateDebt(index, 'name', e.target.value)}
                      className="input-field mb-2"
                      placeholder="Debt name"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeDebt(debt.id)}
                      className="ml-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor={`balance-${debt.id}`} className="text-xs">Balance</Label>
                      <Input 
                        id={`balance-${debt.id}`}
                        type="number" 
                        min="0" 
                        value={debt.balance} 
                        onChange={(e) => updateDebt(index, 'balance', e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`interest-${debt.id}`} className="text-xs">Interest Rate (%)</Label>
                      <Input 
                        id={`interest-${debt.id}`}
                        type="number" 
                        min="0" 
                        max="100" 
                        step="0.1"
                        value={debt.interestRate} 
                        onChange={(e) => updateDebt(index, 'interestRate', e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor={`min-payment-${debt.id}`} className="text-xs">Minimum Payment</Label>
                      <Input 
                        id={`min-payment-${debt.id}`}
                        type="number" 
                        min="0" 
                        value={debt.minimumPayment} 
                        onChange={(e) => updateDebt(index, 'minimumPayment', e.target.value)}
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={addDebt}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Another Debt
              </Button>
            </div>
            
            <Button className="w-full finance-btn" onClick={calculateRepayment}>
              Calculate Repayment Plans
            </Button>
          </CardContent>
        </Card>
        
        <Card className="finance-card lg:col-span-2 animate-scale-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle>Payoff Strategy Comparison</CardTitle>
            <CardDescription>See how different strategies affect your debt payoff timeline and interest paid</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="comparison">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="comparison">Comparison</TabsTrigger>
                <TabsTrigger value="avalanche">Avalanche Strategy</TabsTrigger>
                <TabsTrigger value="snowball">Snowball Strategy</TabsTrigger>
              </TabsList>
              
              <TabsContent value="comparison" className="space-y-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis label={{ value: 'Months', position: 'insideBottomRight', offset: -10 }} />
                      <YAxis tickFormatter={(value) => `$${value/1000}k`} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="totalBalance" 
                        name="Avalanche" 
                        data={avalancheData} 
                        stroke="#0FA0CE" 
                        strokeWidth={2} 
                        dot={false} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="totalBalance" 
                        name="Snowball" 
                        data={snowballData} 
                        stroke="#33C3F0" 
                        strokeWidth={2} 
                        dot={false} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {comparativeData.map((strategy) => (
                    <div key={strategy.name} className="bg-finance-100 p-4 rounded-lg">
                      <h3 className="font-semibold text-lg mb-2">{strategy.name} Strategy</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-600">Payoff Time</p>
                          <p className="font-bold text-finance-700">{strategy.months} months</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Total Interest</p>
                          <p className="font-bold text-finance-700">{formatCurrency(strategy.totalInterest)}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-gray-600">Total Amount Paid</p>
                          <p className="font-bold text-finance-700">{formatCurrency(strategy.totalPaid)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="avalanche" className="space-y-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={avalancheData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" label={{ value: 'Months', position: 'insideBottomRight', offset: -10 }} />
                      <YAxis tickFormatter={(value) => `$${value/1000}k`} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="totalBalance" 
                        name="Remaining Balance" 
                        stroke="#0FA0CE" 
                        strokeWidth={2} 
                        dot={false} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="bg-finance-100 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Avalanche Strategy</h3>
                  <p className="text-gray-600 text-sm">
                    The Avalanche method prioritizes debts with the highest interest rates first. 
                    This approach minimizes the total interest paid and is mathematically optimal 
                    for saving money.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="snowball" className="space-y-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={snowballData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" label={{ value: 'Months', position: 'insideBottomRight', offset: -10 }} />
                      <YAxis tickFormatter={(value) => `$${value/1000}k`} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="totalBalance" 
                        name="Remaining Balance" 
                        stroke="#33C3F0" 
                        strokeWidth={2} 
                        dot={false} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="bg-finance-100 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Snowball Strategy</h3>
                  <p className="text-gray-600 text-sm">
                    The Snowball method prioritizes debts with the smallest balances first. 
                    This approach provides psychological wins as debts are paid off more quickly, 
                    which can help maintain motivation.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex items-start gap-2 bg-finance-100 p-4 rounded-lg text-sm">
              <Info className="text-finance-700 mt-0.5 h-5 w-5 flex-shrink-0" />
              <p className="text-gray-600">
                <span className="font-medium">Debt Avalanche vs. Snowball:</span> The Avalanche method saves 
                more money by targeting high-interest debt first, while the Snowball method can provide 
                psychological wins by eliminating smaller debts quickly. Choose the strategy that works 
                best for your financial situation and personal motivation.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DebtReduction;
