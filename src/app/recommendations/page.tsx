import { Header } from '@/components/layout/header';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, MapPin, DollarSign, CheckCircle } from 'lucide-react';

const mockJobs = [
  {
    title: 'Senior Frontend Engineer',
    company: 'Innovatech',
    location: 'Remote',
    salary: '$120,000 - $160,000',
    match: 92,
    skills: ['React', 'TypeScript', 'Next.js', 'GraphQL'],
    dataAiHint: 'office technology',
  },
  {
    title: 'Full Stack Developer',
    company: 'Data Solutions',
    location: 'New York, NY',
    salary: '$110,000 - $140,000',
    match: 85,
    skills: ['Node.js', 'React', 'MongoDB', 'Express'],
    dataAiHint: 'team meeting',
  },
  {
    title: 'UI/UX Designer',
    company: 'Creative Minds',
    location: 'San Francisco, CA',
    salary: '$90,000 - $120,000',
    match: 78,
    skills: ['Figma', 'Sketch', 'Adobe XD', 'User Research'],
    dataAiHint: 'designer desk',
  },
  {
    title: 'DevOps Engineer',
    company: 'CloudCo',
    location: 'Austin, TX',
    salary: '$130,000 - $170,000',
    match: 70,
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
    dataAiHint: 'server room',
  },
];

export default function RecommendationsPage() {
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mockJobs.map((job, index) => (
            <Card
              key={index}
              className="flex flex-col shadow-lg hover:shadow-2xl transition-shadow duration-300 animate-in fade-in-50"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="font-headline text-xl">
                      {job.title}
                    </CardTitle>
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
              <CardFooter>
                <Button className="w-full">Apply Now</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
