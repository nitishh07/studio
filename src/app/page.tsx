
"use client";

import { useState, useMemo } from "react";
import { collection, query, orderBy } from "firebase/firestore";
import { useFirestore, useCollection } from "@/firebase";
import JobCard, { Job } from "@/components/JobCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, Briefcase, MapPin, CheckCircle, Users, Globe, Zap, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function HomePage() {
  const firestore = useFirestore();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  const jobsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, "jobs"), orderBy("postedAt", "desc"));
  }, [firestore]);

  const { data: jobs, loading } = useCollection<Job>(jobsQuery);

  const filteredJobs = useMemo(() => {
    if (!jobs) return [];
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

    return result;
  }, [searchTerm, typeFilter, locationFilter, jobs]);

  const uniqueLocations = useMemo(() => {
    if (!jobs) return [];
    return Array.from(new Set(jobs.map(j => j.location)));
  }, [jobs]);

  const aboutImage = PlaceHolderImages.find(img => img.id === 'about-team')?.imageUrl || "";

  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -z-10" />
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 font-headline text-primary animate-in fade-in slide-in-from-bottom-4 duration-700">
            Find Your Dream Job <span className="text-accent">Today</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            SwiftJobs connects top talent with industry-leading companies. Your next big career move starts here with our simple, clean, and fast platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#jobs" className="px-8 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25">
              Browse Jobs
            </a>
            <a href="#features" className="px-8 py-3 bg-white border border-primary/20 text-primary font-bold rounded-full hover:bg-primary/5 transition-all">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-primary/10">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">10k+</div>
            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Active Jobs</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">500+</div>
            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Companies</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">24/7</div>
            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Support</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">98%</div>
            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Success Rate</div>
          </div>
        </div>
      </section>

      {/* Jobs Search & Listings Section */}
      <section id="jobs" className="container mx-auto px-4 scroll-mt-20">
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold font-headline mb-4">Search Opportunities</h2>
          <p className="text-muted-foreground">Filter through our curated list of available positions.</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-primary/10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <Search className="h-4 w-4 text-primary" />
                Keywords
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
        </div>

        {/* Job Listings Grid */}
        <div>
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
                <h3 className="text-lg font-semibold">No results found</h3>
                <p className="text-muted-foreground">Try adjusting your filters to find more opportunities.</p>
                <button 
                  onClick={() => {setSearchTerm(""); setTypeFilter("all"); setLocationFilter("all");}}
                  className="text-primary font-bold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* How it Works Section */}
      <section id="features" className="bg-muted/30 py-20 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold font-headline mb-4">How it Works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Getting started with SwiftJobs is easy. Follow these simple steps to your next career.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border shadow-sm flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-6">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Search</h3>
              <p className="text-muted-foreground leading-relaxed">Filter by role, company, or location to find the perfect match for your skills.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border shadow-sm flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-6">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">2. Quick View</h3>
              <p className="text-muted-foreground leading-relaxed">Read detailed job descriptions generated by our AI-assisted platform to know the role.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border shadow-sm flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-6">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Apply</h3>
              <p className="text-muted-foreground leading-relaxed">Connect directly with company portals and start your application process immediately.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="container mx-auto px-4 scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-video lg:aspect-square rounded-2xl overflow-hidden shadow-2xl">
            <Image 
              src={aboutImage} 
              alt="About SwiftJobs" 
              fill 
              className="object-cover"
              data-ai-hint="team working"
            />
          </div>
          <div className="space-y-6">
            <div className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-bold tracking-wide uppercase">
              About Us
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold font-headline leading-tight">
              Empowering Careers with <span className="text-primary">Simplicity</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              At SwiftJobs, we believe the job search process shouldn't be overwhelming. Our mission is to streamline the connection between talented individuals and forward-thinking companies.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="mt-1 bg-primary/20 p-1 rounded-full">
                  <ArrowRight className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold">Transparent Listings</h4>
                  <p className="text-muted-foreground text-sm">Every posting is verified and clear about requirements and location.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 bg-primary/20 p-1 rounded-full">
                  <ArrowRight className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold">AI-Powered Descriptions</h4>
                  <p className="text-muted-foreground text-sm">We use cutting-edge AI to help companies craft clear, informative job listings.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 bg-primary/20 p-1 rounded-full">
                  <ArrowRight className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold">User-Centric Design</h4>
                  <p className="text-muted-foreground text-sm">A distraction-free interface focused purely on getting you hired.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Info Section (Website Info) */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div className="space-y-4">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <Globe className="h-6 w-6 text-accent" />
                <h3 className="text-xl font-bold font-headline">Global Network</h3>
              </div>
              <p className="text-primary-foreground/80">Access opportunities across 50+ countries and thousands of remote positions worldwide.</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <Users className="h-6 w-6 text-accent" />
                <h3 className="text-xl font-bold font-headline">Trusted Community</h3>
              </div>
              <p className="text-primary-foreground/80">Join over 2 million professionals who have found their career path through SwiftJobs.</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <Zap className="h-6 w-6 text-accent" />
                <h3 className="text-xl font-bold font-headline">Rapid Growth</h3>
              </div>
              <p className="text-primary-foreground/80">We're expanding every day, adding new partners and features to serve you better.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
