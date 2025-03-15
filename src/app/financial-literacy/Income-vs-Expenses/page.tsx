"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, DollarSign, ArrowRight, TrendingDown, TrendingUp, Info } from "lucide-react";
import { Sankey, Tooltip, Rectangle, ResponsiveContainer } from "recharts";

interface FlowItem {
  id: string;
  name: string;
  value: number;
  type: "income" | "expense";
  category?: string;
}

interface SankeyNode {
  name: string;
}

interface SankeyLink {
  source: number;
  target: number;
  value: number;
  sourceName?: string;
  targetName?: string;
}

const IncomeVsExpenses = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<FlowItem[]>([
    { id: "1", name: "Salary", value: 50000, type: "income" },
    { id: "2", name: "Freelance", value: 15000, type: "income" },
    { id: "3", name: "Rent", value: 15000, type: "expense", category: "Housing" },
    { id: "4", name: "Groceries", value: 8000, type: "expense", category: "Food" },
    { id: "5", name: "Utilities", value: 3000, type: "expense", category: "Housing" },
    { id: "6", name: "Dining Out", value: 5000, type: "expense", category: "Food" },
    { id: "7", name: "Transportation", value: 4000, type: "expense", category: "Transport" },
    { id: "8", name: "Entertainment", value: 3000, type: "expense", category: "Leisure" },
    { id: "9", name: "Shopping", value: 6000, type: "expense", category: "Discretionary" },
    { id: "10", name: "Savings", value: 10000, type: "expense", category: "Savings" },
    { id: "11", name: "Insurance", value: 2000, type: "expense", category: "Financial" },
    { id: "12", name: "Investments", value: 5000, type: "expense", category: "Financial" },
  ]);
  
  const [newItemName, setNewItemName] = useState("");
  const [newItemValue, setNewItemValue] = useState(0);
  const [newItemType, setNewItemType] = useState<"income" | "expense">("income");
  const [newItemCategory, setNewItemCategory] = useState("Miscellaneous");
  
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [netCashflow, setNetCashflow] = useState(0);
  
  const [sankeyData, setSankeyData] = useState<{nodes: SankeyNode[], links: SankeyLink[]}>({
    nodes: [],
    links: []
  });
  
  const expenseCategories = [
    "Housing", "Food", "Transport", "Utilities", "Healthcare", 
    "Leisure", "Discretionary", "Financial", "Savings", "Miscellaneous"
  ];
  
  // Calculate totals and prepare chart data
  const calculateFlows = () => {
    const income = items.filter(item => item.type === "income").reduce((sum, item) => sum + item.value, 0);
    const expense = items.filter(item => item.type === "expense").reduce((sum, item) => sum + item.value, 0);
    const net = income - expense;
    
    setTotalIncome(income);
    setTotalExpense(expense);
    setNetCashflow(net);
    
    // Prepare data for Sankey diagram
    prepareSankeyData();
  };
  
  const prepareSankeyData = () => {
    const nodes: SankeyNode[] = [];
    const links: SankeyLink[] = [];
    
    // Add "Total Income" node
    nodes.push({ name: "Total Income" });
    
    // Add individual income sources and link to "Total Income"
    const incomeItems = items.filter(item => item.type === "income");
    incomeItems.forEach(income => {
      const nodeIndex = nodes.length;
      nodes.push({ name: income.name });
      links.push({
        source: nodeIndex,
        target: 0, // "Total Income" node
        value: income.value,
        sourceName: income.name,
        targetName: "Total Income"
      });
    });
    
    // Add expense categories
    const usedCategories = new Set<string>();
    items.filter(item => item.type === "expense").forEach(expense => {
      const category = expense.category || "Miscellaneous";
      usedCategories.add(category);
    });
    
    const categoryNodes: Record<string, number> = {};
    usedCategories.forEach(category => {
      const nodeIndex = nodes.length;
      nodes.push({ name: category });
      categoryNodes[category] = nodeIndex;
      
      // Link from "Total Income" to each category
      const categoryTotal = items
        .filter(item => item.type === "expense" && (item.category || "Miscellaneous") === category)
        .reduce((sum, item) => sum + item.value, 0);
        
      links.push({
        source: 0, // "Total Income" node
        target: nodeIndex,
        value: categoryTotal,
        sourceName: "Total Income",
        targetName: category
      });
    });
    
    // Add expense items and link to their categories
    const expenseItems = items.filter(item => item.type === "expense");
    expenseItems.forEach(expense => {
      const category = expense.category || "Miscellaneous";
      const categoryNodeIndex = categoryNodes[category];
      
      const nodeIndex = nodes.length;
      nodes.push({ name: expense.name });
      
      links.push({
        source: categoryNodeIndex,
        target: nodeIndex,
        value: expense.value,
        sourceName: category,
        targetName: expense.name
      });
    });
    
    setSankeyData({ nodes, links });
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
    
    const newItem: FlowItem = {
      id: Date.now().toString(),
      name: newItemName,
      value: newItemValue,
      type: newItemType,
      category: newItemType === "expense" ? newItemCategory : undefined
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
      description: "Item has been removed from your cash flow",
    });
  };
  
  useEffect(() => {
    calculateFlows();
  }, [items]);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Custom Sankey node
  const CustomNode = ({ x, y, width, height, index, payload }: any) => {
    const isIncome = payload.name === "Total Income" || 
                     items.some(item => item.type === "income" && item.name === payload.name);
    
    const colorsByCategory: Record<string, string> = {
      "Housing": "#FF8042",
      "Food": "#FFBB28",
      "Transport": "#00C49F",
      "Utilities": "#0088FE",
      "Healthcare": "#CD1E1E",
      "Leisure": "#8884D8",
      "Discretionary": "#FF6B6B",
      "Financial": "#82CA9D",
      "Savings": "#9CB464",
      "Miscellaneous": "#AAAAAA",
      "Total Income": "#4CAF50",
      "Income": "#4CAF50"
    };
    
    let fill;
    
    if (isIncome) {
      fill = colorsByCategory["Income"];
    } else if (expenseCategories.includes(payload.name)) {
      fill = colorsByCategory[payload.name] || "#AAAAAA";
    } else {
      // Individual expense item, try to get color from its category
      const item = items.find(item => item.name === payload.name);
      const category = item?.category || "Miscellaneous";
      fill = colorsByCategory[category] || "#AAAAAA";
    }
    
    return (
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        fillOpacity="0.9"
      />
    );
  };
  
  // Custom Sankey tooltip
  const renderTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
          <p className="text-sm font-semibold">{data.sourceName} → {data.targetName}</p>
          <p className="text-xs font-medium">{formatCurrency(data.value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">Income vs. Expenses Flowchart</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Visualize your monthly cash flow to understand where your money comes from and where it goes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="finance-card animate-scale-in">
            <CardHeader>
              <CardTitle>Cash Flow Visualization</CardTitle>
              <CardDescription>Sankey diagram showing your money flow</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <Sankey
                    data={sankeyData}
                    node={<CustomNode />}
                    link={{ stroke: "#d0d0d0" }}
                    nodePadding={10}
                    margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                  >
                    <Tooltip content={renderTooltip} />
                  </Sankey>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-finance-100 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-green-500">
                      <TrendingUp size={18} />
                    </div>
                    <p className="text-gray-600 text-sm">Total Income</p>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(totalIncome)}
                  </p>
                </div>
                <div className="bg-finance-100 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-red-500">
                      <TrendingDown size={18} />
                    </div>
                    <p className="text-gray-600 text-sm">Total Expenses</p>
                  </div>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(totalExpense)}
                  </p>
                </div>
                <div className="bg-finance-100 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={netCashflow >= 0 ? "text-green-500" : "text-red-500"}>
                      <DollarSign size={18} />
                    </div>
                    <p className="text-gray-600 text-sm">Net Cash Flow</p>
                  </div>
                  <p className={`text-2xl font-bold ${netCashflow >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatCurrency(netCashflow)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2 bg-finance-100 p-4 rounded-lg text-sm">
                <Info className="text-finance-700 mt-0.5 h-5 w-5 flex-shrink-0" />
                <div className="text-gray-600">
                  <p className="mb-2">This Sankey diagram helps you visualize your cash flow by showing the relationships between your income sources and expense categories.</p>
                  <p>The width of each flow corresponds to the amount of money. Analyzing this can help identify areas where you might reduce spending.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="finance-card animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle>Add New Cash Flow Item</CardTitle>
              <CardDescription>Record your income sources and expenses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="item-name">Item Name</Label>
                <Input 
                  id="item-name" 
                  placeholder="E.g., Salary, Rent, Groceries" 
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="item-value">Monthly Amount (₹)</Label>
                <Input 
                  id="item-value" 
                  type="number" 
                  min="0"
                  placeholder="Enter amount" 
                  value={newItemValue}
                  onChange={(e) => setNewItemValue(Number(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Item Type</Label>
                <div className="flex gap-2">
                  <Button 
                    variant={newItemType === "income" ? "default" : "outline"}
                    className={newItemType === "income" ? "bg-green-600 hover:bg-green-700" : ""}
                    onClick={() => setNewItemType("income")}
                  >
                    Income
                  </Button>
                  <Button 
                    variant={newItemType === "expense" ? "default" : "outline"}
                    className={newItemType === "expense" ? "bg-red-600 hover:bg-red-700" : ""}
                    onClick={() => setNewItemType("expense")}
                  >
                    Expense
                  </Button>
                </div>
              </div>
              
              {newItemType === "expense" && (
                <div className="space-y-2">
                  <Label htmlFor="item-category">Expense Category</Label>
                  <select 
                    id="item-category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                  >
                    {expenseCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              )}
              
              <Button onClick={addItem} className="w-full mt-2 flex items-center gap-2">
                <Plus size={18} />
                Add {newItemType === "income" ? "Income" : "Expense"}
              </Button>
            </CardContent>
          </Card>
          
          <Card className="finance-card animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle>Manage Items</CardTitle>
              <CardDescription>Edit or remove your cash flow items</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-semibold text-green-600">Income Sources</h3>
                {items.filter(item => item.type === "income").map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-green-50 rounded-md">
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
                
                <Separator className="my-3" />
                
                <h3 className="font-semibold text-red-600">Expenses</h3>
                {items.filter(item => item.type === "expense").map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-red-50 rounded-md">
                    <div>
                      <span className="font-medium text-gray-800">{item.name}</span>
                      <span className="text-xs ml-2 text-gray-500">({item.category})</span>
                    </div>
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
      </div>
    </div>
  );
};

export default IncomeVsExpenses;
