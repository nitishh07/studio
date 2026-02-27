"use client";

import { useState, useEffect } from "react";
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
  const [dateStr, setDateStr] = useState<string>("Recently");

  useEffect(() => {
    if (job.postedAt) {
      try {
        if (job.postedAt.toDate) {
          setDateStr(formatDistanceToNow(job.postedAt.toDate(), { addSuffix: true }));
        } else if (typeof job.postedAt === 'string') {
          setDateStr(job.postedAt);
        } else if (job.postedAt.seconds) {
          setDateStr(formatDistanceToNow(new Date(job.postedAt.seconds * 1000), { addSuffix: true }));
        }
      } catch (e) {
        setDateStr("Recently");
      }
    }
  }, [job.postedAt]);

  return (
    <Card className="flex flex-col h-full hover:shadow-2xl transition-all duration-300 border border-primary/5 rounded-[2rem] overflow-hidden group hover:-translate-y-2 bg-white">
      <CardHeader className="pb-4 pt-8 px-8">
        <div className="flex justify-between items-start gap-4 mb-4">
          <Badge variant="outline" className="rounded-lg px-3 py-1 font-bold text-primary border-primary/10 bg-primary/5">
            {job.type}
          </Badge>
          <div className="text-xs font-bold text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {dateStr}
          </div>
        </div>
        <h3 className="text-2xl font-black font-headline leading-tight group-hover:text-primary transition-colors">{job.title}</h3>
        <div className="flex items-center text-muted-foreground mt-3 gap-2">
          <div className="bg-muted p-1.5 rounded-lg">
            <Building2 className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold uppercase tracking-wider">{job.company}</span>
        </div>
      </CardHeader>
      <CardContent className="pb-6 px-8 flex-grow">
        <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
          <MapPin className="h-4 w-4 text-primary" />
          {job.location}
        </div>
        <p className="mt-4 text-muted-foreground line-clamp-3 leading-relaxed">
          {job.description}
        </p>
      </CardContent>
      <CardFooter className="pt-0 pb-8 px-8">
        <Link href={`/jobs/${job.id}`} className="w-full">
          <button className="flex items-center justify-center w-full gap-3 px-6 py-4 text-base font-black text-primary bg-primary/5 rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm hover:shadow-primary/20">
            Details
            <ArrowRight className="h-5 w-5" />
          </button>
        </Link>
      </CardFooter>
    </Card>
  );
}
