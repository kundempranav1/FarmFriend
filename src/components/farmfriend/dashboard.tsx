"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/contexts/language-context';
import { Sun, Cloud, CloudRain, Thermometer, Droplets, Wind, ArrowUp, ArrowDown, AlertTriangle, TestTube2, FlaskConical, LineChart, ShoppingCart, Leaf } from 'lucide-react';
import { Button } from '../ui/button';

const weatherData = {
  current: { temp: 28, humidity: 75, wind: 12, icon: Sun, alert: true },
  forecast: [
    { day: 'Mon', icon: Sun, temp: 29 },
    { day: 'Tue', icon: Cloud, temp: 27 },
    { day: 'Wed', icon: CloudRain, temp: 25 },
    { day: 'Thu', icon: Cloud, temp: 26 },
    { day: 'Fri', icon: Sun, temp: 30 },
  ],
};

const marketData = [
  { crop: 'Tomatoes', price: '₹25/kg', trend: 'up' },
  { crop: 'Potatoes', price: '₹18/kg', trend: 'down' },
  { crop: 'Onions', price: '₹22/kg', trend: 'up' },
  { crop: 'Wheat', price: '₹20/kg', trend: 'down' },
];

const soilData = {
  moisture: { value: 65, status: 'Optimal' },
  ph: { value: 6.8, status: 'Optimal' },
  nitrogen: { value: 40, status: 'Low' },
};

export function SmartDashboard() {
  const { t } = useLanguage();

  const getSoilStatusText = (status: string) => {
    if (status === 'Optimal') return t.optimal;
    if (status === 'Needs Water') return t.needsWater;
    if (status === 'Low') return t.low;
    if (status === 'High') return t.high;
    return status;
  }

  return (
    <section id="dashboard" className="w-full">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
          {t.dashboardTitle}
        </h2>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-4">
          {t.dashboardDescription}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
        {/* Weather Card */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Cloud className="text-primary"/> {t.weatherCardTitle}</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow space-y-4">
            <div className="flex justify-between items-center p-4 rounded-lg bg-secondary/50">
              <div>
                <p className="text-sm text-muted-foreground">{t.temperature}</p>
                <p className="text-4xl font-bold">{weatherData.current.temp}°C</p>
              </div>
              <weatherData.current.icon className="w-16 h-16 text-yellow-400" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2"><Droplets className="text-blue-400"/><span>{t.humidity}: {weatherData.current.humidity}%</span></div>
                <div className="flex items-center gap-2"><Wind className="text-gray-400"/><span>{t.windSpeed}: {weatherData.current.wind} km/h</span></div>
            </div>
            {weatherData.current.alert && (
              <div className="flex items-center gap-2 p-2 rounded-md bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800">
                <AlertTriangle className="h-5 w-5"/>
                <span className="text-sm font-medium">{t.severeWeather}</span>
              </div>
            )}
             <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><Leaf className="text-primary"/>{t.cropAdvisory}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{t.sowingTips}</p>
              </CardContent>
            </Card>
            <div className="flex justify-between text-center">
              {weatherData.forecast.map(day => (
                <div key={day.day} className="flex flex-col items-center gap-1">
                  <span className="text-sm font-medium">{day.day}</span>
                  <day.icon className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm">{day.temp}°</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Market Prices Card */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><LineChart className="text-primary"/>{t.marketPricesCardTitle}</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.crop}</TableHead>
                  <TableHead className="text-right">{t.price}</TableHead>
                  <TableHead className="text-right">{t.trend}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {marketData.map(item => (
                  <TableRow key={item.crop}>
                    <TableCell className="font-medium">{item.crop}</TableCell>
                    <TableCell className="text-right">{item.price}</TableCell>
                    <TableCell className="text-right">
                      {item.trend === 'up' 
                        ? <ArrowUp className="h-5 w-5 inline text-green-500" />
                        : <ArrowDown className="h-5 w-5 inline text-red-500" />
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-auto pt-4">
              <Button className="w-full">
                <ShoppingCart className="mr-2 h-4 w-4" /> {t.sellOnline}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Soil Card */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TestTube2 className="text-primary"/>{t.soilCardTitle}</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="text-sm font-medium flex items-center gap-2"><Droplets className="text-primary" /> {t.soilMoisture}</label>
                <span className={`text-sm font-semibold ${soilData.moisture.value > 50 ? 'text-green-600' : 'text-yellow-600'}`}>{getSoilStatusText(soilData.moisture.status)}</span>
              </div>
              <Progress value={soilData.moisture.value} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="text-sm font-medium flex items-center gap-2"><TestTube2 className="text-primary" /> {t.phLevel}</label>
                <span className="text-sm font-semibold text-green-600">{getSoilStatusText(soilData.ph.status)} ({soilData.ph.value})</span>
              </div>
              <Progress value={(soilData.ph.value / 14) * 100} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="text-sm font-medium flex items-center gap-2"><FlaskConical className="text-primary" /> {t.nitrogen}</label>
                <span className="text-sm font-semibold text-red-600">{getSoilStatusText(soilData.nitrogen.status)}</span>
              </div>
              <Progress value={soilData.nitrogen.value} />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
