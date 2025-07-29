import { Leaf, History } from 'lucide-react';
import { DiagnoseForm } from './diagnose-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DiagnosePage() {
  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center text-center mb-10">
        <Leaf className="h-12 w-12 text-primary mb-4" />
        <h1 className="text-4xl font-bold tracking-tight font-headline">AI Crop Diagnosis</h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
          Upload a photo of an affected plant. Our AI will analyze it and provide a potential diagnosis and treatment suggestions.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <div className='flex justify-between items-center'>
                <div>
                    <CardTitle>New Diagnosis</CardTitle>
                    <CardDescription>Fill in the details below to start a new diagnosis.</CardDescription>
                </div>
                 <Button asChild variant="outline">
                    <Link href="/diagnose/history">
                        <History className="mr-2 h-4 w-4" />
                        View History
                    </Link>
                </Button>
            </div>
          </CardHeader>
          <CardContent>
            <DiagnoseForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
