"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Home, TrendingUp, Calendar, ArrowRight, Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";
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

const MortgageVsRent = () => {
  const { toast } = useToast();
  
  // Mortgage parameters
  const [homePrice, setHomePrice] = useState(5000000);
  const [downPayment, setDownPayment] = useState(1000000);
  const [loanTerm, setLoanTerm] = useState(20);
  const [interestRate, setInterestRate] = useState(7.5);
  
  // Rent parameters
  const [monthlyRent, setMonthlyRent] = useState(25000);
  const [rentIncrease, setRentIncrease] = useState(5);
  
  // Common parameters
  const [propertyAppreciation, setPropertyAppreciation] = useState(4);
  const [investmentReturn, setInvestmentReturn] = useState(8);
  const [timeHorizon, setTimeHorizon] = useState(30);
  
  // Results
  const [mortgagePayment, setMortgagePayment] = useState(0);
  const [totalMortgageCost, setTotalMortgageCost] = useState(0);
  const [totalRentCost, setTotalRentCost] = useState(0);
  const [netWorthDifference, setNetWorthDifference] = useState(0);
  const [breakEvenYear, setBreakEvenYear] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  
  const calculateComparison = () => {
    // Calculate mortgage payment
    const principal = homePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    setMortgagePayment(Math.round(monthlyPayment));
    
    // Property tax, maintenance, insurance (estimated at 2% of home value annually)
    const annualOwnershipCosts = homePrice * 0.02;
    const monthlyOwnershipCosts = annualOwnershipCosts / 12;
    
    // Calculate buy scenario over time
    let remainingMortgage = principal;
    let homeValue = homePrice;
    let totalMortgagePaid = downPayment;
    let mortgageEquity = downPayment;
    
    // Calculate rent scenario over time
    let currentRent = monthlyRent;
    let totalRentPaid = 0;
    let investmentPortfolio = downPayment; // Initial investment equal to down payment
    
    const data = [];
    let foundBreakEven = false;
    let breakEvenYear = 0;
    
    for (let year = 0; year <= timeHorizon; year++) {
      // Buy scenario calculations
      if (year > 0) {
        // Pay mortgage for a year
        if (year <= loanTerm) {
          totalMortgagePaid += monthlyPayment * 12;
          const yearlyInterestPaid = remainingMortgage * (interestRate / 100);
          const yearlyPrincipalPaid = (monthlyPayment * 12) - yearlyInterestPaid;
          remainingMortgage -= yearlyPrincipalPaid;
        }
        
        // Home appreciates
        homeValue *= (1 + propertyAppreciation / 100);
        
        // Pay ownership costs
        totalMortgagePaid += monthlyOwnershipCosts * 12;
      }
      
      mortgageEquity = homeValue - remainingMortgage;
      
      // Rent scenario calculations
      if (year > 0) {
        // Pay rent for a year
        totalRentPaid += currentRent * 12;
        
        // Invest the difference between mortgage payment + ownership costs and rent
        const monthlyDifference = (monthlyPayment + monthlyOwnershipCosts) - currentRent;
        
        // If renting is cheaper, invest the difference
        if (monthlyDifference > 0) {
          investmentPortfolio += monthlyDifference * 12;
        }
        
        // Apply investment returns
        investmentPortfolio *= (1 + investmentReturn / 100);
        
        // Increase rent for next year
        currentRent *= (1 + rentIncrease / 100);
      }
      
      // Net worth comparison at this year
      const buyNetWorth = mortgageEquity;
      const rentNetWorth = investmentPortfolio;
      const netWorthDiff = buyNetWorth - rentNetWorth;
      
      // Check for break-even point
      if (!foundBreakEven && netWorthDiff > 0 && year > 0) {
        foundBreakEven = true;
        breakEvenYear = year;
      }
      
      data.push({
        year,
        buyNetWorth: Math.round(buyNetWorth),
        rentNetWorth: Math.round(rentNetWorth)
      });
    }
    
    setTotalMortgageCost(Math.round(totalMortgagePaid));
    setTotalRentCost(Math.round(totalRentPaid));
    setNetWorthDifference(Math.round(mortgageEquity - investmentPortfolio));
    setBreakEvenYear(breakEvenYear);
    setChartData(data);
    
    toast({
      title: "Mortgage vs. Rent Analysis",
      description: foundBreakEven 
        ? `Buying breaks even with renting after ${breakEvenYear} years.` 
        : "Based on your inputs, renting appears more advantageous over the entire time horizon.",
    });
  };
  
  useEffect(() => {
    calculateComparison();
  }, []);
  
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">Mortgage vs. Rent Comparison</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Compare the financial impact of buying a home versus renting over time to help you make an informed decision.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="finance-card lg:col-span-1 animate-scale-in">
          <CardHeader>
            <CardTitle>Input Parameters</CardTitle>
            <CardDescription>Adjust values to compare buying vs. renting</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-1">
              <h3 className="font-semibold text-gray-700">Home Purchase</h3>
              <Separator className="my-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="home-price">Home Price (₹)</Label>
                <span className="text-sm text-finance-700 font-medium">₹{homePrice.toLocaleString()}</span>
              </div>
              <Input 
                id="home-price" 
                type="number"
                min="1000000" 
                max="50000000" 
                value={homePrice} 
                onChange={(e) => setHomePrice(Number(e.target.value))}
                className="input-field"
              />
              <Slider 
                value={[homePrice]} 
                min={1000000} 
                max={20000000} 
                step={100000} 
                onValueChange={(value) => setHomePrice(value[0])} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="down-payment">Down Payment (₹)</Label>
                <span className="text-sm text-finance-700 font-medium">₹{downPayment.toLocaleString()} ({Math.round(downPayment/homePrice*100)}%)</span>
              </div>
              <Input 
                id="down-payment" 
                type="number"
                min="100000" 
                max={homePrice * 0.8} 
                value={downPayment} 
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="input-field"
              />
              <Slider 
                value={[downPayment]} 
                min={100000} 
                max={homePrice * 0.8} 
                step={100000} 
                onValueChange={(value) => setDownPayment(value[0])} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="loan-term">Loan Term (Years)</Label>
                <span className="text-sm text-finance-700 font-medium">{loanTerm} years</span>
              </div>
              <Input 
                id="loan-term" 
                type="number"
                min="5" 
                max="30" 
                value={loanTerm} 
                onChange={(e) => setLoanTerm(Number(e.target.value))}
                className="input-field"
              />
              <Slider 
                value={[loanTerm]} 
                min={5} 
                max={30} 
                step={1} 
                onValueChange={(value) => setLoanTerm(value[0])} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="interest-rate">Interest Rate (%)</Label>
                <span className="text-sm text-finance-700 font-medium">{interestRate}%</span>
              </div>
              <Input 
                id="interest-rate" 
                type="number"
                min="4" 
                max="15" 
                step="0.1"
                value={interestRate} 
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="input-field"
              />
              <Slider 
                value={[interestRate]} 
                min={4} 
                max={15} 
                step={0.25} 
                onValueChange={(value) => setInterestRate(value[0])} 
              />
            </div>
            
            <div className="space-y-1">
              <h3 className="font-semibold text-gray-700">Rental</h3>
              <Separator className="my-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="monthly-rent">Monthly Rent (₹)</Label>
                <span className="text-sm text-finance-700 font-medium">₹{monthlyRent.toLocaleString()}</span>
              </div>
              <Input 
                id="monthly-rent" 
                type="number"
                min="5000" 
                max="200000" 
                value={monthlyRent} 
                onChange={(e) => setMonthlyRent(Number(e.target.value))}
                className="input-field"
              />
              <Slider 
                value={[monthlyRent]} 
                min={5000} 
                max={100000} 
                step={1000} 
                onValueChange={(value) => setMonthlyRent(value[0])} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="rent-increase">Annual Rent Increase (%)</Label>
                <span className="text-sm text-finance-700 font-medium">{rentIncrease}%</span>
              </div>
              <Input 
                id="rent-increase" 
                type="number"
                min="0" 
                max="15" 
                step="0.5"
                value={rentIncrease} 
                onChange={(e) => setRentIncrease(Number(e.target.value))}
                className="input-field"
              />
              <Slider 
                value={[rentIncrease]} 
                min={0} 
                max={15} 
                step={0.5} 
                onValueChange={(value) => setRentIncrease(value[0])} 
              />
            </div>
            
            <div className="space-y-1">
              <h3 className="font-semibold text-gray-700">Common Parameters</h3>
              <Separator className="my-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="property-appreciation">Property Appreciation (%)</Label>
                <span className="text-sm text-finance-700 font-medium">{propertyAppreciation}%</span>
              </div>
              <Input 
                id="property-appreciation" 
                type="number"
                min="0" 
                max="15" 
                step="0.5"
                value={propertyAppreciation} 
                onChange={(e) => setPropertyAppreciation(Number(e.target.value))}
                className="input-field"
              />
              <Slider 
                value={[propertyAppreciation]} 
                min={0} 
                max={15} 
                step={0.5} 
                onValueChange={(value) => setPropertyAppreciation(value[0])} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="investment-return">Investment Return (%)</Label>
                <span className="text-sm text-finance-700 font-medium">{investmentReturn}%</span>
              </div>
              <Input 
                id="investment-return" 
                type="number"
                min="0" 
                max="20" 
                step="0.5"
                value={investmentReturn} 
                onChange={(e) => setInvestmentReturn(Number(e.target.value))}
                className="input-field"
              />
              <Slider 
                value={[investmentReturn]} 
                min={0} 
                max={20} 
                step={0.5} 
                onValueChange={(value) => setInvestmentReturn(value[0])} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="time-horizon">Time Horizon (Years)</Label>
                <span className="text-sm text-finance-700 font-medium">{timeHorizon} years</span>
              </div>
              <Input 
                id="time-horizon" 
                type="number"
                min="5" 
                max="50" 
                value={timeHorizon} 
                onChange={(e) => setTimeHorizon(Number(e.target.value))}
                className="input-field"
              />
              <Slider 
                value={[timeHorizon]} 
                min={5} 
                max={50} 
                step={1} 
                onValueChange={(value) => setTimeHorizon(value[0])} 
              />
            </div>
            
            <Button className="w-full finance-btn" onClick={calculateComparison}>
              Calculate Comparison
            </Button>
          </CardContent>
        </Card>
        
        <Card className="finance-card lg:col-span-2 animate-scale-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle>Buy vs. Rent Comparison</CardTitle>
            <CardDescription>Net worth comparison over time</CardDescription>
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
                    tickFormatter={(value) => `₹${(value/1000000).toFixed(1)}M`} 
                    domain={['auto', 'auto']}
                    label={{ value: 'Net Worth (₹)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value) => [`₹${Number(value).toLocaleString()}`, undefined]} 
                    labelFormatter={(value) => `Year ${value}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="buyNetWorth" 
                    name="Buy: Home Equity" 
                    stroke="#33C3F0" 
                    strokeWidth={2} 
                    dot={{ r: 0 }}
                    activeDot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rentNetWorth" 
                    name="Rent: Investment Portfolio" 
                    stroke="#FF6B6B" 
                    strokeWidth={2} 
                    dot={{ r: 0 }}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-finance-100 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Home className="text-finance-700 h-5 w-5" />
                    <span className="font-medium text-gray-700">Buy</span>
                  </div>
                  <ArrowRight className="text-finance-700 h-5 w-5" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Monthly Mortgage:</span>
                    <span className="font-medium">₹{mortgagePayment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Paid (30 yrs):</span>
                    <span className="font-medium">₹{totalMortgageCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Home Value (30 yrs):</span>
                    <span className="font-medium">₹{Math.round(homePrice * Math.pow(1 + propertyAppreciation/100, timeHorizon)).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-finance-100 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-red-500 h-5 w-5" />
                    <span className="font-medium text-gray-700">Rent</span>
                  </div>
                  <ArrowRight className="text-red-500 h-5 w-5" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Initial Monthly Rent:</span>
                    <span className="font-medium">₹{monthlyRent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Rent (30 yrs):</span>
                    <span className="font-medium">₹{totalRentCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Final Monthly Rent:</span>
                    <span className="font-medium">₹{Math.round(monthlyRent * Math.pow(1 + rentIncrease/100, timeHorizon)).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-finance-100 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="text-finance-700 h-5 w-5" />
                  <p className="text-sm font-medium text-gray-700">Long-term Advantage</p>
                </div>
                <p className="text-lg font-bold">
                  {netWorthDifference > 0 ? (
                    <span className="text-green-600">Buying by ₹{Math.abs(netWorthDifference).toLocaleString()}</span>
                  ) : (
                    <span className="text-red-600">Renting by ₹{Math.abs(netWorthDifference).toLocaleString()}</span>
                  )}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {netWorthDifference > 0 
                    ? "After the full period, buying a home results in higher net worth." 
                    : "After the full period, renting and investing results in higher net worth."}
                </p>
              </div>
              
              <div className="bg-finance-100 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="text-finance-700 h-5 w-5" />
                  <p className="text-sm font-medium text-gray-700">Break-even Timeline</p>
                </div>
                <p className="text-lg font-bold">
                  {breakEvenYear > 0 ? (
                    <span className="text-green-600">{breakEvenYear} years</span>
                  ) : (
                    <span className="text-red-600">Never (within {timeHorizon} years)</span>
                  )}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {breakEvenYear > 0
                    ? `Buying becomes more advantageous than renting after ${breakEvenYear} years.`
                    : "Based on your inputs, renting remains more advantageous for the entire period."}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-2 bg-finance-100 p-4 rounded-lg text-sm">
              <Info className="text-finance-700 mt-0.5 h-5 w-5 flex-shrink-0" />
              <p className="text-gray-600">
                This calculator does not account for all variables like taxes, closing costs, maintenance surprises, 
                lifestyle preferences, and local market conditions. It is meant to provide a general financial 
                comparison between buying and renting over time.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MortgageVsRent;
