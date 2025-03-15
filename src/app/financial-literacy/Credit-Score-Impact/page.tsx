"use client";

import React, { useState } from "react";
import { Sliders, Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import CreditScoreImprovement from "@/components/credit/CreditScoreImprovement";

const CreditScoreImpact = () => {
  const [creditScore, setCreditScore] = useState(650);
  const [actions, setActions] = useState({
    missedPayment: 0,
    utilizationChange: 0,
    newAccount: 0,
    inquiry: 0,
  });

  const handleScoreChange = (newValue: number[]) => {
    setCreditScore(newValue[0]);
  };

  const handleActionChange = (action: keyof typeof actions, newValue: number[]) => {
    setActions({ ...actions, [action]: newValue[0] });
  };

  const calculateImpact = () => {
    let impact = 0;
    impact -= actions.missedPayment * 80; // Missed payments have severe impact
    impact -= actions.inquiry * 5; // Each hard inquiry
    impact -= Math.max(0, actions.utilizationChange - 30) * 3; // Utilization above 30%
    impact -= actions.newAccount * 10; // New accounts temporarily lower score
    
    return Math.max(300, Math.min(900, creditScore + impact));
  };

  const newScore = calculateImpact();
  const scoreChange = newScore - creditScore;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">Credit Score Impact Simulator</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Understand how different financial actions might affect your credit score.
          Use the sliders below to simulate various scenarios.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="finance-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sliders className="h-5 w-5 text-finance-700" />
                <span>Credit Score Simulator</span>
              </CardTitle>
              <CardDescription>Adjust your current score and potential actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="font-medium text-sm">Current Credit Score</label>
                  <span className="text-lg font-semibold">{creditScore}</span>
                </div>
                <Slider 
                  value={[creditScore]} 
                  min={300} 
                  max={900} 
                  step={1} 
                  onValueChange={handleScoreChange} 
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Poor (300)</span>
                  <span>Fair (600)</span>
                  <span>Excellent (900)</span>
                </div>
              </div>

              <div className="space-y-6 pt-4">
                <h3 className="font-medium">Simulate Actions</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm">Missed Payments</label>
                    <span className="text-sm font-medium">{actions.missedPayment}</span>
                  </div>
                  <Slider 
                    value={[actions.missedPayment]} 
                    min={0} 
                    max={3} 
                    step={1} 
                    onValueChange={(value) => handleActionChange('missedPayment', value)} 
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm">Credit Utilization (%)</label>
                    <span className="text-sm font-medium">{actions.utilizationChange}%</span>
                  </div>
                  <Slider 
                    value={[actions.utilizationChange]} 
                    min={0} 
                    max={100} 
                    step={5} 
                    onValueChange={(value) => handleActionChange('utilizationChange', value)} 
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm">New Credit Accounts</label>
                    <span className="text-sm font-medium">{actions.newAccount}</span>
                  </div>
                  <Slider 
                    value={[actions.newAccount]} 
                    min={0} 
                    max={3} 
                    step={1} 
                    onValueChange={(value) => handleActionChange('newAccount', value)} 
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm">Hard Inquiries</label>
                    <span className="text-sm font-medium">{actions.inquiry}</span>
                  </div>
                  <Slider 
                    value={[actions.inquiry]} 
                    min={0} 
                    max={5} 
                    step={1} 
                    onValueChange={(value) => handleActionChange('inquiry', value)} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="finance-card">
            <CardHeader>
              <CardTitle>Simulated Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Original Score:</span>
                  <span className="font-bold text-gray-700">{creditScore}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">New Estimated Score:</span>
                  <span className={`font-bold ${scoreChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>{newScore}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Score Change:</span>
                  <span className={`font-bold ${scoreChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {scoreChange > 0 ? '+' : ''}{scoreChange} points
                  </span>
                </div>
                
                <div className="mt-4 bg-finance-100 p-3 rounded-lg flex items-start gap-2">
                  <Info className="h-5 w-5 text-finance-700 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-gray-600">
                    This is a simplified simulation. Actual credit score calculations are complex and may vary based on individual 
                    credit profile, scoring model used, and other factors not accounted for in this tool.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <CreditScoreImprovement />
      </div>
    </div>
  );
};

export default CreditScoreImpact;
