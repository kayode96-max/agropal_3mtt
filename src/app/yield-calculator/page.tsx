import { BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CalculatorForm from './calculator-form';

export default function YieldCalculatorPage() {
  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center text-center mb-10">
        <BarChart3 className="h-12 w-12 text-primary mb-4" />
        <h1 className="text-4xl font-bold tracking-tight font-headline">AI Farm Analysis Generator</h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
          Provide your farm's details to get an AI-powered analysis of your potential yield, revenue, and tailored recommendations.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>New Farm Analysis</CardTitle>
            <CardDescription>Enter your farm data below to generate a detailed report.</CardDescription>
          </CardHeader>
          <CardContent>
            <CalculatorForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
