"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, CloudRain, CloudSun, Sun, Wind, Droplets, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getWeatherForecast, type GetWeatherForecastOutput } from "@/ai/flows/get-weather-forecast";
import Image from "next/image";

const weatherIcons: { [key: string]: React.ReactElement } = {
    "Partly Cloudy": <CloudSun className="h-8 w-8 text-accent animate-cloud-drift" />,
    "Sunny": <Sun className="h-8 w-8 text-accent animate-sun-glow" />,
    "Clear": <Sun className="h-8 w-8 text-accent animate-sun-glow" />,
    "Chance of rain": <CloudRain className="h-8 w-8 text-blue-400 animate-rain-fall" />,
    "Cloudy": <Cloud className="h-8 w-8 text-gray-400 animate-cloud-drift" />,
    "Rain": <CloudRain className="h-8 w-8 text-blue-400 animate-rain-fall" />,
    "Clouds": <Cloud className="h-8 w-8 text-gray-400 animate-cloud-drift" />,
    "Mist": <Cloud className="h-8 w-8 text-gray-400" />
};

function getWeatherIcon(condition: string, iconCode?: string, className?: string) {
    if (iconCode) {
        return <Image src={`https://openweathermap.org/img/wn/${iconCode}@2x.png`} alt={condition} width={48} height={48} className={cn(className)} />;
    }
    for (const key in weatherIcons) {
        if (condition.toLowerCase().includes(key.toLowerCase())) {
            const icon = weatherIcons[key];
            return React.cloneElement(icon, { className: cn(icon.props.className, className) });
        }
    }
    return <CloudSun className={cn("h-8 w-8 text-accent animate-cloud-drift", className)} />;
}


function WeatherSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-3">
                <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-5 w-3/4" />
                </CardContent>
            </Card>
            <Card className="lg:col-span-2">
                <CardHeader>
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-1/4 mt-1" />
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-16 w-16 rounded-full" />
                        <div>
                            <Skeleton className="h-12 w-24" />
                            <Skeleton className="h-5 w-32 mt-2" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                           <Skeleton className="h-6 w-6" />
                           <Skeleton className="h-5 w-12" />
                           <Skeleton className="h-3 w-16" />
                        </div>
                         <div className="flex flex-col items-center gap-1">
                           <Skeleton className="h-6 w-6" />
                           <Skeleton className="h-5 w-12" />
                           <Skeleton className="h-3 w-10" />
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-2/3" />
                </CardHeader>
                <CardContent className="space-y-4">
                    {[1,2,3].map(i => (
                        <div key={i} className="flex items-center justify-between">
                            <Skeleton className="h-5 w-1/3" />
                            <Skeleton className="h-8 w-8" />
                            <Skeleton className="h-5 w-1/4" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}


export default function WeatherPage() {
    const [weatherData, setWeatherData] = useState<GetWeatherForecastOutput | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchWeather = React.useCallback(() => {
        setError(null);
        setLoading(true);
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const data = await getWeatherForecast({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                    setWeatherData(data);
                } catch (apiError: any) {
                    console.error(apiError);
                    let errorMessage = apiError.message || "Could not fetch weather data. Please try again.";
                    setError(errorMessage);
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                if (err.code === err.PERMISSION_DENIED) {
                    setError("Location access denied. Please enable it in your browser settings to see local weather.");
                } else {
                    setError("Could not get your location. Please try again.");
                }
                setLoading(false);
            },
            { enableHighAccuracy: true }
        );
    }, []);
    
    useEffect(() => {
        fetchWeather();
    }, [fetchWeather]);

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-start mb-10">
                <h1 className="text-4xl font-bold tracking-tight font-headline">Weather Forecast</h1>
                {loading && <p className="mt-2 text-lg text-muted-foreground">Fetching your local weather...</p>}
                {error && <p className="mt-2 text-lg text-destructive">{error}</p>}
                {weatherData && !loading && !error && (
                    <p className="mt-2 text-lg text-muted-foreground">
                        AI-powered agricultural forecasts for your current location.
                    </p>
                )}
            </div>

            {loading && <WeatherSkeleton />}

            {error && !loading && (
                 <Alert variant="destructive" className="max-w-2xl">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {error}
                        <Button variant="link" onClick={fetchWeather} className="p-0 h-auto ml-1">Click to retry</Button>
                    </AlertDescription>
                </Alert>
            )}

            {weatherData && !loading && !error && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in-50">
                    <Card className="lg:col-span-3 bg-primary/90 text-primary-foreground shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-2xl">Today's Recommendation</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg">{weatherData.recommendation}</p>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2 shadow-lg">
                        <CardHeader>
                            <CardTitle className="font-headline">Current Conditions</CardTitle>
                            <CardDescription>{weatherData.location}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-8">
                            <div className="flex items-center gap-4">
                                {getWeatherIcon(weatherData.condition, weatherData.icon, "!h-16 !w-16")}
                                <div>
                                    <div className="text-5xl font-bold">{weatherData.temperature}</div>
                                    <div className="text-lg text-muted-foreground">{weatherData.condition}</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-center">
                                <div className="flex flex-col items-center">
                                    <Droplets className="h-6 w-6 text-primary" />
                                    <span className="font-semibold">{weatherData.humidity}</span>
                                    <span className="text-xs text-muted-foreground">Humidity</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <Wind className="h-6 w-6 text-primary" />
                                    <span className="font-semibold">{weatherData.wind}</span>
                                    <span className="text-xs text-muted-foreground">Wind</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="font-headline">3-Day Forecast</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {weatherData.forecast.map((day) => (
                                <div key={day.day} className="flex items-center justify-between">
                                    <span className="font-semibold w-1/3">{day.day}</span>
                                    <div className="w-1/3 flex justify-center">{getWeatherIcon(day.condition, day.icon)}</div>
                                    <span className="font-bold w-1/3 text-right">{day.temp}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
             )}
        </div>
    );
}
