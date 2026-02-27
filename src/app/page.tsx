
"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import JobCard, { Job } from "@/components/JobCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, Briefcase, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  useEffect(() => {
    const q = query(collection(db, "jobs"), orderBy("postedAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const jobsData: Job[] = [];
      snapshot.forEach((doc) => {
        jobsData.push({ id: doc.id, ...doc.data() } as Job);
      });
      setJobs(jobsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let result = jobs;

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(j => 
        j.title.toLowerCase().includes(lower) || 
        j.company.toLowerCase().includes(lower) ||
        j.description.toLowerCase().includes(lower)
      );
    }

    if (typeFilter !== "all") {
      result = result.filter(j => j.type === typeFilter);
    }

    if (locationFilter !== "all") {
      result = result.filter(j => j.location === locationFilter);
    }

    setFilteredJobs(result);
  }, [searchTerm, typeFilter, locationFilter, jobs]);

  const uniqueLocations = Array.from(new Set(jobs.map(j => j.location)));

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 font-headline text-primary">
          Find Your Dream Job Today
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          SwiftJobs connects top talent with industry-leading companies. Your next big career move starts here.
        </p>
      </section>

      {/* Search and Filters */}
      <section className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-primary/10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" />
              What are you looking for?
            </label>
            <Input 
              placeholder="Job title, keywords, or company..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              Job Type
            </label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Location
            </label>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="All locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {uniqueLocations.map(loc => (
                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold font-headline flex items-center gap-2">
            Latest Opportunities
            <span className="text-sm font-normal bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
            </span>
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-4 p-6 rounded-xl border bg-white">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-muted-foreground/30">
            <div className="max-w-xs mx-auto space-y-4">
              <SlidersHorizontal className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-semibold">No jobs found matching your criteria</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search terms to find what you're looking for.</p>
              <button 
                onClick={() => {setSearchTerm(""); setTypeFilter("all"); setLocationFilter("all");}}
                className="text-primary font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
