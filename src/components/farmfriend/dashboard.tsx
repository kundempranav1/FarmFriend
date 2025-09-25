"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/contexts/language-context';
import { Sun, Cloud, CloudRain, Thermometer, Droplets, Wind, ArrowUp, ArrowDown, AlertTriangle, TestTube2, FlaskConical, LineChart, ShoppingCart, Leaf, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';

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

const weatherIconMapping: { [key: string]: React.ElementType } = {
  '01d': Sun, '01n': Sun,
  '02d': Cloud, '02n': Cloud,
  '03d': Cloud, '03n': Cloud,
  '04d': Cloud, '04n': Cloud,
  '09d': CloudRain, '09n': CloudRain,
  '10d': CloudRain, '10n': CloudRain,
  '11d': CloudRain, '11n': CloudRain,
  '13d': Cloud, '13n': Cloud,
  '50d': Cloud, '50n': Cloud,
};

export function SmartDashboard() {
  const { t } = useLanguage();
  const [weatherData, setWeatherData] = useState<any>(null);
  const [forecastData, setForecastData] = useState<any>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async (lat: number, lon: number) => {
      try {
        setLoadingWeather(true);
        setWeatherError(null);
        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
        if (!apiKey || typeof apiKey !== 'string') {
          setWeatherError("OpenWeather API key is not set. Please add `NEXT_PUBLIC_OPENWEATHER_API_KEY=your_key` to the .env file.");
          setLoadingWeather(false);
          return;
        }
        
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

        const [weatherResponse, forecastResponse] = await Promise.all([
          axios.get(weatherUrl),
          axios.get(forecastUrl)
        ]);

        setWeatherData(weatherResponse.data);

        // Process forecast to get one entry per day
        const dailyForecast: any[] = [];
        const forecastList = forecastResponse.data.list;
        const seenDays: { [key: string]: boolean } = {};

        forecastList.forEach((item: any) => {
          const day = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
          if (!seenDays[day] && dailyForecast.length < 5) {
            dailyForecast.push(item);
            seenDays[day] = true;
          }
        });

        setForecastData(dailyForecast);
      } catch (error: any) {
        console.error("Failed to fetch weather data:", error);
        if (error.response?.status === 401) {
            setWeatherError("Invalid OpenWeather API key. Please check your .env file.");
        } else {
            setWeatherError("Could not fetch weather data. Please try again later.");
        }
      } finally {
        setLoadingWeather(false);
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherData(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setWeatherError("Could not get your location. Please enable location services in your browser.");
          setLoadingWeather(false);
        }
      );
    } else {
      setWeatherError("Geolocation is not supported by your browser.");
      setLoadingWeather(false);
    }
  }, []);

  const getSoilStatusText = (status: string) => {
    if (status === 'Optimal') return t.optimal;
    if (status === 'Needs Water') return t.needsWater;
    if (status === 'Low') return t.low;
    if (status === 'High') return t.high;
    return status;
  }
  
  const CurrentWeatherIcon = weatherData ? weatherIconMapping[weatherData.weather[0].icon] || Cloud : Cloud;


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
             <CardDescription>{weatherData ? weatherData.name : 'Loading location...'}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow space-y-4">
            {loadingWeather ? (
                <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            ) : weatherError ? (
                <div className="flex flex-col justify-center items-center h-full text-center p-4">
                    <AlertCircle className="h-10 w-10 text-destructive mb-2" />
                    <p className="text-sm font-medium text-destructive">Weather Data Error</p>
                    <p className="text-xs text-muted-foreground">{weatherError}</p>
                </div>
            ) : weatherData && forecastData ? (
              <>
                <div className="flex justify-between items-center p-4 rounded-lg bg-secondary/50">
                  <div>
                    <p className="text-sm text-muted-foreground">{t.temperature}</p>
                    <p className="text-4xl font-bold">{Math.round(weatherData.main.temp)}°C</p>
                  </div>
                  <CurrentWeatherIcon className="w-16 h-16 text-yellow-400" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2"><Droplets className="text-blue-400"/><span>{t.humidity}: {weatherData.main.humidity}%</span></div>
                    <div className="flex items-center gap-2"><Wind className="text-gray-400"/><span>{t.windSpeed}: {weatherData.wind.speed.toFixed(1)} km/h</span></div>
                </div>
                {weatherData.weather[0].main === 'Rain' && (
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
                  {forecastData.map((day: any) => {
                      const Icon = weatherIconMapping[day.weather[0].icon] || Cloud;
                      return (
                        <div key={day.dt} className="flex flex-col items-center gap-1">
                          <span className="text-sm font-medium">{new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                          <Icon className="w-8 h-8 text-muted-foreground" />
                          <span className="text-sm">{Math.round(day.main.temp)}°</span>
                        </div>
                      )
                  })}
                </div>
              </>
            ) : null}
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
              <Link href="/sell-crops" passHref>
                <Button className="w-full">
                  <ShoppingCart className="mr-2 h-4 w-4" /> {t.sellOnline}
                </Button>
              </Link>
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

    