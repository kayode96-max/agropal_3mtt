
"use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, TrendingUp, DollarSign, Lightbulb, ShieldAlert, BarChartBig } from 'lucide-react';
import { generateFarmAnalysis, type GenerateFarmAnalysisOutput } from '@/ai/flows/generate-farm-analysis';

const cropData = {
    maize: { name: 'Maize' },
    cassava: { name: 'Cassava' },
    yam: { name: 'Yam' },
    rice: { name: 'Rice' },
    tomatoes: { name: 'Tomatoes' },
    peppers: { name: 'Peppers' },
};

type CropKey = keyof typeof cropData;

export default function CalculatorForm() {
    const [crop, setCrop] = useState<CropKey>('maize');
    const [area, setArea] = useState<string>('1');
    const [soilType, setSoilType] = useState('');
    const [region, setRegion] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<GenerateFarmAnalysisOutput | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!crop || !area || !soilType || !region) {
            setError("Please fill in all fields to generate the analysis.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const analysisResult = await generateFarmAnalysis({
                crop: cropData[crop].name,
                landArea: `${area} acres`,
                soilType: soilType,
                region: region,
            });
            setResult(analysisResult);
        } catch (err) {
            console.error("Error generating farm analysis:", err);
            setError("An error occurred while generating the analysis. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleReset = () => {
        setResult(null);
        setIsLoading(false);
        setError(null);
    }

    if (isLoading) {
        return (
            <div className="text-center p-10 flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary"/>
                <p className="text-muted-foreground">Our AI is analyzing your farm... <br/>This may take a moment.</p>
            </div>
        )
    }
    
    if (result) {
        return (
            <div className="space-y-6 animate-in fade-in-50">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline"><BarChartBig/> Farm Analysis Report</CardTitle>
                         <CardDescription>A detailed projection for your {cropData[crop].name} farm.</CardDescription>
                    </CardHeader>
                 </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2"><TrendingUp/>Yield & Revenue Projection</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                       <p><strong className="font-semibold">Yield Prediction:</strong> {result.yieldPrediction}</p>
                       <p><strong className="font-semibold">Revenue Projection:</strong> {result.revenueProjection}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2"><DollarSign/>Profitability Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                       <p><strong className="font-semibold">Estimated Costs:</strong> {result.profitAnalysis.estimatedCosts}</p>
                       <p><strong className="font-semibold">Projected Net Profit:</strong> {result.profitAnalysis.projectedNetProfit}</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2"><Lightbulb/>AI Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent className="whitespace-pre-wrap text-sm">{result.recommendations}</CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2"><ShieldAlert/>Potential Risks</CardTitle>
                    </CardHeader>
                    <CardContent className="whitespace-pre-wrap text-sm">{result.riskAssessment}</CardContent>
                </Card>
                <Button onClick={handleReset} variant="outline" className="w-full">
                    Start New Analysis
                </Button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
                <Label htmlFor="crop-select">Select Crop</Label>
                <Select onValueChange={(v) => setCrop(v as CropKey)} value={crop}>
                    <SelectTrigger id="crop-select">
                        <SelectValue placeholder="Select a crop" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(cropData).map(([key, value]) => (
                            <SelectItem key={key} value={key}>{value.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="land-area">Total Land Area (acres)</Label>
                <Input id="land-area" type="number" placeholder="e.g., 2.5" value={area} onChange={e => setArea(e.target.value)} />
            </div>

             <div className="space-y-1.5">
                <Label htmlFor="soil-type">Dominant Soil Type</Label>
                <Select onValueChange={setSoilType} value={soilType}>
                    <SelectTrigger id="soil-type">
                        <SelectValue placeholder="Select soil type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Loam">Loamy (Fertile, good drainage)</SelectItem>
                        <SelectItem value="Sandy">Sandy (Good drainage, low nutrients)</SelectItem>
                        <SelectItem value="Clay">Clay (Poor drainage, high nutrients)</SelectItem>
                        <SelectItem value="Silt">Silty (Good water retention)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="post-region">Region in Nigeria</Label>
                <Select onValueChange={setRegion} value={region}>
                    <SelectTrigger id="post-region">
                        <SelectValue placeholder="Select your farm's region" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="North-West">North-West</SelectItem>
                        <SelectItem value="North-East">North-East</SelectItem>
                        <SelectItem value="North-Central">North-Central (Middle Belt)</SelectItem>
                        <SelectItem value="South-West">South-West</SelectItem>
                        <SelectItem value="South-East">South-East</SelectItem>
                        <SelectItem value="South-South">South-South (Niger Delta)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Farm Analysis
            </Button>
        </form>
    );
}
