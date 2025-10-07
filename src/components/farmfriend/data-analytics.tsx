
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart as LineChartIcon, TrendingUp, TrendingDown, Wheat, Droplets, FlaskConical } from "lucide-react";
import { Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart } from 'recharts';

const yieldData = [
  { name: 'Wheat', predictedYield: 4500, lastYear: 4200 },
  { name: 'Rice', predictedYield: 5200, lastYear: 5000 },
  { name: 'Corn', predictedYield: 7000, lastYear: 6800 },
  { name: 'Soybean', predictedYield: 3000, lastYear: 3100 },
];

const soilHistoryData = [
  { month: 'Jan', nitrogen: 35, ph: 6.5, moisture: 60 },
  { month: 'Feb', nitrogen: 38, ph: 6.4, moisture: 55 },
  { month: 'Mar', nitrogen: 42, ph: 6.6, moisture: 65 },
  { month: 'Apr', nitrogen: 40, ph: 6.5, moisture: 70 },
  { month: 'May', nitrogen: 37, ph: 6.7, moisture: 62 },
];

const profitData = [
    { name: 'Q1', income: 4000, expenses: 2400 },
    { name: 'Q2', income: 3000, expenses: 1398 },
    { name: 'Q3', income: 9800, expenses: 2000 },
    { name: 'Q4', income: 5780, expenses: 3908 },
];


export function DataAnalytics() {
  return (
    <section id="data-analytics" className="w-full">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
          Data Analytics & Reports
        </h2>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-4">
          Insights to help you grow smarter and more profitably.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Wheat className="text-primary"/> Yield Prediction</CardTitle>
            <CardDescription>Estimated yield for this season based on current data.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={yieldData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'kg/acre', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="predictedYield" fill="hsl(var(--primary))" name="Predicted Yield" />
                <Bar dataKey="lastYear" fill="hsl(var(--muted))" name="Last Year" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="text-primary"/> Profitability Analysis</CardTitle>
            <CardDescription>Quarterly income vs. expenses report.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={profitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Amount (₹)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="hsl(var(--primary))" name="Income" />
                <Bar dataKey="expenses" fill="hsl(var(--destructive))" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><LineChartIcon className="text-primary"/> Soil Nutrient History</CardTitle>
            <CardDescription>Track your soil health over the past few months.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={soilHistoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="nitrogen" stroke="hsl(var(--chart-1))" name="Nitrogen" />
                    <Line type="monotone" dataKey="ph" stroke="hsl(var(--chart-2))" name="pH Level" />
                    <Line type="monotone" dataKey="moisture" stroke="hsl(var(--chart-5))" name="Moisture (%)" />
                </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
