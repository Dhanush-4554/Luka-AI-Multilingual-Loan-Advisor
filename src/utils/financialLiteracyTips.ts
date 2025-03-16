// Types for user financial information
export interface UserFinancialInfo {
  name?: string;
  age?: number;
  income?: number;
  expenses?: number;
  debt?: number;
  savingsGoal?: string;
  investmentExperience?: 'none' | 'beginner' | 'intermediate' | 'advanced';
  riskTolerance?: 'low' | 'medium' | 'high';
}

// Types for financial tips
export interface FinancialTip {
  title: string;
  description: string;
  category: 'budgeting' | 'saving' | 'investing' | 'debt' | 'retirement' | 'general';
  priority: number; // 1-10, higher is more important
}

/**
 * Generate personalized financial literacy tips based on user information
 */
export async function generateFinancialTips(userInfo: UserFinancialInfo): Promise<FinancialTip[]> {
  const tips: FinancialTip[] = [];
  
  // Add general tips that apply to everyone
  tips.push(...getGeneralTips());
  
  // Add age-specific tips
  if (userInfo.age) {
    tips.push(...getAgeTips(userInfo.age));
  }
  
  // Add income and expense related tips
  if (userInfo.income && userInfo.expenses) {
    tips.push(...getIncomeExpenseTips(userInfo.income, userInfo.expenses));
  }
  
  // Add debt-related tips
  if (userInfo.debt && userInfo.debt > 0) {
    tips.push(...getDebtTips(userInfo.debt, userInfo.income || 0));
  }
  
  // Add investment-related tips
  if (userInfo.investmentExperience) {
    tips.push(...getInvestmentTips(userInfo.investmentExperience, userInfo.riskTolerance || 'medium'));
  }
  
  // Sort tips by priority
  return tips.sort((a, b) => b.priority - a.priority);
}

/**
 * General financial tips that apply to everyone
 */
function getGeneralTips(): FinancialTip[] {
  return [
    {
      title: "Create an Emergency Fund",
      description: "Aim to save 3-6 months of essential expenses in an easily accessible account for emergencies.",
      category: "saving",
      priority: 10
    },
    {
      title: "Track Your Spending",
      description: "Use a budgeting app or spreadsheet to track where your money goes each month.",
      category: "budgeting",
      priority: 9
    },
    {
      title: "Review Your Credit Report",
      description: "Check your credit report annually for free to ensure accuracy and prevent identity theft.",
      category: "general",
      priority: 7
    },
    {
      title: "Set Clear Financial Goals",
      description: "Define specific, measurable, achievable, relevant, and time-bound (SMART) financial goals.",
      category: "general",
      priority: 8
    }
  ];
}

/**
 * Age-specific financial tips
 */
function getAgeTips(age: number): FinancialTip[] {
  if (age < 30) {
    return [
      {
        title: "Start Retirement Savings Early",
        description: "Even small contributions to retirement accounts in your 20s can grow significantly due to compound interest.",
        category: "retirement",
        priority: 9
      },
      {
        title: "Build Your Credit Score",
        description: "Establish good credit by paying bills on time and keeping credit card balances low.",
        category: "general",
        priority: 8
      },
      {
        title: "Invest in Your Skills",
        description: "Consider investing in education or skills that can increase your earning potential.",
        category: "general",
        priority: 7
      }
    ];
  } else if (age < 45) {
    return [
      {
        title: "Increase Retirement Contributions",
        description: "As your income grows, aim to maximize contributions to retirement accounts.",
        category: "retirement",
        priority: 9
      },
      {
        title: "Consider Life Insurance",
        description: "If you have dependents, evaluate whether life insurance is appropriate for your situation.",
        category: "general",
        priority: 7
      },
      {
        title: "Diversify Investments",
        description: "Ensure your investment portfolio is properly diversified across different asset classes.",
        category: "investing",
        priority: 8
      }
    ];
  } else if (age < 60) {
    return [
      {
        title: "Catch-Up Retirement Contributions",
        description: "Take advantage of catch-up contribution options for retirement accounts if you're behind on savings.",
        category: "retirement",
        priority: 10
      },
      {
        title: "Reduce High-Interest Debt",
        description: "Prioritize paying off high-interest debt before retirement.",
        category: "debt",
        priority: 9
      },
      {
        title: "Review Estate Planning",
        description: "Ensure you have a will, power of attorney, and healthcare directives in place.",
        category: "general",
        priority: 8
      }
    ];
  } else {
    return [
      {
        title: "Evaluate Retirement Readiness",
        description: "Review your retirement accounts and create a withdrawal strategy.",
        category: "retirement",
        priority: 10
      },
      {
        title: "Consider Healthcare Costs",
        description: "Plan for potential healthcare and long-term care expenses in retirement.",
        category: "general",
        priority: 9
      },
      {
        title: "Adjust Investment Risk",
        description: "Consider adjusting your investment portfolio to be more conservative as you approach or enter retirement.",
        category: "investing",
        priority: 8
      }
    ];
  }
}

/**
 * Income and expense related tips
 */
