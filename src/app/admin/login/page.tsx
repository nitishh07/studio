"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useAuth, useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, Mail, Loader2, UserPlus, LogIn, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      router.push("/admin");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoading(true);
    setErrorMsg(null);
    
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({
          title: "Account Created",
          description: "Your admin account has been created successfully.",
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push("/admin");
    } catch (error: any) {
      console.error("Auth Error:", error);
      let message = "An error occurred. Please try again.";
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        message = "Invalid credentials. Please check your email and password.";
      } else if (error.code === 'auth/email-already-in-use') {
        message = "This email is already registered. Please sign in instead.";
      } else if (error.code === 'auth/weak-password') {
        message = "Password should be at least 6 characters.";
      } else if (error.code === 'auth/operation-not-allowed') {
        message = "Email/Password sign-in is not enabled in Firebase Console.";
      }
      
      setErrorMsg(message);
      toast({
        title: isSignUp ? "Sign Up Failed" : "Login Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 bg-muted/20">
      <Card className="w-full max-w-md shadow-2xl border-primary/5 rounded-[2rem] overflow-hidden">
        <CardHeader className="space-y-1 text-center bg-muted/30 pb-8 pt-10">
          <div className="mx-auto bg-primary/10 w-20 h-20 rounded-3xl flex items-center justify-center mb-6 rotate-6 transition-transform hover:rotate-0">
            {isSignUp ? <UserPlus className="h-10 w-10 text-primary" /> : <Lock className="h-10 w-10 text-primary" />}
          </div>
          <CardTitle className="text-4xl font-black font-headline tracking-tighter">
            {isSignUp ? "Join Console" : "Welcome Back"}
          </CardTitle>
          <CardDescription className="text-lg">
            {isSignUp 
              ? "Create your administrator account" 
              : "Enter your credentials to access the console"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-8">
            {errorMsg && (
              <Alert variant="destructive" className="bg-destructive/5 text-destructive border-destructive/20 rounded-xl">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="font-medium">{errorMsg}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-black uppercase tracking-widest text-primary/70">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@swiftjobs.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-14 text-lg bg-muted/30 border-none rounded-xl focus-visible:ring-primary/20"
                  required 
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="password" className="text-sm font-black uppercase tracking-widest text-primary/70">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 h-14 text-lg bg-muted/30 border-none rounded-xl focus-visible:ring-primary/20"
                  required 
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-6 pb-12 pt-4 px-8">
            <Button className="w-full font-black h-14 text-xl rounded-2xl shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-1" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                  Authenticating...
                </>
              ) : (
                isSignUp ? "Create Admin Account" : "Sign Into Console"
              )}
            </Button>
            <div className="text-base text-center text-muted-foreground font-medium">
              {isSignUp ? "Already have an account?" : "Need admin access?"}{" "}
              <button 
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setErrorMsg(null);
                }}
                className="text-primary font-black hover:underline underline-offset-4"
              >
                {isSignUp ? "Sign In" : "Register Admin"}
              </button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
