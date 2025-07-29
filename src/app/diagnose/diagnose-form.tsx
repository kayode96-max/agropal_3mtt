
'use client';

import { useState, type FormEvent, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle, Upload, Award } from 'lucide-react';
import { diagnoseCropIssue, type DiagnoseCropIssueOutput } from '@/ai/flows/diagnose-crop-issue';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export function DiagnoseForm() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [details, setDetails] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DiagnoseCropIssueOutput | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 4 * 1024 * 1024) { // 4MB limit for some genAI models
        setError("File is too large. Please upload an image under 4MB.");
        return;
      }
      setFile(selectedFile);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload a photo of the plant.');
      return;
    }
    if (!user) {
        setError("You must be logged in to run a diagnosis.");
        return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const photoDataUri = await fileToDataUri(file);
      const diagnosisResult = await diagnoseCropIssue({
        photoDataUri,
        additionalDetails: details,
      });
      setResult(diagnosisResult);

      // Save to firestore
      await addDoc(collection(db, 'diagnoses'), {
          userId: user.uid,
          createdAt: serverTimestamp(),
          photoDataUri,
          additionalDetails: details,
          ...diagnosisResult
      });
      toast({
          title: "Diagnosis Saved",
          description: "Your diagnosis has been saved to your history."
      })

    } catch (err) {
      setError('An error occurred during diagnosis. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setDetails('');
    setIsLoading(false);
    setError(null);
    setResult(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  return (
    <div>
      {!result ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="plant-photo">Plant Photo</Label>
            <Input
              id="plant-photo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              ref={fileInputRef}
            />
             <div 
                className="w-full h-64 border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted"
                onClick={handleFileClick}
                onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files) { handleFileChange({ target: { files: e.dataTransfer.files } } as any) } }}
                onDragOver={(e) => e.preventDefault()}
            >
                {preview ? (
                    <Image src={preview} alt="Plant preview" width={256} height={256} className="h-full w-full object-contain p-2 rounded-lg" />
                ) : (
                    <div className="text-center text-muted-foreground">
                        <Upload className="mx-auto h-12 w-12" />
                        <p>Click to upload or drag and drop</p>
                        <p className="text-xs">PNG, JPG, GIF up to 4MB</p>
                    </div>
                )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="details">Additional Details (Optional)</Label>
            <Textarea
              id="details"
              placeholder="e.g., 'The spots appeared 3 days ago', 'The plant is in a waterlogged area...'"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" disabled={isLoading || !file} className="w-full">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isLoading ? 'Diagnosing...' : 'Diagnose Plant'}
          </Button>
        </form>
      ) : (
        <div className="space-y-6 animate-in fade-in-50">
          <Card className="bg-secondary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline"><CheckCircle className="text-primary"/>Diagnosis Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">Diagnosis</h3>
                <p>{result.diagnosis}</p>
              </div>
               <div>
                <h3 className="font-semibold text-lg">Recommended Treatment</h3>
                 <div className="text-sm">
                    {result.treatmentSolutions.split('\n').map((line, index) => (
                        <p key={index} className="mb-1">{line}</p>
                    ))}
                 </div>
              </div>
              <div>
                <Label className="flex items-center gap-1"><Award className="h-4 w-4"/>Confidence Score</Label>
                <div className="w-full bg-muted rounded-full h-2.5 mt-1">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: `${result.confidenceScore * 100}%` }}></div>
                </div>
                <p className="text-right text-sm font-bold text-primary">{(result.confidenceScore * 100).toFixed(0)}%</p>
              </div>
            </CardContent>
          </Card>
          <Button onClick={handleReset} variant="outline" className="w-full">
            Start New Diagnosis
          </Button>
        </div>
      )}
    </div>
  );
}
