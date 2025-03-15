"use client";
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import InvestmentProfileForm from "@/components/investment/InvestmentProfileForm";
import InvestmentAllocationChart from "@/components/investment/InvestmentAllocationChart";

interface AllocationItem {
  name: string;
  value: number;
  color: string;
}

const InvestmentDiversification = () => {
  const { toast } = useToast();
  const [age, setAge] = useState(35);
  const [riskTolerance, setRiskTolerance] = useState(3);
  const [timeHorizon, setTimeHorizon] = useState(15);
  const [allocation, setAllocation] = useState<AllocationItem[]>([]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"];

  const getRiskProfile = () => {
    switch (riskTolerance) {
      case 1:
        return "Conservative";
      case 2:
        return "Moderately Conservative";
      case 3:
        return "Moderate";
      case 4:
        return "Moderately Aggressive";
      case 5:
        return "Aggressive";
      default:
        return "Moderate";
    }
  };

  const calculateAllocation = () => {
    // Base allocations that will be adjusted based on inputs
    let stocksAllocation = 60; // Percentage
    let bondsAllocation = 25;
    let cashAllocation = 5;
    let realEstateAllocation = 5;
    let goldAllocation = 3;
    let alternativesAllocation = 2;
    
    // Age adjustments (younger = more stocks, older = more bonds/cash)
    const ageAdjustment = Math.min(Math.max(60 - age, -15), 15); // Limit to -15/+15
    stocksAllocation += ageAdjustment * 0.5;
    bondsAllocation -= ageAdjustment * 0.3;
    cashAllocation -= ageAdjustment * 0.1;
    
    // Risk tolerance adjustments (higher = more stocks/alternatives, lower = more bonds/cash)
    const riskAdjustment = (riskTolerance - 3) * 5; // -10 to +10
    stocksAllocation += riskAdjustment;
    alternativesAllocation += riskAdjustment * 0.2;
    bondsAllocation -= riskAdjustment * 0.8;
    cashAllocation -= riskAdjustment * 0.2;
    
    // Time horizon adjustments (longer = more stocks, shorter = more bonds/cash)
    const horizonAdjustment = (timeHorizon - 10) * 0.5; // -5 to +10
    stocksAllocation += horizonAdjustment;
    bondsAllocation -= horizonAdjustment * 0.6;
    cashAllocation -= horizonAdjustment * 0.4;
    
    // Ensure all values are at least 3% and adjust to total 100%
    const allocations = [
      { name: "Stocks", value: Math.max(stocksAllocation, 20), color: COLORS[0] },
      { name: "Bonds", value: Math.max(bondsAllocation, 10), color: COLORS[1] },
      { name: "Cash", value: Math.max(cashAllocation, 3), color: COLORS[2] },
      { name: "Real Estate", value: Math.max(realEstateAllocation, 3), color: COLORS[3] },
      { name: "Gold", value: Math.max(goldAllocation, 2), color: COLORS[4] },
      { name: "Alternatives", value: Math.max(alternativesAllocation, 2), color: COLORS[5] }
    ];
    
    // Normalize to 100%
    const totalAllocation = allocations.reduce((sum, item) => sum + item.value, 0);
    const normalizedAllocations = allocations.map(item => ({
      ...item,
      value: Math.round((item.value / totalAllocation) * 100)
    }));
    
    // Further adjustments to ensure total is exactly 100%
    let total = normalizedAllocations.reduce((sum, item) => sum + item.value, 0);
    let index = 0;
    while (total !== 100) {
      if (total < 100) {
        normalizedAllocations[index].value += 1;
        total += 1;
      } else {
        normalizedAllocations[index].value -= 1;
        total -= 1;
      }
      index = (index + 1) % normalizedAllocations.length;
    }
    
    setAllocation(normalizedAllocations);
    
    toast({
      title: "Portfolio Allocation Updated",
      description: `Generated a diversification strategy based on your profile.`,
    });
  };

  useEffect(() => {
    calculateAllocation();
  }, []);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">Investment Diversification Wheel</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Get a personalized asset allocation strategy based on your age, risk tolerance, and time horizon.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <InvestmentProfileForm
            age={age}
            setAge={setAge}
            riskTolerance={riskTolerance}
            setRiskTolerance={setRiskTolerance}
            timeHorizon={timeHorizon}
            setTimeHorizon={setTimeHorizon}
            onCalculate={calculateAllocation}
            getRiskProfile={getRiskProfile}
          />
        </div>
        <div className="lg:col-span-2">
          <InvestmentAllocationChart allocation={allocation} />
        </div>
      </div>
    </div>
  );
};

export default InvestmentDiversification;
