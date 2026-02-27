
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BriefcaseBusiness, Twitter, Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-full border-t bg-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-primary p-2 rounded-lg">
                <BriefcaseBusiness className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight text-primary font-headline">SwiftJobs</span>
            </Link>
            <p className="text-muted-foreground max-w-sm leading-relaxed">
              Empowering the world's talent to find their perfect career match. Simple, fast, and transparent job listings for the modern professional.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="p-2 bg-muted rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-muted rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-muted rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-6">Platform</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/#jobs" className="hover:text-primary transition-colors">Browse Jobs</Link></li>
              <li><Link href="/#features" className="hover:text-primary transition-colors">How it Works</Link></li>
              <li><Link href="/admin/login" className="hover:text-primary transition-colors">Post a Job</Link></li>
              <li><Link href="/#about" className="hover:text-primary transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="mailto:support@swiftjobs.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="h-4 w-4" />
                Contact Us
              </a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {year || "..."} SwiftJobs Platform. All rights reserved.</p>
          <p>Built with efficiency and speed for the next generation of workers.</p>
        </div>
      </div>
    </footer>
  );
}
