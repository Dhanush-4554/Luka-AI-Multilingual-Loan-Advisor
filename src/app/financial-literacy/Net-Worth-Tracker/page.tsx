"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Info, Plus, Trash2, Wallet, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";

interface AssetLiability {
  id: string;
  name: string;
  value: number;
  type: "asset" | "liability";
}

interface NetWorthSnapshot {
  date: string;
  assets: number;
  liabilities: number;
  netWorth: number;
}

const NetWorthTracker = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<AssetLiability[]>([
    { id: "1", name: "Cash", value: 50000, type: "asset" },
    { id: "2", name: "Investments", value: 100000, type: "asset" },
    { id: "3", name: "Property", value: 2500000, type: "asset" },
    { id: "4", name: "Car Loan", value: 300000, type: "liability" },
    { id: "5", name: "Credit Card", value: 25000, type: "liability" },
  ]);
  
  const [newItemName, setNewItemName] = useState("");
  const [newItemValue, setNewItemValue] = useState(0);
  const [newItemType, setNewItemType] = useState<"asset" | "liability">("asset");
  
  const [history, setHistory] = useState<NetWorthSnapshot[]>([]);
  const [totalAssets, setTotalAssets] = useState(0);
  const [totalLiabilities, setTotalLiabilities] = useState(0);
  const [netWorth, setNetWorth] = useState(0);
  
  // Calculate net worth based on items
  const calculateNetWorth = () => {
    let assets = 0;
    let liabilities = 0;
    
    items.forEach(item => {
      if (item.type === "asset") {
        assets += item.value;
      } else {
        liabilities += item.value;
      }
    });
    
    const worth = assets - liabilities;
    
    setTotalAssets(assets);
    setTotalLiabilities(liabilities);
    setNetWorth(worth);
    
    return { assets, liabilities, netWorth: worth };
  };
  
  // Add new item
  const addItem = () => {
    if (!newItemName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for the item",
        variant: "destructive",
      });
      return;
    }
    
    if (newItemValue <= 0) {
      toast({
        title: "Error",
        description: "Please enter a value greater than 0",
        variant: "destructive",
      });
      return;
    }
    
    const newItem: AssetLiability = {
      id: Date.now().toString(),
      name: newItemName,
      value: newItemValue,
      type: newItemType,
    };
    
    setItems([...items, newItem]);
    setNewItemName("");
    setNewItemValue(0);
    
    toast({
      title: "Item Added",
      description: `Added ${newItemName} as a ${newItemType}`,
    });
  };
  
  // Remove item
  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    
    toast({
      title: "Item Removed",
      description: "Item has been removed from your net worth calculation",
    });
  };
  
  // Record snapshot of current net worth
  const recordSnapshot = () => {
    const { assets, liabilities, netWorth } = calculateNetWorth();
    const today = new Date().toISOString().split('T')[0];
    
    // Check if we already have a snapshot for today
    const existingIndex = history.findIndex(snap => snap.date === today);
    
    if (existingIndex >= 0) {
      // Update existing snapshot
      const updatedHistory = [...history];
      updatedHistory[existingIndex] = { date: today, assets, liabilities, netWorth };
      setHistory(updatedHistory);
    } else {
      // Add new snapshot
      setHistory([...history, { date: today, assets, liabilities, netWorth }]);
    }
    
    toast({
      title: "Snapshot Recorded",
      description: `Your net worth of ₹${netWorth.toLocaleString()} has been recorded`,
    });
  };
  
  useEffect(() => {
    calculateNetWorth();
  }, [items]);
  
  useEffect(() => {
    // Initialize with some demo history data if not available
    if (history.length === 0) {
      const demoData: NetWorthSnapshot[] = [];
      const today = new Date();
      
      for (let i = 5; i >= 0; i--) {
        const date = new Date(today);
        date.setMonth(today.getMonth() - i);
        
        const monthDate = date.toISOString().split('T')[0];
        const baseAssets = 2500000 + (100000 * (5-i));
        const baseLiabilities = 400000 - (15000 * (5-i));
        
        demoData.push({
          date: monthDate,
          assets: baseAssets,
          liabilities: baseLiabilities,
          netWorth: baseAssets - baseLiabilities
        });
      }
      
      setHistory(demoData);
    }
  }, []);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Get change percentage from previous snapshot
  const getChangePercentage = () => {
    if (history.length < 2) return { value: 0, isPositive: true };
    
    const currentWorth = history[history.length - 1].netWorth;
    const previousWorth = history[history.length - 2].netWorth;
    
    const change = ((currentWorth - previousWorth) / Math.abs(previousWorth)) * 100;
    return { 
      value: Math.abs(change),
      isPositive: change >= 0
    };
  };
  
  const change = getChangePercentage();

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">Net Worth Tracker</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Track your assets and liabilities to visualize your financial progress over time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="finance-card animate-scale-in">
            <CardHeader>
              <CardTitle>Net Worth Trends</CardTitle>
              <CardDescription>Visualize your financial journey over time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={history}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={(value) => `₹${value/100000}L`} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="assets" 
                      stackId="1" 
                      stroke="#4CAF50" 
                      fill="#4CAF50" 
                      name="Assets" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="liabilities" 
                      stackId="2" 
                      stroke="#F44336" 
                      fill="#F44336" 
                      name="Liabilities" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="netWorth" 
                      stroke="#2196F3" 
                      fill="#2196F3" 
                      name="Net Worth" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-finance-100 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-green-500">
                      <Wallet size={18} />
                    </div>
                    <p className="text-gray-600 text-sm">Total Assets</p>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(totalAssets)}
                  </p>
                </div>
                <div className="bg-finance-100 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-red-500">
                      <Wallet size={18} />
                    </div>
                    <p className="text-gray-600 text-sm">Total Liabilities</p>
                  </div>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(totalLiabilities)}
                  </p>
                </div>
                <div className="bg-finance-100 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-blue-500">
                      <TrendingUp size={18} />
                    </div>
                    <p className="text-gray-600 text-sm">Net Worth</p>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(netWorth)}
                  </p>
                  {history.length >= 2 && (
                    <div className={`flex items-center text-sm mt-1 ${change.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {change.isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                      <span>{change.value.toFixed(1)}% from last record</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={recordSnapshot} className="finance-btn">
                  Record Current Snapshot
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="finance-card animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle>Assets & Liabilities</CardTitle>
              <CardDescription>Manage your financial items</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-green-600">Assets</h3>
                {items.filter(item => item.type === "asset").map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="font-medium text-gray-800">{item.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-green-600">{formatCurrency(item.value)}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeItem(item.id)}
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Separator />
                
                <h3 className="font-semibold text-lg text-red-600">Liabilities</h3>
                {items.filter(item => item.type === "liability").map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <span className="font-medium text-gray-800">{item.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-red-600">{formatCurrency(item.value)}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeItem(item.id)}
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="finance-card animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle>Add New Item</CardTitle>
              <CardDescription>Enter details about your asset or liability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="item-name">Item Name</Label>
                <Input 
                  id="item-name" 
                  placeholder="E.g., Savings Account, Home Loan" 
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="item-value">Value (₹)</Label>
                <Input 
                  id="item-value" 
                  type="number" 
                  min="0"
                  placeholder="Enter value" 
                  value={newItemValue}
                  onChange={(e) => setNewItemValue(Number(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Item Type</Label>
                <div className="flex gap-2">
                  <Button 
                    variant={newItemType === "asset" ? "default" : "outline"}
                    className={newItemType === "asset" ? "bg-green-600 hover:bg-green-700" : ""}
                    onClick={() => setNewItemType("asset")}
                  >
                    Asset
                  </Button>
                  <Button 
                    variant={newItemType === "liability" ? "default" : "outline"}
                    className={newItemType === "liability" ? "bg-red-600 hover:bg-red-700" : ""}
                    onClick={() => setNewItemType("liability")}
                  >
                    Liability
                  </Button>
                </div>
              </div>
              
              <Button onClick={addItem} className="w-full mt-2 flex items-center gap-2">
                <Plus size={18} />
                Add {newItemType === "asset" ? "Asset" : "Liability"}
              </Button>
            </CardContent>
          </Card>
          
          <Card className="finance-card animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-4">
              <div className="flex items-start gap-2 bg-finance-100 p-4 rounded-lg text-sm">
                <Info className="text-finance-700 mt-0.5 h-5 w-5 flex-shrink-0" />
                <div className="text-gray-600">
                  <p className="font-semibold mb-2">What is Net Worth?</p>
                  <p className="mb-2">Your net worth is the difference between your assets (what you own) and liabilities (what you owe).</p>
                  <p className="mb-2">Tracking your net worth over time helps you visualize your financial progress and make better decisions.</p>
                  <p>A growing net worth indicates you're building wealth, while a declining one may signal the need to adjust your financial strategy.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NetWorthTracker;