function getIncomeExpenseTips(income: number, expenses: number): FinancialTip[] {
  const savingsRate = (income - expenses) / income;
  
  if (expenses > income) {
    return [
      {
        title: "Reduce Expenses",
        description: "Your expenses exceed your income. Identify non-essential spending that can be reduced.",
        category: "budgeting",
        priority: 10
      },
      {
        title: "Increase Income Sources",
        description: "Consider side hustles, freelance work, or asking for a raise to increase your income.",
        category: "general",
        priority: 9
      },
      {
        title: "Create a Debt Repayment Plan",
        description: "If you're using debt to cover expenses, create a plan to reduce debt and balance your budget.",
        category: "debt",
        priority: 10
      }
    ];
  } else if (savingsRate < 0.1) {
    return [
      {
        title: "Increase Savings Rate",
        description: "Aim to save at least 10-15% of your income. Look for ways to reduce expenses or increase income.",
        category: "saving",
        priority: 9
      },
      {
        title: "Use the 50/30/20 Budget Rule",
        description: "Try allocating 50% of income to needs, 30% to wants, and 20% to savings and debt repayment.",
        category: "budgeting",
        priority: 8
      }
    ];
  } else if (savingsRate < 0.2) {
    return [
      {
        title: "Optimize Your Savings",
        description: "You're saving well. Consider allocating savings to different goals: emergency fund, retirement, and short-term goals.",
        category: "saving",
        priority: 7
      },
      {
        title: "Start Investing",
        description: "If you haven't already, consider investing some of your savings for long-term growth.",
        category: "investing",
        priority: 8
      }
    ];
  } else {
    return [
      {
        title: "Maximize Investment Opportunities",
        description: "With your excellent savings rate, ensure you're maximizing tax-advantaged investment accounts.",
        category: "investing",
        priority: 8
      },
      {
        title: "Consider Financial Independence",
        description: "At your current savings rate, explore the concept of financial independence/early retirement (FIRE).",
        category: "general",
        priority: 7
      }
    ];
  }
}

/**
 * Debt-related tips
 */
function getDebtTips(debt: number, income: number): FinancialTip[] {
  const debtToIncomeRatio = income > 0 ? debt / income : 999;
  
  if (debtToIncomeRatio > 0.5) {
    return [
      {
        title: "Reduce High Debt-to-Income Ratio",
        description: "Your debt level is high relative to your income. Focus on reducing debt as a top priority.",
        category: "debt",
        priority: 10
      },
      {
        title: "Debt Avalanche Method",
        description: "Consider paying minimum payments on all debts, then putting extra money toward the highest interest debt first.",
        category: "debt",
        priority: 9
      },
      {
        title: "Explore Debt Consolidation",
        description: "If you have high-interest debts, consider consolidating them at a lower interest rate.",
        category: "debt",
        priority: 8
      }
    ];
  } else if (debtToIncomeRatio > 0.3) {
    return [
      {
        title: "Balance Debt Repayment and Saving",
        description: "While your debt isn't critical, balance debt repayment with building emergency savings.",
        category: "debt",
        priority: 8
      },
      {
        title: "Refinance High-Interest Debt",
        description: "Look into options for refinancing high-interest debt to save on interest payments.",
        category: "debt",
        priority: 7
      }
    ];
  } else {
    return [
      {
        title: "Maintain Low Debt Levels",
        description: "Your debt-to-income ratio is manageable. Continue making regular payments and avoid taking on unnecessary debt.",
        category: "debt",
        priority: 6
      },
      {
        title: "Consider Strategic Debt",
        description: "Not all debt is bad. Low-interest debt for appreciating assets (like a home) can be part of a sound financial strategy.",
        category: "debt",
        priority: 5
      }
    ];
  }
}

/**
 * Investment-related tips
 */
function getInvestmentTips(experience: 'none' | 'beginner' | 'intermediate' | 'advanced', riskTolerance: 'low' | 'medium' | 'high'): FinancialTip[] {
  if (experience === 'none') {
    return [
      {
        title: "Start with Basic Investment Education",
        description: "Before investing, learn about different investment types, risk, diversification, and compound interest.",
        category: "investing",
        priority: 9
      },
      {
        title: "Consider Index Funds for Beginners",
        description: "Low-cost index funds or ETFs are often recommended for beginning investors due to built-in diversification.",
        category: "investing",
        priority: 8
      }
    ];
  } else if (experience === 'beginner') {
    return [
      {
        title: "Understand Asset Allocation",
        description: "Learn how to balance stocks, bonds, and other assets based on your time horizon and risk tolerance.",
        category: "investing",
        priority: 8
      },
      {
        title: "Maximize Tax-Advantaged Accounts",
        description: "Prioritize investing in tax-advantaged accounts like 401(k)s and IRAs before taxable accounts.",
        category: "investing",
        priority: 7
      }
    ];
  } else if (experience === 'intermediate') {
    return [
      {
        title: "Rebalance Your Portfolio Regularly",
        description: "Review and rebalance your investment portfolio at least annually to maintain your target asset allocation.",
        category: "investing",
        priority: 7
      },
      {
        title: "Consider Dollar-Cost Averaging",
        description: "Invest regularly regardless of market conditions to potentially reduce the impact of market volatility.",
        category: "investing",
        priority: 6
      }
    ];
  } else {
    return [
      {
        title: "Optimize Tax Efficiency",
        description: "Place tax-inefficient investments in tax-advantaged accounts and tax-efficient investments in taxable accounts.",
        category: "investing",
        priority: 7
      },
      {
        title: "Consider Alternative Investments",
        description: "With your experience, you might explore alternative investments like real estate or private equity for diversification.",
        category: "investing",
        priority: 6
      }
    ];
  }
}