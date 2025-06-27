'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Briefcase,
  MapPin,
  DollarSign,
  CheckCircle,
  BrainCircuit,
} from 'lucide-react';
import { getJobRecommendationsAction } from '@/app/actions';
import { type Job } from '@/ai/flows/job-recommender';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function JobCard({ job, index }: { job: Job; index: number }) {
  return (
    <Card
      className="flex flex-col shadow-lg hover:shadow-2xl transition-shadow duration-300 animate-in fade-in-50"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-headline text-xl">{job.title}</CardTitle>
            <CardDescription className="flex items-center gap-2 pt-1">
              <Briefcase className="h-4 w-4" /> {job.company}
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className={
              job.match > 80
                ? 'bg-accent text-accent-foreground border-transparent'
                : ''
            }
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            {job.match}% Match
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="flex items-center text-sm text-muted-foreground gap-2">
          <MapPin className="h-4 w-4" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground gap-2">
          <DollarSign className="h-4 w-4" />
          <span>{job.salary}</span>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-2">Top Skills</h4>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill, i) => (
              <Badge key={i} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="flex flex-col shadow-lg">
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <div>
              <Skeleton className="h-4 w-1/4 mb-2" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-1/5" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-6 w-1/3" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function RecommendationsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecommendations() {
      const storedSkills = localStorage.getItem('userSkills');
      if (!storedSkills) {
        setError(
          'No skills found. Please analyze your resume on the dashboard first.'
        );
        setLoading(false);
        return;
      }

      try {
        const skills = JSON.parse(storedSkills);
        const result = await getJobRecommendationsAction(skills);
        if (result.error) {
          setError(result.error);
        } else if (result.jobs) {
          setJobs(result.jobs);
        }
      } catch (e) {
        setError('Failed to parse skills or fetch recommendations.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 bg-background p-4 md:p-8">
        <div className="mb-8 max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight font-headline">
            Job Recommendations
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Based on your skills, here are jobs where you could be a great fit.
          </p>
        </div>

        {loading && <LoadingSkeleton />}

        {error && (
          <Alert variant="destructive" className="max-w-3xl mx-auto">
            <BrainCircuit className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}
              {error.startsWith('No skills found') && (
                <>
                  {' '}
                  <Link
                    href="/dashboard"
                    className="font-bold underline hover:text-destructive-foreground"
                  >
                    Go to Dashboard
                  </Link>
                </>
              )}
            </AlertDescription>
          </Alert>
        )}

        {!loading && !error && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {jobs.map((job, index) => (
              <JobCard key={index} job={job} index={index} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
