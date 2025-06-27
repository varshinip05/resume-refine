'use client';

import { useState, useTransition, useRef } from 'react';
import { analyzeResumeAction, type AnalysisResult } from '@/app/actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Loader2,
  UploadCloud,
  FileText,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '../ui/badge';
import { useToast } from '@/hooks/use-toast';

export function DashboardClient() {
  const [state, setState] = useState<AnalysisResult | null>(null);
  const [fileName, setFileName] = useState('');
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      // Reset state when a new file is selected
      setState(null);
    } else {
      setFileName('');
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const file = formData.get('resume') as File;

    if (!file || file.size === 0) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please select a PDF resume file to analyze.',
      });
      return;
    }

    startTransition(async () => {
      const result = await analyzeResumeAction(formData);
      setState(result);
      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description: result.error,
        });
      } else if (result.skills) {
        // Store skills for the recommendations page
        localStorage.setItem('userSkills', JSON.stringify(result.skills));
      }
    });
  };

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <Card className="shadow-lg h-full">
          <CardHeader>
            <CardTitle className="font-headline">Upload Your Resume</CardTitle>
            <CardDescription>
              Upload your resume in PDF format to get an AI-powered analysis.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resume">Resume File</Label>
                <Input
                  id="resume"
                  name="resume"
                  type="file"
                  accept=".pdf"
                  required
                  onChange={handleFileChange}
                  disabled={isPending}
                />
                {fileName && (
                  <p className="text-sm text-muted-foreground">
                    Selected file: {fileName}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
                  </>
                ) : (
                  <>
                    <UploadCloud className="mr-2 h-4 w-4" /> Analyze Resume
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        {!state && !isPending && (
          <div className="flex flex-col items-center justify-center h-full rounded-lg border-2 border-dashed border-muted p-12 text-center bg-card/50">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium font-headline">
              Awaiting Resume
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Your analysis results will appear here once you upload a resume.
            </p>
          </div>
        )}

        {isPending && (
          <div className="flex flex-col items-center justify-center h-full rounded-lg border-2 border-dashed border-muted p-12 text-center bg-card/50">
            <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin" />
            <h3 className="mt-4 text-lg font-medium font-headline">
              Analyzing your resume...
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              This might take a moment. We&apos;re extracting your skills and
              generating feedback.
            </p>
          </div>
        )}

        {state && !state.error && (
          <Card className="shadow-lg animate-in fade-in-50">
            <CardHeader className="flex flex-row items-center gap-4">
              <CheckCircle className="h-8 w-8 text-accent" />
              <div>
                <CardTitle className="font-headline">
                  Analysis Complete
                </CardTitle>
                <CardDescription>
                  Here&apos;s what we found in your resume.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 font-headline flex items-center gap-2">
                  <Sparkles className="text-primary" /> Extracted Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {state.skills?.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 font-headline flex items-center gap-2">
                  <Lightbulb className="text-yellow-500" />
                  Suggestions for Improvement
                </h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted/50 p-3 rounded-md">
                  {state.suggestions}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 font-headline flex items-center gap-2">
                  <AlertTriangle className="text-orange-500" />
                  Identified Skill Gaps
                </h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted/50 p-3 rounded-md">
                  {state.skillGaps}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 font-headline flex items-center gap-2">
                  <FileText className="text-blue-500" />
                  Overall Feedback
                </h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted/50 p-3 rounded-md">
                  {state.feedback}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
