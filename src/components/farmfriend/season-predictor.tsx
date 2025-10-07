
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { BrainCircuit, Calendar, CloudDrizzle, Sun, Leaf, Loader2, RefreshCcw, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { predictSeason, type PredictSeasonOutput } from '@/ai/flows/predict-season';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const formSchema = z.object({
  cropName: z.string().min(2, 'Please enter a valid crop name.'),
  location: z.string().min(2, 'Please enter a valid location.'),
});

type PredictionState = {
  status: 'idle' | 'loading' | 'success' | 'error';
  data: PredictSeasonOutput | null;
  error: string | null;
};

export function SeasonPredictor() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [prediction, setPrediction] = useState<PredictionState>({ status: 'idle', data: null, error: null });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { cropName: '', location: '' },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setPrediction({ status: 'loading', data: null, error: null });
    
    try {
      const result = await predictSeason(values);
      setPrediction({ status: 'success', data: result, error: null });
    } catch (error) {
      console.error(error);
      const errorMessage = "Failed to get prediction. Please try again.";
      setPrediction({ status: 'error', data: null, error: errorMessage });
      toast({
        variant: "destructive",
        title: "Prediction Failed",
        description: errorMessage,
      });
    }
  };
  
  const reset = () => {
    setPrediction({ status: 'idle', data: null, error: null });
    form.reset();
  }

  return (
    <section id="season-predictor" className="w-full">
        <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
            {t.seasonPredictorTitle}
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-4">
            {t.seasonPredictorDescription}
            </p>
        </div>

        <Card className="max-w-2xl mx-auto mt-8 shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BrainCircuit className="text-primary" />
                    {t.seasonPredictorCardTitle}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {prediction.status === 'idle' && (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="cropName"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your Crop</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Rice, Wheat" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your Location</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Punjab, India" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full">
                                <Sparkles className="mr-2 h-4 w-4" />
                                Get Prediction
                            </Button>
                        </form>
                    </Form>
                )}

                {prediction.status === 'loading' && (
                    <div className="flex flex-col items-center justify-center h-40 gap-2">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <p className="text-muted-foreground">AI is analyzing climate data...</p>
                    </div>
                )}

                {prediction.status === 'error' && (
                     <div className="flex flex-col items-center justify-center h-40 gap-4 text-center">
                        <p className="text-destructive">{prediction.error}</p>
                        <Button onClick={reset}>
                            <RefreshCcw className="mr-2 h-4 w-4"/>
                            Try Again
                        </Button>
                    </div>
                )}

                {prediction.status === 'success' && prediction.data && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                           <Card className="bg-secondary/50">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center justify-center gap-2"><Sun className="text-primary"/> Sowing Time</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold">{prediction.data.sowingPrediction}</p>
                                </CardContent>
                           </Card>
                           <Card className="bg-secondary/50">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center justify-center gap-2"><Calendar className="text-primary"/> Harvesting Time</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold">{prediction.data.harvestingPrediction}</p>
                                </CardContent>
                           </Card>
                        </div>
                        
                        <Alert>
                            <CloudDrizzle className="h-4 w-4" />
                            <AlertTitle>Weather Risk Assessment</AlertTitle>
                            <AlertDescription>{prediction.data.weatherRisk}</AlertDescription>
                        </Alert>
                        
                        {prediction.data.alternateCrops.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><Leaf /> Alternative Crop Suggestions</h3>
                                <div className="space-y-2">
                                    {prediction.data.alternateCrops.map(crop => (
                                        <Card key={crop.name}>
                                            <CardContent className="p-3">
                                                <p className="font-bold">{crop.name}</p>
                                                <p className="text-sm text-muted-foreground">{crop.reason}</p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="text-center mt-6">
                             <Button onClick={reset}>
                                <RefreshCcw className="mr-2 h-4 w-4"/>
                                New Prediction
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    </section>
  );
}
