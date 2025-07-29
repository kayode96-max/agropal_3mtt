'use server';

/**
 * @fileOverview A Genkit flow for fetching weather data using Google AI.
 * 
 * - getWeatherForecast - Fetches current weather and a 5-day forecast.
 * - GetWeatherForecastInput - The input type for the getWeatherForecast function.
 * - GetWeatherForecastOutput - The return type for the getWeatherForecast function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GetWeatherForecastInputSchema = z.object({
  latitude: z.number().describe('The latitude for the weather forecast.'),
  longitude: z.number().describe('The longitude for the weather forecast.'),
});
export type GetWeatherForecastInput = z.infer<typeof GetWeatherForecastInputSchema>;

const DailyForecastSchema = z.object({
    day: z.string().describe("The day of the week for the forecast (e.g., 'Tomorrow', 'Wednesday')."),
    temp: z.string().describe("The forecasted temperature, including units (e.g., '28°C')."),
    condition: z.string().describe("A brief description of the weather condition (e.g., 'Partly Cloudy')."),
    icon: z.string().optional().describe("An icon code representing the condition (e.g., '04d'). The AI should infer this from the condition."),
});

const GetWeatherForecastOutputSchema = z.object({
  location: z.string().describe('The city and country name for the weather data.'),
  temperature: z.string().describe('The current temperature in Celsius.'),
  condition: z.string().describe('The current weather condition.'),
  humidity: z.string().describe('The current humidity percentage.'),
  wind: z.string().describe('The current wind speed in km/h.'),
  icon: z.string().optional().describe('The icon code for the current weather condition.'),
  forecast: z.array(DailyForecastSchema).describe('An array of 3-day weather forecasts.'),
  recommendation: z.string().optional().describe('An agricultural recommendation based on the weather.'),
});
export type GetWeatherForecastOutput = z.infer<typeof GetWeatherForecastOutputSchema>;

export async function getWeatherForecast(input: GetWeatherForecastInput): Promise<GetWeatherForecastOutput> {
  return getWeatherForecastFlow(input);
}


const weatherPrompt = ai.definePrompt({
    name: 'weatherPrompt',
    input: { schema: GetWeatherForecastInputSchema },
    output: { schema: GetWeatherForecastOutputSchema },
    prompt: `You are a weather forecasting expert. Your task is to provide a precise weather forecast based on the given latitude and longitude. 
    
    It is crucial that you identify the exact city, state, and country for the coordinates provided. Do not default to a major city if the coordinates point to a different location.
    
    Provide the current weather and a 3-day forecast.
    Also provide a simple, one-sentence agricultural recommendation based on the overall forecast. For example: "Good day for planting. Soil moisture is adequate." or "High winds expected, consider protecting young plants."
    
    Latitude: {{{latitude}}}
    Longitude: {{{longitude}}}
    
    Infer a weather icon code from openweathermap icon list based on the condition. For example, for "clear sky" use "01d" for day or "01n" for night. For "few clouds" use "02d" or "02n". For "scattered clouds" use "03d" or "03n". For "broken clouds" or "overcast clouds" use "04d" or "04n". For "shower rain" use "09d". For "rain" use "10d". For "thunderstorm" use "11d". For "snow" use "13d". For "mist" use "50d".
    
    Respond ONLY with the JSON object conforming to the output schema.`,
});


const getWeatherForecastFlow = ai.defineFlow(
  {
    name: 'getWeatherForecastFlow',
    inputSchema: GetWeatherForecastInputSchema,
    outputSchema: GetWeatherForecastOutputSchema,
  },
  async (input) => {
    const { output } = await weatherPrompt(input);
    if (!output) {
      throw new Error("Failed to get a weather forecast from the AI model.");
    }
    return output;
  }
);
