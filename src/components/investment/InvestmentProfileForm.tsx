
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface Props {
  age: number;
  setAge: (age: number) => void;
  riskTolerance: number;
  setRiskTolerance: (risk: number) => void;
  timeHorizon: number;
  setTimeHorizon: (time: number) => void;
  onCalculate: () => void;
  getRiskProfile: () => string;
}

const InvestmentProfileForm = ({
  age,
  setAge,
  riskTolerance,
  setRiskTolerance,
  timeHorizon,
  setTimeHorizon,
  onCalculate,
  getRiskProfile,
}: Props) => {
  return (
    <Card className="finance-card">
      <CardHeader>
        <CardTitle>Your Investor Profile</CardTitle>
        <CardDescription>Adjust parameters to match your situation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="age">Your Age</Label>
            <span className="text-sm text-finance-700 font-medium">{age} years</span>
          </div>
          <Slider
            id="age"
            value={[age]}
            min={18}
            max={80}
            step={1}
            onValueChange={(value) => setAge(value[0])}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>18</span>
            <span>40</span>
            <span>60</span>
            <span>80</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="risk">Risk Tolerance</Label>
            <span className="text-sm text-finance-700 font-medium">{getRiskProfile()}</span>
          </div>
          <Slider
            id="risk"
            value={[riskTolerance]}
            min={1}
            max={5}
            step={1}
            onValueChange={(value) => setRiskTolerance(value[0])}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Conservative</span>
            <span>Moderate</span>
            <span>Aggressive</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="horizon">Investment Time Horizon</Label>
            <span className="text-sm text-finance-700 font-medium">{timeHorizon} years</span>
          </div>
          <Slider
            id="horizon"
            value={[timeHorizon]}
            min={1}
            max={30}
            step={1}
            onValueChange={(value) => setTimeHorizon(value[0])}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Short-term</span>
            <span>Medium-term</span>
            <span>Long-term</span>
          </div>
        </div>

        <Button className="w-full finance-btn" onClick={onCalculate}>
          Generate Allocation
        </Button>
      </CardContent>
    </Card>
  );
};

export default InvestmentProfileForm;
