"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Info, Edit2, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface BudgetCategory {
  name: string;
  percentage: number;
  color: string;
  amount: number;
  editable?: boolean;
}

const BudgetAllocation = () => {
  const { toast } = useToast();
  const [monthlyIncome, setMonthlyIncome] = useState(5000);
  const [activeTab, setActiveTab] = useState("50-30-20");
  const [customCategories, setCustomCategories] = useState<BudgetCategory[]>([
    { name: "Housing", percentage: 30, color: "#1EAEDB", amount: 1500, editable: false },
    { name: "Transportation", percentage: 15, color: "#33C3F0", amount: 750, editable: false },
    { name: "Food", percentage: 15, color: "#79BDFF", amount: 750, editable: false },
    { name: "Utilities", percentage: 10, color: "#A7D0FF", amount: 500, editable: false },
    { name: "Insurance", percentage: 10, color: "#D3E4FD", amount: 500, editable: false },
    { name: "Entertainment", percentage: 10, color: "#0FA0CE", amount: 500, editable: false },
    { name: "Savings", percentage: 10, color: "#F0F8FF", amount: 500, editable: false },
  ]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const budgetRules = {
    "50-30-20": [
      { name: "Needs", percentage: 50, color: "#1EAEDB", amount: monthlyIncome * 0.5 },
      { name: "Wants", percentage: 30, color: "#33C3F0", amount: monthlyIncome * 0.3 },
      { name: "Savings", percentage: 20, color: "#79BDFF", amount: monthlyIncome * 0.2 },
    ],
    "70-20-10": [
      { name: "Living Expenses", percentage: 70, color: "#1EAEDB", amount: monthlyIncome * 0.7 },
      { name: "Debt Repayment", percentage: 20, color: "#33C3F0", amount: monthlyIncome * 0.2 },
      { name: "Savings", percentage: 10, color: "#79BDFF", amount: monthlyIncome * 0.1 },
    ],
    "custom": customCategories
  };

  useEffect(() => {
    updateBudgetAmounts();
  }, [monthlyIncome, activeTab]);

  const updateBudgetAmounts = () => {
    if (activeTab === "custom") {
      const updatedCategories = [...customCategories];
      updatedCategories.forEach(category => {
        category.amount = (category.percentage / 100) * monthlyIncome;
      });
      setCustomCategories(updatedCategories);
    }
  };

  const calculateBudget = () => {
    updateBudgetAmounts();
    
    toast({
      title: "Budget Calculated",
      description: `Your monthly budget of $${monthlyIncome} has been allocated according to the ${activeTab === "custom" ? "Custom" : activeTab} rule.`,
    });
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditValue(customCategories[index].name);
  };

  const saveEdit = () => {
    if (editingIndex !== null) {
      const updatedCategories = [...customCategories];
      updatedCategories[editingIndex].name = editValue;
      setCustomCategories(updatedCategories);
      setEditingIndex(null);
    }
  };

  const updateCategoryPercentage = (index: number, value: number) => {
    const updatedCategories = [...customCategories];
    updatedCategories[index].percentage = value;
    
    // Recalculate total percentage
    const total = updatedCategories.reduce((sum, cat) => sum + cat.percentage, 0);
    
    // Adjust to ensure total is 100%
    if (total !== 100) {
      const diff = 100 - total;
      let remaining = diff;
      
      // Distribute the difference among other categories
      for (let i = 0; i < updatedCategories.length && remaining !== 0; i++) {
        if (i !== index) {
          const adjustment = Math.round((updatedCategories[i].percentage / (total - updatedCategories[index].percentage)) * diff);
          const newPercentage = Math.max(1, updatedCategories[i].percentage + adjustment);
          const actualAdjustment = newPercentage - updatedCategories[i].percentage;
          
          updatedCategories[i].percentage = newPercentage;
          remaining -= actualAdjustment;
          
          if (remaining === 0) break;
        }
      }
      
      // If we still have a remainder, add it to the largest category that isn't being edited
      if (remaining !== 0) {
        let largestIdx = index === 0 ? 1 : 0;
        for (let i = 0; i < updatedCategories.length; i++) {
          if (i !== index && updatedCategories[i].percentage > updatedCategories[largestIdx].percentage) {
            largestIdx = i;
          }
        }
        updatedCategories[largestIdx].percentage += remaining;
      }
    }
    
    // Update amounts based on percentages
    updatedCategories.forEach(category => {
      category.amount = (category.percentage / 100) * monthlyIncome;
    });
    
    setCustomCategories(updatedCategories);
  };

  const addCategory = () => {
    const colors = ["#1EAEDB", "#33C3F0", "#79BDFF", "#A7D0FF", "#D3E4FD", "#0FA0CE", "#F0F8FF"];
    const newCategory: BudgetCategory = {
      name: "New Category",
      percentage: 5,
      color: colors[customCategories.length % colors.length],
      amount: (5 / 100) * monthlyIncome,
      editable: true
    };
    
    // Reduce other categories to make room for new one
    const updatedCategories = [...customCategories];
    const reduction = 5 / updatedCategories.length;
    updatedCategories.forEach(category => {
      category.percentage = Math.max(1, Math.round(category.percentage - reduction));
      category.amount = (category.percentage / 100) * monthlyIncome;
    });
    
    setCustomCategories([...updatedCategories, newCategory]);
  };

  const removeCategory = (index: number) => {
    if (customCategories.length <= 2) {
      toast({
        title: "Cannot Remove Category",
        description: "You need at least two categories in your budget.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedCategories = [...customCategories];
    const removedPercentage = updatedCategories[index].percentage;
    updatedCategories.splice(index, 1);
    
    // Redistribute the removed percentage
    const perCategoryIncrease = removedPercentage / updatedCategories.length;
    updatedCategories.forEach(category => {
      category.percentage += Math.round(perCategoryIncrease);
      category.amount = (category.percentage / 100) * monthlyIncome;
    });
    
    // Adjust to ensure total is 100%
    const total = updatedCategories.reduce((sum, cat) => sum + cat.percentage, 0);
    if (total !== 100) {
      updatedCategories[0].percentage += (100 - total);
      updatedCategories[0].amount = (updatedCategories[0].percentage / 100) * monthlyIncome;
    }
    
    setCustomCategories(updatedCategories);
  };

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
        <h1 className="text-3xl font-bold text-gray-800">Budget Allocation Pie Chart</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Interactive pie chart where you can enter your income and see recommended 
          budget allocations across different categories.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="finance-card lg:col-span-1 animate-scale-in">
          <CardHeader>
            <CardTitle>Your Income</CardTitle>
            <CardDescription>Enter your monthly income to see budget recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="monthly-income">Monthly Income (After Tax)</Label>
              <Input 
                id="monthly-income" 
                type="number" 
                min="0" 
                value={monthlyIncome} 
                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                className="input-field"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Budget Strategy</Label>
              <Tabs 
                defaultValue="50-30-20" 
                className="w-full"
                onValueChange={setActiveTab}
              >
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="50-30-20">50/30/20</TabsTrigger>
                  <TabsTrigger value="70-20-10">70/20/10</TabsTrigger>
                  <TabsTrigger value="custom">Custom</TabsTrigger>
                </TabsList>
                <TabsContent value="50-30-20" className="space-y-4 mt-4">
                  <div className="bg-finance-100 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">
                      The 50/30/20 rule suggests allocating:
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                      <li><span className="font-medium">50%</span> to needs (housing, food, utilities)</li>
                      <li><span className="font-medium">30%</span> to wants (entertainment, shopping)</li>
                      <li><span className="font-medium">20%</span> to savings and debt repayment</li>
                    </ul>
                  </div>
                </TabsContent>
                <TabsContent value="70-20-10" className="space-y-4 mt-4">
                  <div className="bg-finance-100 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">
                      The 70/20/10 rule suggests allocating:
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                      <li><span className="font-medium">70%</span> to living expenses</li>
                      <li><span className="font-medium">20%</span> to debt repayment</li>
                      <li><span className="font-medium">10%</span> to savings and investments</li>
                    </ul>
                  </div>
                </TabsContent>
                <TabsContent value="custom" className="space-y-4 mt-4">
                  <div className="space-y-3">
                    {customCategories.map((category, index) => (
                      <div key={index} className="flex items-center gap-2 bg-finance-100 p-3 rounded-lg">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        {editingIndex === index ? (
                          <div className="flex-grow flex items-center gap-2">
                            <Input 
                              value={editValue} 
                              onChange={(e) => setEditValue(e.target.value)}
                              className="input-field h-8 py-1"
                            />
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={saveEdit}
                              className="h-8 w-8"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex-grow flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{category.name}</span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => startEditing(index)}
                                className="h-6 w-6 p-0"
                              >
                                <Edit2 className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-2">
                              <Input 
                                type="number" 
                                value={category.percentage} 
                                onChange={(e) => updateCategoryPercentage(index, Number(e.target.value))}
                                className="w-14 h-7 py-0 px-2 text-center"
                                min="1"
                                max="99"
                              />
                              <span className="text-xs">%</span>
                            </div>
                          </div>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeCategory(index)}
                          className="h-6 w-6 text-gray-400 hover:text-red-500"
                        >
                          &times;
                        </Button>
                      </div>
                    ))}
                    
                    <Button 
                      variant="outline" 
                      className="w-full text-sm text-white bg-green-400 hover:bg-green-500"
                      onClick={addCategory}
                    >
                      Add Category
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <Button className="w-full finance-btn" onClick={calculateBudget}>
              Calculate Budget
            </Button>
            
            <div className="flex items-start gap-2 bg-finance-100 p-4 rounded-lg text-sm">
              <Info className="text-finance-700 mt-0.5 h-5 w-5 flex-shrink-0" />
              <p className="text-gray-600">
                A good budget helps you track spending, save money, and reduce financial stress. 
                Choose a budgeting method that fits your financial goals and lifestyle.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="finance-card lg:col-span-2 animate-scale-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle>Budget Allocation</CardTitle>
            <CardDescription>
              Visual breakdown of your recommended monthly budget
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={budgetRules[activeTab as keyof typeof budgetRules]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="amount"
                    nameKey="name"
                    label={({ name, percentage }) => `${name} (${percentage}%)`}
                    animationDuration={1000}
                    animationBegin={200}
                  >
                    {budgetRules[activeTab as keyof typeof budgetRules].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => formatCurrency(Number(value))}
                    contentStyle={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #D3E4FD" }}
                  />
                  <Legend layout="vertical" align="right" verticalAlign="middle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {budgetRules[activeTab as keyof typeof budgetRules].map((category) => (
                <div key={category.name} className="bg-finance-100 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    <h3 className="font-semibold">{category.name}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-600">Percentage</p>
                      <p className="font-bold text-finance-700">{category.percentage}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Amount</p>
                      <p className="font-bold text-finance-700">{formatCurrency(category.amount)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className={cn(
              "w-full h-6 rounded-full overflow-hidden relative",
              "bg-gray-200 transition-all duration-1000"
            )}>
              {budgetRules[activeTab as keyof typeof budgetRules].map((category, index) => {
                const previousWidth = budgetRules[activeTab as keyof typeof budgetRules]
                  .slice(0, index)
                  .reduce((sum, cat) => sum + cat.percentage, 0);
                
                return (
                  <div
                    key={index}
                    className="absolute top-0 bottom-0 transition-all duration-1000"
                    style={{
                      left: `${previousWidth}%`,
                      width: `${category.percentage}%`,
                      backgroundColor: category.color
                    }}
                  />
                );
              })}
            </div>
            
            <div className="flex items-start gap-2 bg-finance-100 p-4 rounded-lg text-sm">
              <Info className="text-finance-700 mt-0.5 h-5 w-5 flex-shrink-0" />
              <div className="text-gray-600">
                <p className="mb-2">
                  <span className="font-medium">Budgeting Tips:</span>
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Track your spending for a month to understand your habits</li>
                  <li>Adjust categories to match your personal priorities</li>
                  <li>Review and update your budget regularly as your income changes</li>
                  <li>Use the "pay yourself first" method by automating savings</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BudgetAllocation;
