
"use client";

import { useMemo, use } from "react";
import { doc } from "firebase/firestore";
import { useFirestore, useDoc } from "@/firebase";
import { Job } from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Building2, 
  MapPin, 
  Clock, 
  ChevronLeft, 
  ExternalLink,
  Share2,
  Bookmark
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const firestore = useFirestore();
  
  const jobRef = useMemo(() => {
    if (!firestore || !resolvedParams.id) return null;
    return doc(firestore, "jobs", resolvedParams.id);
  }, [firestore, resolvedParams.id]);

  const { data: job, loading } = useDoc<Job>(jobRef);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="bg-white p-8 rounded-xl border shadow-sm space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <div className="flex gap-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Job Not Found</h2>
        <p className="text-muted-foreground mt-2">The job posting you're looking for might have been removed or expired.</p>
        <Link href="/" className="mt-6 inline-block text-primary hover:underline font-bold">
          Back to all jobs
        </Link>
      </div>
    );
  }

  const dateStr = job.postedAt?.toDate ? formatDistanceToNow(job.postedAt.toDate(), { addSuffix: true }) : "Recent";

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 group">
        <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to job board
      </Link>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {/* Header Section */}
        <div className="p-6 md:p-8 border-b bg-muted/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <Badge variant="outline" className="bg-white text-primary border-primary/20 capitalize font-medium">
                {job.type}
              </Badge>
              <h1 className="text-3xl font-extrabold font-headline">{job.title}</h1>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary/70" />
                  <span className="font-medium text-foreground">{job.company}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary/70" />
                  {job.location}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary/70" />
                  Posted {dateStr}
                </div>
              </div>
            </div>
            <div className="flex flex-row md:flex-col gap-3 shrink-0">
               <a href={job.applyLink} target="_blank" rel="noopener noreferrer" className="flex-1 md:w-full">
                  <Button className="w-full gap-2 text-lg py-6" size="lg">
                    Apply Now
                    <ExternalLink className="h-5 w-5" />
                  </Button>
               </a>
               <div className="flex gap-3">
                 <Button variant="outline" size="icon" className="h-12 w-12">
                   <Bookmark className="h-5 w-5" />
                 </Button>
                 <Button variant="outline" size="icon" className="h-12 w-12">
                   <Share2 className="h-5 w-5" />
                 </Button>
               </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 md:p-8 space-y-8">
          <section>
            <h2 className="text-xl font-bold font-headline mb-4 border-l-4 border-primary pl-3">Job Description</h2>
            <div className="prose prose-blue max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {job.description}
            </div>
          </section>

          <div className="bg-primary/5 rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-4 border border-primary/10">
            <h3 className="font-bold text-lg">Interested in this position?</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Please click the apply button below to proceed with your application on the company's official career portal.
            </p>
            <a href={job.applyLink} target="_blank" rel="noopener noreferrer" className="w-full max-w-sm">
              <Button className="w-full gap-2">
                Apply on Company Website
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
