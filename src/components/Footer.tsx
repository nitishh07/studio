"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BriefcaseBusiness, Twitter, Github, Linkedin, Mail, ExternalLink } from "lucide-react";

export default function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-full border-t bg-white pt-24 pb-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-6">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="bg-primary p-2.5 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                <BriefcaseBusiness className="h-7 w-7 text-primary-foreground" />
              </div>
              <span className="text-3xl font-black tracking-tighter text-primary font-headline italic">SwiftJobs</span>
            </Link>
            <p className="text-muted-foreground max-w-sm text-lg leading-relaxed">
              Empowering global talent to find their perfect career match. Minimalist, high-performance job listings for the next generation.
            </p>
            <div className="flex space-x-5 pt-4">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="p-3 bg-muted rounded-2xl hover:bg-primary hover:text-white transition-all duration-300">
                  <Icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-black text-xl mb-8 uppercase tracking-widest text-primary/40 text-sm">Platform</h4>
            <ul className="space-y-5 text-base font-bold text-muted-foreground">
              <li><Link href="/#jobs" className="hover:text-primary transition-colors">Browse Jobs</Link></li>
              <li><Link href="/#about" className="hover:text-primary transition-colors">Our Mission</Link></li>
              <li><Link href="/admin/login" className="hover:text-primary transition-colors flex items-center gap-2">
                Recruiter Portal
                <ExternalLink className="h-4 w-4" />
              </Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-black text-xl mb-8 uppercase tracking-widest text-primary/40 text-sm">Resources</h4>
            <ul className="space-y-5 text-base font-bold text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Guide</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="mailto:support@swiftjobs.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="h-4 w-4" />
                Direct Contact
              </a></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-primary/5 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-muted-foreground font-medium">
          <p>© {year || "2024"} SwiftJobs Platform. Built for excellence.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary">Help Center</a>
            <a href="#" className="hover:text-primary">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
