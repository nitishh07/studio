
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

  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-bg')?.imageUrl || "";
  const aboutImage = PlaceHolderImages.find(img => img.id === 'about-team')?.imageUrl || "";

  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 -z-10">
          <Image 
            src={heroImage} 
            alt="Hero Background" 
            fill 
            className="object-cover opacity-20"
            priority
            data-ai-hint="office space"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/50 to-background" />
        </div>

        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <Zap className="h-4 w-4" />
            Discover 1,000+ new opportunities this week
          </div>
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-6 font-headline text-primary animate-in fade-in slide-in-from-bottom-4 duration-700">
            Find Your Dream Job <span className="text-accent underline decoration-accent/30 underline-offset-8">Today</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000">
            SwiftJobs connects top talent with industry-leading companies. Your next big career move starts here with our simple, clean, and fast platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <a href="#jobs" className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 text-lg">
              Browse Jobs
            </a>
            <a href="#features" className="px-8 py-4 bg-white border border-primary/20 text-primary font-bold rounded-xl hover:bg-primary/5 transition-all text-lg shadow-sm">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 -mt-32 md:-mt-40 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-xl border border-primary/10">
          <div className="text-center">
            <div className="text-3xl md:text-5xl font-extrabold text-primary mb-2">10k+</div>
            <div className="text-sm text-muted-foreground font-bold uppercase tracking-widest">Active Jobs</div>
          </div>
          <div className="text-center border-l border-primary/10">
            <div className="text-3xl md:text-5xl font-extrabold text-primary mb-2">500+</div>
            <div className="text-sm text-muted-foreground font-bold uppercase tracking-widest">Companies</div>
          </div>
          <div className="text-center border-l border-primary/10">
            <div className="text-3xl md:text-5xl font-extrabold text-primary mb-2">24/7</div>
            <div className="text-sm text-muted-foreground font-bold uppercase tracking-widest">Support</div>
          </div>
          <div className="text-center border-l border-primary/10">
            <div className="text-3xl md:text-5xl font-extrabold text-primary mb-2">98%</div>
            <div className="text-sm text-muted-foreground font-bold uppercase tracking-widest">Success Rate</div>
          </div>
        </div>
      </section>

      {/* Jobs Search & Listings Section */}
      <section id="jobs" className="container mx-auto px-4 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold font-headline mb-3">Featured Opportunities</h2>
            <p className="text-muted-foreground text-lg">Curated positions from companies actively hiring right now.</p>
          </div>
          <div className="flex items-center gap-2 text-primary font-bold hover:underline cursor-pointer group">
            View all 12,450 jobs
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-10 border border-primary/10 sticky top-20 z-40 backdrop-blur-sm bg-white/95">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold flex items-center gap-2 text-primary uppercase tracking-wider">
                <Search className="h-4 w-4" />
                Keywords
              </label>
              <Input 
                placeholder="Job title, keywords, or company..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-muted/30 border-none h-12 text-lg focus-visible:ring-primary/30"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2 text-primary uppercase tracking-wider">
                <Briefcase className="h-4 w-4" />
                Job Type
              </label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="bg-muted/30 border-none h-12 text-lg focus:ring-primary/30">
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
              <label className="text-sm font-bold flex items-center gap-2 text-primary uppercase tracking-wider">
                <MapPin className="h-4 w-4" />
                Location
              </label>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="bg-muted/30 border-none h-12 text-lg focus:ring-primary/30">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-4 p-8 rounded-2xl border bg-white shadow-sm">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex gap-4">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                  <Skeleton className="h-12 w-full mt-4" />
                </div>
              ))}
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-primary/20">
              <div className="max-w-xs mx-auto space-y-6">
                <div className="bg-muted/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                   <SlidersHorizontal className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold">No results found</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">Try adjusting your filters or search terms to find more opportunities.</p>
                <button 
                  onClick={() => {setSearchTerm(""); setTypeFilter("all"); setLocationFilter("all");}}
                  className="px-6 py-2 bg-primary/10 text-primary font-bold rounded-lg hover:bg-primary hover:text-white transition-all"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* How it Works Section */}
      <section id="features" className="bg-white py-24 scroll-mt-24 border-y border-primary/5 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-primary/5 -skew-x-12 -z-10 translate-x-20" />
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold font-headline mb-4">How it Works</h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto">Getting started with SwiftJobs is simple. We've streamlined the process to help you land your next role faster.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { 
                icon: Search, 
                title: "1. Search", 
                desc: "Filter by role, company, or location to find the perfect match for your skills in seconds." 
              },
              { 
                icon: Zap, 
                title: "2. Quick View", 
                desc: "Read detailed, AI-enhanced job descriptions that tell you exactly what to expect from the role." 
              },
              { 
                icon: CheckCircle, 
                title: "3. Apply", 
                desc: "Connect directly with official company portals and start your application process immediately." 
              }
            ].map((step, idx) => (
              <div key={idx} className="bg-background p-10 rounded-3xl border shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow group">
                <div className="bg-primary/10 p-6 rounded-2xl mb-8 group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="container mx-auto px-4 scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[4/3] lg:aspect-square rounded-[2rem] overflow-hidden shadow-2xl">
            <Image 
              src={aboutImage} 
              alt="About SwiftJobs" 
              fill 
              className="object-cover"
              data-ai-hint="team working"
            />
            <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-primary/10">
              <p className="italic font-medium text-primary text-lg">
                "SwiftJobs reduced our hiring time by 40% in just three months."
              </p>
              <p className="text-sm font-bold mt-2 text-muted-foreground">— Sarah Jenkins, HR Director at TechCorp</p>
            </div>
          </div>
          <div className="space-y-8">
            <div className="inline-block bg-accent/20 text-accent-foreground px-6 py-2 rounded-full text-sm font-extrabold tracking-widest uppercase border border-accent/20">
              Our Mission
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold font-headline leading-tight">
              Empowering Careers with <span className="text-primary italic">Simplicity</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              At SwiftJobs, we believe the job search process shouldn't be a second full-time job. Our mission is to eliminate the noise and connect talent directly to opportunity.
            </p>
            <div className="space-y-6">
              {[
                { title: "Transparent Listings", desc: "Every posting is verified and clear about requirements and location." },
                { title: "AI-Powered Insights", desc: "We use cutting-edge AI to help companies craft clear, informative job listings." },
                { title: "User-Centric Experience", desc: "A distraction-free interface focused purely on getting you hired." }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="mt-1 bg-primary text-white p-1 rounded-full shrink-0">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xl mb-1">{item.title}</h4>
                    <p className="text-muted-foreground text-lg">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Info Section (Website Info) */}
      <section className="bg-primary py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div className="bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/10 space-y-4">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <Globe className="h-8 w-8 text-accent" />
                <h3 className="text-2xl font-bold font-headline text-white">Global Network</h3>
              </div>
              <p className="text-primary-foreground/80 text-lg leading-relaxed">Access opportunities across 50+ countries and thousands of remote positions worldwide.</p>
            </div>
            <div className="bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/10 space-y-4">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <Users className="h-8 w-8 text-accent" />
                <h3 className="text-2xl font-bold font-headline text-white">Trusted Community</h3>
              </div>
              <p className="text-primary-foreground/80 text-lg leading-relaxed">Join over 2 million professionals who have found their career path through SwiftJobs.</p>
            </div>
            <div className="bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/10 space-y-4">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <Zap className="h-8 w-8 text-accent" />
                <h3 className="text-2xl font-bold font-headline text-white">Rapid Growth</h3>
              </div>
              <p className="text-primary-foreground/80 text-lg leading-relaxed">We're expanding every day, adding new partners and features to serve you better.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
