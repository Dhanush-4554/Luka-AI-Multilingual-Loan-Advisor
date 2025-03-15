"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Trash2, Calendar, DollarSign, TrendingUp, Plus, Info, Target } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface SavingsGoal {
  id: string;
  name: string;
  icon: 'home' | 'travel' | 'education' | 'retirement' | 'emergency' | 'other';
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  interestRate: number;
}

const GoalBasedSavings = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [goals, setGoals] = useState<SavingsGoal[]>([
    {
      id: '1',
      name: 'Home Down Payment',
      icon: 'home',
      targetAmount: 2000000,
      currentAmount: 500000,
      monthlyContribution: 25000,
      interestRate: 6
    },
    {
      id: '2',
      name: 'Emergency Fund',
      icon: 'emergency',
      targetAmount: 500000,
      currentAmount: 250000,
      monthlyContribution: 10000,
      interestRate: 5
    },
    {
      id: '3',
      name: 'Vacation',
      icon: 'travel',
      targetAmount: 300000,
      currentAmount: 100000,
      monthlyContribution: 15000,
      interestRate: 5.5
    }
  ]);
  
  const [newGoal, setNewGoal] = useState<SavingsGoal>({
    id: '',
    name: '',
    icon: 'other',
    targetAmount: 100000,
    currentAmount: 0,
    monthlyContribution: 5000,
    interestRate: 5
  });
  
  const [goalProjections, setGoalProjections] = useState<{
    id: string;
    monthsToGoal: number;
    projectedDate: Date;
    percentComplete: number;
    projectedValue: number;
  }[]>([]);
  
  const calculateProjections = () => {
    const projections = goals.map(goal => {
      const { targetAmount, currentAmount, monthlyContribution, interestRate } = goal;
      
      // Calculate how many months to reach the goal
      const remainingAmount = targetAmount - currentAmount;
      const monthlyRate = interestRate / 100 / 12;
      
      // Using formula: FV = PMT * ((1 + r)^n - 1) / r * (1 + r)
      // Solving for n (number of periods/months):
      // n = log(1 + (FV * r / PMT)) / log(1 + r)
      
      let monthsToGoal: number;
      if (remainingAmount <= 0) {
        monthsToGoal = 0;
      } else if (monthlyContribution <= 0) {
        monthsToGoal = Infinity;
      } else if (interestRate === 0) {
        monthsToGoal = remainingAmount / monthlyContribution;
      } else {
        monthsToGoal = Math.log(1 + (remainingAmount * monthlyRate / monthlyContribution)) / Math.log(1 + monthlyRate);
      }
      
      // Calculate the projected date
      const today = new Date();
      const projectedDate = new Date(today);
      projectedDate.setMonth(today.getMonth() + Math.ceil(monthsToGoal));
      
      // Calculate percentage complete
      const percentComplete = Math.min(100, (currentAmount / targetAmount) * 100);
      
      // Calculate projected value after 1 year of continued contributions
      const oneYearFromNow = 12;
      const projectedValue = currentAmount * Math.pow(1 + monthlyRate, oneYearFromNow) +
                            monthlyContribution * ((Math.pow(1 + monthlyRate, oneYearFromNow) - 1) / monthlyRate) * (1 + monthlyRate);
      
      return {
        id: goal.id,
        monthsToGoal: Math.ceil(monthsToGoal),
        projectedDate,
        percentComplete,
        projectedValue: Math.round(projectedValue)
      };
    });
    
    setGoalProjections(projections);
  };
  
  useEffect(() => {
    calculateProjections();
  }, [goals]);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'long'
    }).format(date);
  };
  
  const addNewGoal = () => {
    if (!newGoal.name) {
      toast({
        title: "Error",
        description: "Please provide a name for your goal",
        variant: "destructive"
      });
      return;
    }
    
    const updatedGoal = {
      ...newGoal,
      id: Date.now().toString()
    };
    
    setGoals([...goals, updatedGoal]);
    setNewGoal({
      id: '',
      name: '',
      icon: 'other',
      targetAmount: 100000,
      currentAmount: 0,
      monthlyContribution: 5000,
      interestRate: 5
    });
    
    toast({
      title: "Goal Added",
      description: `"${updatedGoal.name}" has been added to your savings goals.`,
    });
  };
  
  const deleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
    
    toast({
      title: "Goal Removed",
      description: "The savings goal has been removed from your list.",
    });
  };
  
  const updateGoal = (id: string, updates: Partial<SavingsGoal>) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, ...updates } : goal
    ));
  };
  
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'home':
        return <Home className="h-5 w-5" />;
      case 'travel':
        return <Calendar className="h-5 w-5" />;
      case 'education':
        return <Target className="h-5 w-5" />;
      case 'retirement':
        return <TrendingUp className="h-5 w-5" />;
      case 'emergency':
        return <Trash2 className="h-5 w-5" />;
      default:
        return <DollarSign className="h-5 w-5" />;
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">Goal-Based Savings Visualizer</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Track multiple savings goals and visualize your progress toward each one.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal, index) => {
          const projection = goalProjections.find(p => p.id === goal.id);
          const percentComplete = projection?.percentComplete || 0;
          const progressColor = percentComplete < 30 ? 'bg-red-500' : 
                               percentComplete < 70 ? 'bg-yellow-500' : 'bg-green-500';
                               
          return (
            <Card key={goal.id} className="finance-card animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="bg-finance-200 p-2 rounded-md text-finance-700">
                      {getIconComponent(goal.icon)}
                    </div>
                    <CardTitle className="text-lg">{goal.name}</CardTitle>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-gray-500 hover:text-red-500"
                    onClick={() => deleteGoal(goal.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>
                  Target: {formatCurrency(goal.targetAmount)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress: {percentComplete.toFixed(0)}%</span>
                    <span>{formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}</span>
                  </div>
                  <Progress value={percentComplete} className="h-2" style={{
                    "--progress-width": `${percentComplete}%`
                  } as React.CSSProperties} />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Monthly Saving</p>
                    <p className="font-medium">{formatCurrency(goal.monthlyContribution)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Interest Rate</p>
                    <p className="font-medium">{goal.interestRate}%</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-2 bg-finance-100 p-3 rounded-md">
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600">Estimated completion:</p>
                    <p className="text-sm font-medium">
                      {projection?.monthsToGoal === 0 ? 'Complete!' : 
                       projection?.monthsToGoal === Infinity ? 'Never' :
                       `${formatDate(projection?.projectedDate || new Date())}`}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600">Time to completion:</p>
                    <p className="text-sm font-medium">
                      {projection?.monthsToGoal === 0 ? 'Complete!' : 
                       projection?.monthsToGoal === Infinity ? 'Never' :
                       `${projection?.monthsToGoal} months`}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => {
                    // Open an edit modal or update directly
                    const newAmount = prompt('Update current savings amount:', goal.currentAmount.toString());
                    if (newAmount !== null) {
                      updateGoal(goal.id, { currentAmount: parseFloat(newAmount) || 0 });
                    }
                  }}
                >
                  Update Progress
                </Button>
              </CardFooter>
            </Card>
          );
        })}
        
        {/* Add New Goal Card */}
        <Card className="finance-card animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-finance-700" />
              <span>Add New Goal</span>
            </CardTitle>
            <CardDescription>Create a new savings goal to track</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goal-name">Goal Name</Label>
              <Input 
                id="goal-name" 
                placeholder="e.g., New Car, Vacation, etc."
                value={newGoal.name}
                onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                className="input-field"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="goal-icon">Goal Type</Label>
              <select 
                id="goal-icon"
                className="w-full px-3 py-2 border border-finance-200 rounded-md focus:outline-none"
                value={newGoal.icon}
                onChange={(e) => setNewGoal({...newGoal, icon: e.target.value as any})}
              >
                <option value="home">Home/Property</option>
                <option value="travel">Travel/Vacation</option>
                <option value="education">Education</option>
                <option value="retirement">Retirement</option>
                <option value="emergency">Emergency Fund</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="target-amount">Target Amount (₹)</Label>
                <span className="text-sm text-finance-700 font-medium">{formatCurrency(newGoal.targetAmount)}</span>
              </div>
              <Input 
                id="target-amount" 
                type="number"
                min="1000" 
                value={newGoal.targetAmount} 
                onChange={(e) => setNewGoal({...newGoal, targetAmount: Number(e.target.value)})}
                className="input-field"
              />
              <Slider 
                value={[newGoal.targetAmount]} 
                min={10000} 
                max={5000000} 
                step={10000} 
                onValueChange={(value) => setNewGoal({...newGoal, targetAmount: value[0]})} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="current-amount">Current Savings (₹)</Label>
                <span className="text-sm text-finance-700 font-medium">{formatCurrency(newGoal.currentAmount)}</span>
              </div>
              <Input 
                id="current-amount" 
                type="number"
                min="0" 
                value={newGoal.currentAmount} 
                onChange={(e) => setNewGoal({...newGoal, currentAmount: Number(e.target.value)})}
                className="input-field"
              />
              <Slider 
                value={[newGoal.currentAmount]} 
                min={0} 
                max={newGoal.targetAmount} 
                step={5000} 
                onValueChange={(value) => setNewGoal({...newGoal, currentAmount: value[0]})} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="monthly-contribution">Monthly Contribution (₹)</Label>
                <span className="text-sm text-finance-700 font-medium">{formatCurrency(newGoal.monthlyContribution)}</span>
              </div>
              <Input 
                id="monthly-contribution" 
                type="number"
                min="100" 
                value={newGoal.monthlyContribution} 
                onChange={(e) => setNewGoal({...newGoal, monthlyContribution: Number(e.target.value)})}
                className="input-field"
              />
              <Slider 
                value={[newGoal.monthlyContribution]} 
                min={1000} 
                max={100000} 
                step={1000} 
                onValueChange={(value) => setNewGoal({...newGoal, monthlyContribution: value[0]})} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="interest-rate">Interest Rate (%)</Label>
                <span className="text-sm text-finance-700 font-medium">{newGoal.interestRate}%</span>
              </div>
              <Input 
                id="interest-rate" 
                type="number"
                min="0"
                max="15"
                step="0.1"
                value={newGoal.interestRate} 
                onChange={(e) => setNewGoal({...newGoal, interestRate: Number(e.target.value)})}
                className="input-field"
              />
              <Slider 
                value={[newGoal.interestRate]} 
                min={0} 
                max={15} 
                step={0.5} 
                onValueChange={(value) => setNewGoal({...newGoal, interestRate: value[0]})} 
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full finance-btn" 
              onClick={addNewGoal}
            >
              Add Goal
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Card className="finance-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-finance-700" />
            <span>Goal-Based Savings Tips</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="bg-finance-100 p-4 rounded-lg flex-1">
              <h3 className="font-medium mb-2">Prioritize Your Goals</h3>
              <p className="text-sm text-gray-600">
                Focus on emergency funds and high-interest debt first before saving for other goals.
                Consider the timeline and importance of each goal when allocating your monthly savings.
              </p>
            </div>
            <div className="bg-finance-100 p-4 rounded-lg flex-1">
              <h3 className="font-medium mb-2">Automate Your Savings</h3>
              <p className="text-sm text-gray-600">
                Set up automatic transfers to dedicated savings accounts for each goal.
                Automation helps maintain consistency and reduces the temptation to spend.
              </p>
            </div>
            <div className="bg-finance-100 p-4 rounded-lg flex-1">
              <h3 className="font-medium mb-2">Review Regularly</h3>
              <p className="text-sm text-gray-600">
                Revisit your goals quarterly to adjust for changes in your financial situation or priorities.
                Celebrate milestones to stay motivated on your savings journey.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalBasedSavings;
