"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, Info, TrendingDown, TrendingUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";

const CarLeaseVsBuy = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Common parameters
  const [carPrice, setCarPrice] = useState(1000000);
  const [downPayment, setDownPayment] = useState(200000);
  const [loanInterestRate, setLoanInterestRate] = useState(8.5);
  const [loanTerm, setLoanTerm] = useState(5);
  const [annualDepreciation, setAnnualDepreciation] = useState(15);
  
  // Lease parameters
  const [leaseTerm, setLeaseTerm] = useState(3);
  const [monthlyLease, setMonthlyLease] = useState(15000);
  const [leaseDownPayment, setLeaseDownPayment] = useState(100000);
  
  // Results
  const [buyTotalCost, setBuyTotalCost] = useState(0);
  const [leaseTotalCost, setLeaseTotalCost] = useState(0);
  const [buyMonthlyPayment, setBuyMonthlyPayment] = useState(0);
  const [buyResidualValue, setBuyResidualValue] = useState(0);
  const [timelineChartData, setTimelineChartData] = useState<any[]>([]);
  const [comparisonChartData, setComparisonChartData] = useState<any[]>([]);
  
  const calculateCosts = () => {
    // Calculate buy scenario
    const loanAmount = carPrice - downPayment;
    const monthlyRate = loanInterestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    // Monthly loan payment calculation - EMI formula
    const monthlyPayment = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments) / 
                           (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    setBuyMonthlyPayment(Math.round(monthlyPayment));
    
    // Calculate depreciation and residual value after loan term
    const residualValue = carPrice * Math.pow(1 - annualDepreciation / 100, loanTerm);
    setBuyResidualValue(Math.round(residualValue));
    
    // Total cost of ownership = Down Payment + Total Loan Payments - Residual Value
    const totalLoanCost = monthlyPayment * numberOfPayments;
    const buyTotal = downPayment + totalLoanCost - residualValue;
    setBuyTotalCost(Math.round(buyTotal));
    
    // Calculate lease scenario
    const leaseTotalPayments = monthlyLease * leaseTerm * 12;
    const leaseTotal = leaseDownPayment + leaseTotalPayments;
    setLeaseTotalCost(Math.round(leaseTotal));
    
    // Create timeline chart data
    const timeline = [];
    const maxYears = Math.max(loanTerm, leaseTerm);
    
    for (let year = 0; year <= maxYears; year++) {
      // Buy scenario costs over time
      const yearlyDepreciation = carPrice * (1 - Math.pow(1 - annualDepreciation / 100, year));
      const loanPaid = year * 12 * monthlyPayment > loanAmount ? loanAmount : year * 12 * monthlyPayment;
      const totalPaidBuy = downPayment + (year > 0 ? Math.min(loanPaid, totalLoanCost) : 0);
      const currentValue = carPrice - yearlyDepreciation;
      const netBuyCost = totalPaidBuy - currentValue;
      
      // Lease scenario costs over time
      const leasePayments = year * 12 * monthlyLease;
      const totalPaidLease = leaseDownPayment + (year > 0 ? Math.min(leasePayments, leaseTotalPayments) : 0);
      
      // After lease ends, assume buying equivalent depreciated car for remaining years
      let netLeaseCost = totalPaidLease;
      if (year > leaseTerm) {
        const postLeaseCarValue = carPrice * Math.pow(1 - annualDepreciation / 100, leaseTerm);
        const postLeaseDepreciation = postLeaseCarValue * (1 - Math.pow(1 - annualDepreciation / 100, year - leaseTerm));
        netLeaseCost = totalPaidLease + postLeaseCarValue - (postLeaseCarValue - postLeaseDepreciation);
      }
      
      timeline.push({
        year,
        "Buy Cost": Math.round(netBuyCost),
        "Lease Cost": Math.round(netLeaseCost)
      });
    }
    
    setTimelineChartData(timeline);
    
    // Create comparison chart data
    setComparisonChartData([
      { name: "Initial Payment", buy: downPayment, lease: leaseDownPayment },
      { name: "Monthly Payments", buy: monthlyPayment, lease: monthlyLease },
      { name: "Total Cost (5Y)", buy: Math.round(buyTotal), lease: Math.round(leaseTotal) },
      { name: "Residual Value", buy: Math.round(residualValue), lease: 0 }
    ]);
    
    toast({
      title: "Lease vs. Buy Analysis Complete",
      description: `Over ${leaseTerm} years, leasing costs ${formatCurrency(leaseTotal)} while buying costs ${formatCurrency(buyTotal)} (including residual value).`,
    });
  };

  useEffect(() => {
    calculateCosts();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const isBuyingCheaper = buyTotalCost < leaseTotalCost;
  
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">Car Lease vs. Buy Comparison</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Compare the total costs and financial implications of leasing versus buying a vehicle.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="finance-card animate-scale-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5 text-finance-700" />
                <span>Vehicle Details</span>
              </CardTitle>
              <CardDescription>Enter information about the vehicle</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="car-price">Car Price (₹)</Label>
                  <span className="text-sm text-finance-700 font-medium">{formatCurrency(carPrice)}</span>
                </div>
                <Input 
                  id="car-price" 
                  type="number"
                  min="100000" 
                  value={carPrice} 
                  onChange={(e) => setCarPrice(Number(e.target.value))}
                  className="input-field"
                />
                <Slider 
                  value={[carPrice]} 
                  min={100000} 
                  max={5000000} 
                  step={50000} 
                  onValueChange={(value) => setCarPrice(value[0])} 
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="annual-depreciation">Annual Depreciation (%)</Label>
                  <span className="text-sm text-finance-700 font-medium">{annualDepreciation}%</span>
                </div>
                <Input 
                  id="annual-depreciation" 
                  type="number"
                  min="5"
                  max="30" 
                  value={annualDepreciation} 
                  onChange={(e) => setAnnualDepreciation(Number(e.target.value))}
                  className="input-field"
                />
                <Slider 
                  value={[annualDepreciation]} 
                  min={5} 
                  max={30} 
                  step={1} 
                  onValueChange={(value) => setAnnualDepreciation(value[0])} 
                />
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="buy" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="buy">Buy</TabsTrigger>
              <TabsTrigger value="lease">Lease</TabsTrigger>
            </TabsList>
            <TabsContent value="buy">
              <Card className="finance-card animate-scale-in">
                <CardHeader>
                  <CardTitle className="text-lg">Buy Parameters</CardTitle>
                  <CardDescription>Adjust loan details for buying</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="down-payment">Down Payment (₹)</Label>
                      <span className="text-sm text-finance-700 font-medium">{formatCurrency(downPayment)}</span>
                    </div>
                    <Input 
                      id="down-payment" 
                      type="number"
                      min="0" 
                      max={carPrice} 
                      value={downPayment} 
                      onChange={(e) => setDownPayment(Number(e.target.value))}
                      className="input-field"
                    />
                    <Slider 
                      value={[downPayment]} 
                      min={0} 
                      max={carPrice * 0.5} 
                      step={10000} 
                      onValueChange={(value) => setDownPayment(value[0])} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="loan-interest">Loan Interest (%)</Label>
                      <span className="text-sm text-finance-700 font-medium">{loanInterestRate}%</span>
                    </div>
                    <Input 
                      id="loan-interest" 
                      type="number"
                      min="4"
                      max="20" 
                      step="0.1"
                      value={loanInterestRate} 
                      onChange={(e) => setLoanInterestRate(Number(e.target.value))}
                      className="input-field"
                    />
                    <Slider 
                      value={[loanInterestRate]} 
                      min={4} 
                      max={20} 
                      step={0.5} 
                      onValueChange={(value) => setLoanInterestRate(value[0])} 
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
                      min="1"
                      max="8" 
                      value={loanTerm} 
                      onChange={(e) => setLoanTerm(Number(e.target.value))}
                      className="input-field"
                    />
                    <Slider 
                      value={[loanTerm]} 
                      min={1} 
                      max={8} 
                      step={1} 
                      onValueChange={(value) => setLoanTerm(value[0])} 
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="lease">
              <Card className="finance-card animate-scale-in">
                <CardHeader>
                  <CardTitle className="text-lg">Lease Parameters</CardTitle>
                  <CardDescription>Adjust lease details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="lease-down">Lease Down Payment (₹)</Label>
                      <span className="text-sm text-finance-700 font-medium">{formatCurrency(leaseDownPayment)}</span>
                    </div>
                    <Input 
                      id="lease-down" 
                      type="number"
                      min="0" 
                      value={leaseDownPayment} 
                      onChange={(e) => setLeaseDownPayment(Number(e.target.value))}
                      className="input-field"
                    />
                    <Slider 
                      value={[leaseDownPayment]} 
                      min={0} 
                      max={carPrice * 0.3} 
                      step={10000} 
                      onValueChange={(value) => setLeaseDownPayment(value[0])} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="monthly-lease">Monthly Lease (₹)</Label>
                      <span className="text-sm text-finance-700 font-medium">{formatCurrency(monthlyLease)}</span>
                    </div>
                    <Input 
                      id="monthly-lease" 
                      type="number"
                      min="1000" 
                      value={monthlyLease} 
                      onChange={(e) => setMonthlyLease(Number(e.target.value))}
                      className="input-field"
                    />
                    <Slider 
                      value={[monthlyLease]} 
                      min={5000} 
                      max={50000} 
                      step={1000} 
                      onValueChange={(value) => setMonthlyLease(value[0])} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="lease-term">Lease Term (Years)</Label>
                      <span className="text-sm text-finance-700 font-medium">{leaseTerm} years</span>
                    </div>
                    <Input 
                      id="lease-term" 
                      type="number"
                      min="1"
                      max="5" 
                      value={leaseTerm} 
                      onChange={(e) => setLeaseTerm(Number(e.target.value))}
                      className="input-field"
                    />
                    <Slider 
                      value={[leaseTerm]} 
                      min={1} 
                      max={5} 
                      step={1} 
                      onValueChange={(value) => setLeaseTerm(value[0])} 
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <Button className="w-full finance-btn" onClick={calculateCosts}>
            Calculate & Compare
          </Button>
        </div>
        
        <Card className="finance-card lg:col-span-2 animate-scale-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isBuyingCheaper ? 
                <TrendingDown className="h-5 w-5 text-green-600" /> : 
                <TrendingUp className="h-5 w-5 text-red-600" />
              }
              <span>Cost Comparison Over Time</span>
            </CardTitle>
            <CardDescription>See how costs accumulate over the life of the vehicle</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className={isMobile ? "h-[250px]" : "h-[300px]"}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={timelineChartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottomRight', offset: -10 }} />
                  <YAxis tickFormatter={(value) => `₹${value/100000}L`} />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), ""]}
                    labelFormatter={(value) => `Year ${value}`}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="Buy Cost" stroke="#0FA0CE" strokeWidth={2} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="Lease Cost" stroke="#F97316" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className={isBuyingCheaper ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    <span>Buy Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-1">
                    <p className="text-sm text-gray-600">Initial Down Payment:</p>
                    <p className="text-sm font-medium text-right">{formatCurrency(downPayment)}</p>
                    
                    <p className="text-sm text-gray-600">Monthly Payment:</p>
                    <p className="text-sm font-medium text-right">{formatCurrency(buyMonthlyPayment)}</p>
                    
                    <p className="text-sm text-gray-600">Residual Value (After {loanTerm} years):</p>
                    <p className="text-sm font-medium text-right">{formatCurrency(buyResidualValue)}</p>
                    
                    <p className="text-sm text-gray-600">Total Net Cost:</p>
                    <p className="text-sm font-medium text-right">{formatCurrency(buyTotalCost)}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className={!isBuyingCheaper ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    <span>Lease Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-1">
                    <p className="text-sm text-gray-600">Initial Down Payment:</p>
                    <p className="text-sm font-medium text-right">{formatCurrency(leaseDownPayment)}</p>
                    
                    <p className="text-sm text-gray-600">Monthly Payment:</p>
                    <p className="text-sm font-medium text-right">{formatCurrency(monthlyLease)}</p>
                    
                    <p className="text-sm text-gray-600">Lease Term:</p>
                    <p className="text-sm font-medium text-right">{leaseTerm} years</p>
                    
                    <p className="text-sm text-gray-600">Total Cost:</p>
                    <p className="text-sm font-medium text-right">{formatCurrency(leaseTotalCost)}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="border border-finance-200 bg-finance-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Recommendation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  {isBuyingCheaper ? (
                    <>
                      <span className="font-medium text-green-600">Buying is more economical</span> in the 
                      long term by {formatCurrency(leaseTotalCost - buyTotalCost)}. Consider 
                      buying if you plan to keep the vehicle for {loanTerm} years or more.
                    </>
                  ) : (
                    <>
                      <span className="font-medium text-green-600">Leasing is more economical</span> by 
                      {formatCurrency(buyTotalCost - leaseTotalCost)} over the {leaseTerm}-year period. 
                      Consider leasing if you prefer lower monthly payments and want to change vehicles regularly.
                    </>
                  )}
                </p>
              </CardContent>
            </Card>
            
            <div className="flex items-start gap-2 bg-finance-100 p-4 rounded-lg text-sm">
              <Info className="text-finance-700 mt-0.5 h-5 w-5 flex-shrink-0" />
              <p className="text-gray-600">
                This comparison shows the net costs of buying versus leasing. When buying, you build equity in the vehicle
                (its residual value) but pay more upfront. Leasing typically has lower upfront and monthly costs but you don't
                own anything at the end of the lease. The best option depends on your preferences for ownership, usage patterns,
                and financial situation.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CarLeaseVsBuy;
