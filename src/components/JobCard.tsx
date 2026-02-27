
"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MapPin, Building2, Clock, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  applyLink: string;
  postedAt: any;
}

export default function JobCard({ job }: { job: Job }) {
  const dateStr = job.postedAt?.toDate ? formatDistanceToNow(job.postedAt.toDate(), { addSuffix: true }) : "Recent";

  return (
    <Card className="hover:shadow-md transition-all border-l-4 border-l-primary/20 hover:border-l-primary group">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold font-headline group-hover:text-primary transition-colors">{job.title}</h3>
            <div className="flex items-center text-muted-foreground mt-1 gap-1">
              <Building2 className="h-4 w-4" />
              <span className="text-sm font-medium">{job.company}</span>
            </div>
          </div>
          <Badge variant={job.type === 'Full-time' ? 'default' : 'secondary'} className="rounded-md">
            {job.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {job.location}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {dateStr}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/jobs/${job.id}`} className="w-full">
          <button className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-semibold text-primary bg-primary/10 rounded-md hover:bg-primary hover:text-white transition-colors">
            View Details
            <ArrowRight className="h-4 w-4" />
          </button>
        </Link>
      </CardFooter>
    </Card>
  );
}
