
"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/contexts/language-context';
import { Sun, Cloud, CloudRain, Thermometer, Droplets, Wind, ArrowUp, ArrowDown, TestTube2, FlaskConical, LineChart, ShoppingCart, Leaf, Loader2, AlertTriangle, Upload } from 'lucide-react';
import { Button } from '../ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { analyzeSoilHealth, type AnalyzeSoilHealthOutput } from '@/ai/flows/analyze-soil-health';

const marketData = [
  { crop: 'Tomatoes', price: '₹25/kg', trend: 'up' },
  { crop: 'Potatoes', price: '₹18/kg', trend: 'down' },
  { crop: 'Onions', price: '₹22/kg', trend: 'up' },
  { crop: 'Wheat', price: '₹20/kg', trend: 'down' },
];

const soilFormSchema = z.object({
  photo: z.custom<FileList>().refine(file => file?.length === 1, 'A soil photo is required.'),
});

type SoilAnalysisState = {
  status: 'idle' | 'loading' | 'success' | 'error';
  data: AnalyzeSoilHealthOutput | null;
  error: string | null;
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

const staticWeatherData = {
    name: 'Your Location',
    main: { temp: 28, humidity: 75 },
    wind: { speed: 10 },
    weather: [{ main: 'Clouds', icon: '04d' }],
};

const staticForecastData = [
    { dt: 1, weather: [{ icon: '02d' }], main: { temp: 29 } },
    { dt: 2, weather: [{ icon: '10d' }], main: { temp: 27 } },
    { dt: 3, weather: [{ icon: '01d' }], main: { temp: 30 } },
    { dt: 4, weather: [{ icon: '03d' }], main: { temp: 29 } },
    { dt: 5, weather: [{ icon: '04d' }], main: { temp: 28 } },
];


export function SmartDashboard() {
  const { t } = useLanguage();
  const [weatherData, setWeatherData] = useState<any>(null);
  const [forecastData, setForecastData] = useState<any>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  const [soilAnalysis, setSoilAnalysis] = useState<SoilAnalysisState>({
    status: 'idle',
    data: { soilMoisture: 65, phLevel: 6.8, nitrogenLevel: 40 },
    error: null,
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { toast } = useToast();
  
  const soilForm = useForm<z.infer<typeof soilFormSchema>>({
    resolver: zodResolver(soilFormSchema),
  });

  useEffect(() => {
    const fetchWeatherData = async (lat: number, lon: number) => {
      try {
        setLoadingWeather(true);
        setWeatherError(null);
        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
        if (!apiKey || typeof apiKey !== 'string' || apiKey === 'your_key' || apiKey.length < 30) {
            setWeatherError("Live weather is not configured. Using sample data.");
            setWeatherData(staticWeatherData);
            setForecastData(staticForecastData);
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
        setWeatherError("Could not fetch live weather data. Using sample data.");
        setWeatherData(staticWeatherData);
        setForecastData(staticForecastData);
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
          setWeatherError("Could not get your location. Using sample data.");
          setWeatherData(staticWeatherData);
          setForecastData(staticForecastData);
          setLoadingWeather(false);
        }
      );
    } else {
      setWeatherError("Geolocation is not supported. Using sample data.");
      setWeatherData(staticWeatherData);
      setForecastData(staticForecastData);
      setLoadingWeather(false);
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSoilSubmit = async (values: z.infer<typeof soilFormSchema>) => {
    setSoilAnalysis({ status: 'loading', data: null, error: null });
    setDialogOpen(false);

    try {
      const file = values.photo[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        const result = await analyzeSoilHealth({ photoDataUri: base64data });
        setSoilAnalysis({ status: 'success', data: result, error: null });
      };
      reader.onerror = () => {
        throw new Error("Failed to read file.");
      }
    } catch (error) {
      console.error(error);
      const errorMessage = "Failed to analyze soil image.";
      setSoilAnalysis({ status: 'error', data: null, error: errorMessage });
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: errorMessage,
      });
    }
  };
  
  const displayData = weatherData;
  const displayForecast = forecastData;
  const CurrentWeatherIcon = displayData ? weatherIconMapping[displayData.weather[0].icon] || Cloud : Cloud;


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
             <CardDescription>{displayData ? displayData.name : 'Loading location...'}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow space-y-4">
            {loadingWeather ? (
                <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            ) : displayData && displayForecast ? (
              <>
                {weatherError && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Weather Service Not Configured</AlertTitle>
                        <AlertDescription>
                            {weatherError} To enable live weather, add your OpenWeatherMap API key to a `.env.local` file.
                        </AlertDescription>
                    </Alert>
                )}
                <div className="flex justify-between items-center p-4 rounded-lg bg-secondary/50">
                  <div>
                    <p className="text-sm text-muted-foreground">{t.temperature}</p>
                    <p className="text-4xl font-bold">{Math.round(displayData.main.temp)}°C</p>
                  </div>
                  <CurrentWeatherIcon className="w-16 h-16 text-yellow-400" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2"><Droplets className="text-blue-400"/><span>{t.humidity}: {displayData.main.humidity}%</span></div>
                    <div className="flex items-center gap-2"><Wind className="text-gray-400"/><span>{t.windSpeed}: {displayData.wind.speed.toFixed(1)} km/h</span></div>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2"><Leaf className="text-primary"/>{t.cropAdvisory}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{t.sowingTips}</p>
                  </CardContent>
                </Card>
                <div className="flex justify-between text-center">
                  {displayForecast.map((day: any, index: number) => {
                      const Icon = weatherIconMapping[day.weather[0].icon] || Cloud;
                      const dayName = weatherError ? dayNames[(new Date().getDay() + index) % 7] : new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
                      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                      return (
                        <div key={day.dt} className="flex flex-col items-center gap-1">
                          <span className="text-sm font-medium">{dayName}</span>
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
            <CardDescription>Get AI-powered analysis of your soil.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow space-y-6">
            {soilAnalysis.status === 'loading' ? (
                <div className="flex flex-col items-center justify-center h-full gap-2">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-muted-foreground">Analyzing soil...</p>
                </div>
            ) : soilAnalysis.data ? (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <label className="text-sm font-medium flex items-center gap-2"><Droplets className="text-primary" /> {t.soilMoisture}</label>
                    <span className={`text-sm font-semibold`}>{soilAnalysis.data.soilMoisture.toFixed(1)}%</span>
                  </div>
                  <Progress value={soilAnalysis.data.soilMoisture} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <label className="text-sm font-medium flex items-center gap-2"><TestTube2 className="text-primary" /> {t.phLevel}</label>
                    <span className="text-sm font-semibold">{soilAnalysis.data.phLevel.toFixed(1)}</span>
                  </div>
                  <Progress value={(soilAnalysis.data.phLevel / 14) * 100} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <label className="text-sm font-medium flex items-center gap-2"><FlaskConical className="text-primary" /> {t.nitrogen}</label>
                    <span className="text-sm font-semibold">{soilAnalysis.data.nitrogenLevel.toFixed(1)}%</span>
                  </div>
                  <Progress value={soilAnalysis.data.nitrogenLevel} />
                </div>
              </>
            ) : (
                 <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
                    <p className="text-muted-foreground">Upload an image to analyze your soil's health.</p>
                </div>
            )}
          </CardContent>
          <CardFooter>
             <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <Upload className="mr-2 h-4 w-4" /> Analyze Soil Image
                  </Button>
                </DialogTrigger>
                <DialogContent>
                   <DialogHeader>
                    <DialogTitle>Upload Soil Image</DialogTitle>
                    <DialogDescription>
                      Upload a clear, well-lit photo of a soil sample for analysis.
                    </DialogDescription>
                  </DialogHeader>
                   <Form {...soilForm}>
                    <form onSubmit={soilForm.handleSubmit(onSoilSubmit)} className="space-y-4">
                       <FormField
                        control={soilForm.control}
                        name="photo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Soil Photo</FormLabel>
                            <FormControl>
                              <Input type="file" accept="image/*" onChange={(e) => { field.onChange(e.target.files); handleFileChange(e); }} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {previewImage && (
                        <div className="relative h-40 w-full">
                            <Image src={previewImage} alt="Preview" layout="fill" objectFit="contain" className="rounded-md" />
                        </div>
                      )}
                      <DialogFooter>
                        <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                        <Button type="submit">Analyze</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}

    