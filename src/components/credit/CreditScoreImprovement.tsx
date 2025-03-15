
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Unlock, Shield, CreditCard, TrendingUp, Check } from "lucide-react";

interface CreditTipProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const CreditTip = ({ title, description, icon }: CreditTipProps) => {
  return (
    <div className="flex items-start gap-3 p-4 border border-finance-200 rounded-lg bg-white hover:shadow-md transition-all duration-200">
      <div className="mt-1 text-finance-600">{icon}</div>
      <div>
        <h4 className="font-medium text-gray-800 mb-1">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

const CreditScoreImprovement = () => {
  const improvementStrategies = [
    {
      title: "Pay Bills on Time",
      description: "Set up automatic payments or reminders to pay all your credit bills on time. Payment history makes up 35% of your CIBIL score.",
      icon: <Check size={20} />
    },
    {
      title: "Reduce Credit Utilization",
      description: "Keep your credit card balances below 30% of your limit. Lower utilization ratios can significantly improve your score.",
      icon: <CreditCard size={20} />
    },
    {
      title: "Don't Close Old Accounts",
      description: "Keep older credit accounts open even if unused. Length of credit history accounts for 15% of your score.",
      icon: <Shield size={20} />
    },
    {
      title: "Limit Hard Inquiries",
      description: "Apply for new credit only when necessary. Multiple hard inquiries in a short period can lower your score.",
      icon: <Unlock size={20} />
    },
    {
      title: "Diversify Credit Mix",
      description: "Having different types of credit (credit cards, loans) can positively impact your score if managed responsibly.",
      icon: <TrendingUp size={20} />
    }
  ];

  return (
    <Card className="finance-card">
      <CardHeader>
        <CardTitle>CIBIL Score Improvement Strategies</CardTitle>
        <CardDescription>Effective ways to improve your credit score over time</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {improvementStrategies.map((strategy, index) => (
            <CreditTip
              key={index}
              title={strategy.title}
              description={strategy.description}
              icon={strategy.icon}
            />
          ))}
        </div>

        <div className="mt-4 p-4 bg-finance-100 rounded-lg text-gray-700 text-sm">
          <p className="font-medium mb-2">Did you know?</p>
          <p>CIBIL scores range from 300-900, with scores above 750 considered excellent. Most banks and financial institutions consider 750+ as a good CIBIL score for loan approval.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreditScoreImprovement;
