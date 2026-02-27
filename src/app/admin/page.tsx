
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, query, orderBy, onSnapshot, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/contexts/auth-context";
import { Job } from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Edit, Trash2, LayoutDashboard, Search, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import AdminJobForm from "@/components/AdminJobForm";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | undefined>(undefined);
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/admin/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

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
  }, [user]);

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    j.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveJob = async (jobData: Partial<Job>) => {
    if (editingJob) {
      await updateDoc(doc(db, "jobs", editingJob.id), jobData);
    } else {
      await addDoc(collection(db, "jobs"), {
        ...jobData,
        postedAt: serverTimestamp(),
      });
    }
    setShowForm(false);
    setEditingJob(undefined);
  };

  const handleDeleteJob = async () => {
    if (deletingJobId) {
      try {
        await deleteDoc(doc(db, "jobs", deletingJobId));
        toast({ title: "Deleted", description: "Job posting removed successfully." });
      } catch (error) {
        toast({ title: "Error", description: "Failed to delete job.", variant: "destructive" });
      } finally {
        setDeletingJobId(null);
      }
    }
  };

  if (authLoading || (loading && !showForm)) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold font-headline flex items-center gap-2">
            <LayoutDashboard className="h-8 w-8 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Manage your job board postings and applications.</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="gap-2 font-bold py-6 px-8 rounded-xl shadow-lg hover:shadow-primary/20 transition-all">
            <Plus className="h-5 w-5" />
            Post New Job
          </Button>
        )}
      </div>

      {showForm ? (
        <AdminJobForm 
          job={editingJob} 
          onSave={handleSaveJob} 
          onCancel={() => { setShowForm(false); setEditingJob(undefined); }} 
        />
      ) : (
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search managed jobs..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>

          {/* Jobs Table */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <TableRow key={job.id} className="hover:bg-primary/5 transition-colors">
                      <TableCell className="font-semibold">{job.title}</TableCell>
                      <TableCell>{job.company}</TableCell>
                      <TableCell>
                        <Badge variant={job.type === 'Full-time' ? 'default' : 'secondary'}>
                          {job.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{job.location}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => { setEditingJob(job); setShowForm(true); }}
                            className="h-8 w-8 hover:text-primary hover:bg-primary/10"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setDeletingJobId(job.id)}
                            className="h-8 w-8 hover:text-destructive hover:bg-destructive/10"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <a href={`/jobs/${job.id}`} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="icon" className="h-8 w-8" title="View Public Page">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </a>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                      No jobs found. Click "Post New Job" to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingJobId} onOpenChange={() => setDeletingJobId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the job posting from the SwiftJobs board.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteJob} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
