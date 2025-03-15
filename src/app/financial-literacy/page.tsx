"use client";

import React from "react";
import ToolCard from "@/components/ToolCard/page";
import Link from "next/link";
import { 
  TrendingUp, Clock, FileText, ShoppingCart, 
  GraduationCap, Car, Home, ArrowDown, Target, DollarSign,Calculator,PieChart,Shield,CreditCard,Wallet,
  Sliders,Compass, BarChart2
} from "lucide-react";
import Head from "next/head";

export default function FinancialLiteracy() {
  const toolsList = [
    {
      title: "SIP Calculator",
      description: "Visualize how small, regular investments grow over time with compound interest.",
      icon: TrendingUp,
      path: "financial-literacy/Sip-Calculator",
    },
    {
      title: "Retirement Calculator",
      description: "Show retirement savings trajectory with adjustable parameters.",
      icon: Clock,
      path: "financial-literacy/Retirement-Calculator",
    },
    {
      title: "Tax Bracket Visualizer",
      description: "Show how marginal tax brackets work with a waterfall chart.",
      icon: FileText,
      path: "financial-literacy/Tax-Bracket",
    },
    {
      title: "Inflation Impact Calculator",
      description: "Demonstrate purchasing power erosion over time with interactive visuals.",
      icon: ShoppingCart,
      path: "financial-literacy/Inflation-Impact",
    },
    {
      title: "College Savings Calculator",
      description: "Project education costs and needed savings with adjustable parameters.",
      icon: GraduationCap,
      path: "financial-literacy/College-savings",
    },
    {
      title: "Car Lease vs. Buy Comparison",
      description: "Visual breakdown comparing total costs of leasing vs. buying a vehicle.",
      icon: Car,
      path: "financial-literacy/Car-lease-vs-buy",
    },
    {
      title: "Mortgage vs. Rent Comparison",
      description: "Line graph comparing the financial impact of renting vs. buying over time.",
      icon: Home,
      path: "financial-literacy/Mortgage-vs-Rent",
    },
    {
      title: "Debt Reduction Visualizer",
      description: "Compare different debt payoff strategies with visual timelines.",
      icon: ArrowDown,
      path: "financial-literacy/Debt-Reduction",
    },
    {
      title: "Goal-Based Savings Visualizer",
      description: "Track progress towards multiple savings goals with projected completion dates.",
      icon: Target,
      path: "financial-literacy/Goal-Based-Savings",
    },
    {
      title: "Budget Allocation",
      description: "Visualize your monthly budget allocation across different spending categories.",
      icon: DollarSign,
      path: "financial-literacy/Budget-allocation",
    },
  ];

  const featuredTools = [
    {
      title: "Investment Diversification",
      description: "Get personalized investment allocation recommendations based on your profile.",
      icon: PieChart,
      path: "financial-literacy/Investment-Diversification",
    },
    {
      title: "Income vs Expenses",
      description: "Visualize your cash flow and understand your spending patterns.",
      icon: Wallet,
      path: "financial-literacy/Income-vs-Expenses",
    },
    {
      title: "Net Worth Tracker",
      description: "Track your assets and liabilities to monitor your financial health.",
      icon: TrendingUp,
      path: "financial-literacy/Net-Worth-Tracker",
    },
    {
      title: "Emergency Fund",
      description: "Calculate and track your emergency fund savings progress.",
      icon: Shield,
      path: "financial-literacy/Emergency-Fund",
    },
    {
      title: "Credit Score Impact",
      description: "Understand how different actions affect your credit score.",
      icon: CreditCard,
      path: "financial-literacy/Credit-Score-Impact",
    }
  ];


  return (
    <>
      <Head>
        <title>Financial | Fiscal Flow Visuals</title>
        <meta name="description" content="Explore powerful financial calculators to make informed decisions on savings, investments, and budgeting." />
      </Head>

      <div className="space-y-8 p-4 bg-blue-50">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">Financial Calculators</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Powerful tools to help you calculate and visualize various financial scenarios. 
            Make better decisions with accurate projections and comparisons.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
          {toolsList.map((tool, index) => (
              <ToolCard key={index}
                title={tool.title}
                description={tool.description}
                icon={tool.icon}
                path={tool.path}
                delay={index}
              />
          ))}
        </div>

        <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Featured Tools</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTools.map((tool, index) => (
            <ToolCard
              key={tool.title}
              title={tool.title}
              description={tool.description}
              icon={tool.icon}
              path={tool.path}
              delay={index}
            />
          ))}
        </div>
      </section>
      </div>
    </>
  );
};
