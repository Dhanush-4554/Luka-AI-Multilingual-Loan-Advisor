
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

interface AllocationItem {
  name: string;
  value: number;
  color: string;
}

interface Props {
  allocation: AllocationItem[];
}

const InvestmentAllocationChart = ({ allocation }: Props) => {
  const renderTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
          <p className="text-sm font-semibold">{`${payload[0].name}: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="finance-card">
      <CardHeader>
        <CardTitle>Asset Allocation Chart</CardTitle>
        <CardDescription>Visual breakdown of your investment portfolio</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={allocation}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                label={({ name, value }) => `${name}: ${value}%`}
                dataKey="value"
              >
                {allocation.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={renderTooltip} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-start gap-2 bg-finance-100 p-4 rounded-lg text-sm">
          <Info className="text-finance-700 mt-0.5 h-5 w-5 flex-shrink-0" />
          <p className="text-gray-600">
            This chart shows the recommended allocation of your investment portfolio across different asset classes.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentAllocationChart;
