
"use client";

import { useState, useEffect } from "react";
import { Job } from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Loader2, Save, X } from "lucide-react";
import { generateJobDescription } from "@/ai/flows/generate-job-description";

interface AdminJobFormProps {
  job?: Job;
  onSave: (jobData: Partial<Job>) => Promise<void>;
  onCancel: () => void;
}

export default function AdminJobForm({ job, onSave, onCancel }: AdminJobFormProps) {
  const [formData, setFormData] = useState({
    title: job?.title || "",
    company: job?.company || "",
    location: job?.location || "",
    type: job?.type || "Full-time",
    applyLink: job?.applyLink || "",
    description: job?.description || "",
  });
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
      toast({ title: "Success", description: `Job ${job ? 'updated' : 'created'} successfully.` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save job posting.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateAI = async () => {
    if (!formData.title || !formData.company) {
      toast({ title: "Incomplete Data", description: "Please provide a job title and company name first.", variant: "destructive" });
      return;
    }

    setGenerating(true);
    try {
      // Mocking responsibilities for simpler AI trigger, or we could ask user
      const result = await generateJobDescription({
        title: formData.title,
        company: formData.company,
        responsibilities: ["Contribute to development projects", "Collaborate with cross-functional teams", "Improve existing codebase"]
      });
      setFormData(prev => ({ ...prev, description: result.description }));
      toast({ title: "AI Generated", description: "Job description enhanced by AI." });
    } catch (error) {
      toast({ title: "AI Error", description: "Failed to generate description.", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <h2 className="text-xl font-bold mb-6 font-headline flex items-center gap-2">
        {job ? 'Edit Job Posting' : 'Add New Job Posting'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" name="company" value={formData.company} onChange={handleInputChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" value={formData.location} placeholder="e.g. Remote, New York, NY" onChange={handleInputChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Job Type</Label>
            <Select value={formData.type} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="applyLink">Application Link (URL)</Label>
            <Input id="applyLink" name="applyLink" type="url" value={formData.applyLink} onChange={handleInputChange} placeholder="https://company.com/careers/apply" required />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center mb-1">
            <Label htmlFor="description">Job Description</Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={handleGenerateAI}
              disabled={generating}
              className="gap-2 text-primary border-primary/20 hover:bg-primary/5"
            >
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              AI Suggest
            </Button>
          </div>
          <Textarea 
            id="description" 
            name="description" 
            rows={10} 
            value={formData.description} 
            onChange={handleInputChange} 
            placeholder="Outline the responsibilities, requirements, and benefits of the role..."
            required 
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving} className="gap-2 min-w-[120px]">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {job ? 'Update Job' : 'Post Job'}
          </Button>
        </div>
      </form>
    </div>
  );
}
