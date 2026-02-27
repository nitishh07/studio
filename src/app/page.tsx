"use client";

import { useState, useMemo } from "react";
import { collection, query, orderBy } from "firebase/firestore";
import { useFirestore, useCollection } from "@/firebase";
import JobCard, { Job } from "@/components/JobCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, Briefcase, MapPin, CheckCircle, Users, Globe, Zap, ArrowRight, Star, Quote } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";

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

  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-bg')?.imageUrl || "https://picsum.photos/seed/office/1920/1080";
  const aboutImage = PlaceHolderImages.find(img => img.id === 'about-team')?.imageUrl || "https://picsum.photos/seed/team/1000/1000";

  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-20 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-muted">
          <Image 
            src={heroImage} 
            alt="Hero Background" 
            fill 
            className="object-cover opacity-30"
            priority
            data-ai-hint="office space"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/60 to-background" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-full text-sm font-bold mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <Zap className="h-4 w-4 fill-primary" />
            Join 50,000+ professionals landing jobs monthly
          </div>
          <h1 className="text-5xl md:text-8xl font-extrabold tracking-tight mb-8 font-headline leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-700">
            The Future of <br />
            <span className="text-primary italic">Career Search</span> Is Here
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000">
            SwiftJobs connects world-class talent with industry giants. Distraction-free, fast, and remarkably simple.
          </p>
          <div className="flex flex-wrap justify-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <a href="#jobs" className="px-10 py-5 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 text-lg hover:-translate-y-1">
              Find My Next Role
            </a>
            <a href="#about" className="px-10 py-5 bg-white/80 backdrop-blur-sm border border-primary/10 text-primary font-bold rounded-2xl hover:bg-white transition-all text-lg shadow-sm">
              Our Mission
            </a>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-[2.5rem] p-12">
          <p className="text-center text-sm font-bold text-muted-foreground uppercase tracking-[0.2em] mb-10">Trusted by Global Leaders</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="text-3xl font-black text-slate-800 tracking-tighter">Google</div>
             <div className="text-3xl font-black text-slate-800 tracking-tighter">Amazon</div>
             <div className="text-3xl font-black text-slate-800 tracking-tighter">Stripe</div>
             <div className="text-3xl font-black text-slate-800 tracking-tighter">Netflix</div>
             <div className="text-3xl font-black text-slate-800 tracking-tighter">Meta</div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { icon: Users, label: "Active Job Seekers", value: "2.4M+", color: "bg-blue-50 text-blue-600" },
             { icon: Briefcase, label: "Verified Employers", value: "850+", color: "bg-purple-50 text-purple-600" },
             { icon: Globe, label: "Countries Reached", value: "62", color: "bg-emerald-50 text-emerald-600" },
           ].map((stat, i) => (
             <div key={i} className="flex items-center gap-6 bg-white p-10 rounded-3xl border shadow-sm hover:shadow-md transition-shadow">
               <div className={`p-5 rounded-2xl ${stat.color}`}>
                 <stat.icon className="h-8 w-8" />
               </div>
               <div>
                 <div className="text-4xl font-black tracking-tight">{stat.value}</div>
                 <div className="text-muted-foreground font-medium">{stat.label}</div>
               </div>
             </div>
           ))}
        </div>
      </section>

      {/* Search & Listings */}
      <section id="jobs" className="container mx-auto px-4 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <Badge variant="outline" className="mb-4 text-primary border-primary/20 px-3 py-1 font-bold">LATEST OPPORTUNITIES</Badge>
            <h2 className="text-4xl md:text-5xl font-black font-headline tracking-tight">Discover Your Potential</h2>
            <p className="text-muted-foreground text-xl mt-2">The most innovative companies are waiting for you.</p>
          </div>
          <div className="flex items-center gap-2 text-primary font-bold hover:underline cursor-pointer group text-lg">
            See all roles
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-primary/5 mb-12 sticky top-20 z-40 backdrop-blur-md bg-white/90">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="md:col-span-2 space-y-3">
              <label className="text-xs font-black text-primary uppercase tracking-widest">Keywords</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Software Engineer, Designer..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-muted/30 border-none h-14 pl-12 text-lg focus-visible:ring-primary/20 rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black text-primary uppercase tracking-widest">Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="bg-muted/30 border-none h-14 text-lg rounded-xl">
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
            <div className="space-y-3">
              <label className="text-xs font-black text-primary uppercase tracking-widest">Location</label>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="bg-muted/30 border-none h-14 text-lg rounded-xl">
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

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-4 p-8 rounded-3xl border bg-white shadow-sm">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-24 w-full mt-4" />
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
          <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-primary/10">
            <div className="max-w-md mx-auto space-y-8">
              <div className="bg-muted/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
                 <SlidersHorizontal className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-3xl font-black">No matches found</h3>
              <p className="text-muted-foreground text-xl leading-relaxed">Adjust your filters or clear your search to explore more opportunities.</p>
              <button 
                onClick={() => {setSearchTerm(""); setTypeFilter("all"); setLocationFilter("all");}}
                className="px-10 py-4 bg-primary text-white font-black rounded-2xl shadow-lg hover:shadow-primary/20 transition-all"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Testimonials */}
      <section className="bg-slate-900 py-24 text-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">What Our Users Say</h2>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto">Real stories from professionals who found their path on SwiftJobs.</p>
          </div>
          
          <Carousel className="max-w-4xl mx-auto">
            <CarouselContent>
              {[
                { name: "Alex Rivera", role: "Product Designer @ Airbnb", text: "SwiftJobs removed the clutter. I found my current role within 2 weeks of joining." },
                { name: "Jessica Chen", role: "Lead Engineer @ Vercel", text: "The cleanest job board I've ever used. The AI descriptions are actually helpful." },
                { name: "Marcus Thorne", role: "Marketing Director @ Nike", text: "Quality over quantity. Every job here is a real opportunity from a real brand." },
              ].map((t, i) => (
                <CarouselItem key={i}>
                  <div className="p-10 text-center space-y-6">
                    <Quote className="h-12 w-12 text-primary mx-auto opacity-50" />
                    <p className="text-2xl md:text-3xl font-medium italic leading-relaxed">"{t.text}"</p>
                    <div>
                      <div className="text-xl font-black text-primary">{t.name}</div>
                      <div className="text-slate-400">{t.role}</div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="bg-white/10 border-white/20 text-white" />
              <CarouselNext className="bg-white/10 border-white/20 text-white" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="container mx-auto px-4 scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative rounded-[3rem] overflow-hidden shadow-2xl group">
            <Image 
              src={aboutImage} 
              alt="Our Team" 
              width={800}
              height={800}
              className="object-cover hover:scale-105 transition-transform duration-700"
              data-ai-hint="team working"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
          </div>
          <div className="space-y-8">
            <Badge className="bg-accent text-accent-foreground px-4 py-1.5 font-black uppercase tracking-widest">Our Story</Badge>
            <h2 className="text-5xl md:text-6xl font-black font-headline tracking-tighter leading-tight">
              Reinventing the <span className="text-primary italic">Hiring Standard</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We started SwiftJobs because we were tired of generic, ad-filled job boards. We believe finding a job should be as exciting as getting one.
            </p>
            <div className="space-y-8">
              {[
                { title: "No Noise, Just Results", desc: "We vet every listing and every employer to ensure high-quality standards." },
                { title: "AI-Powered Clarity", desc: "Our engine helps employers write descriptions that actually make sense." },
                { title: "Fast-Track Applications", desc: "Connect directly to hiring managers through our streamlined portal." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-6 group">
                  <div className="mt-1 bg-primary/10 text-primary p-3 rounded-2xl group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-2xl mb-1">{item.title}</h4>
                    <p className="text-muted-foreground text-lg leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
